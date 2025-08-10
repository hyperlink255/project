import qrcode from 'qrcode'
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";
import Stripe from "stripe";
import Event from "../models/Event.js";
import Booking from "../models/Booking.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createBooking = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const userId = req.user._id;
        const { eventId, tickets } = req.body;

        if (!eventId || !tickets || tickets <= 0) {
            return res.status(400).json({ success: false, message: "eventId and positive tickets required" });
        }

        // Start Transaction
        session.startTransaction();

        // Event find
        const event = await Event.findById(eventId).session(session);
        if (!event) {
            await session.abortTransaction();
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        // Ticket availability check
        const availableTickets = event.totalTickets - event.soldTickets;
        if (availableTickets < tickets) {
            await session.abortTransaction();
            return res.status(400).json({ success: false, message: "Not enough tickets available" });
        }

        // Price calculation
        const totalAmount = event.price * tickets; // INR
        const stripeAmount = Math.round(totalAmount * 100); // Convert to paise

        // Create booking with pending status
        const booking = await Booking.create(
            [
                {
                    user: userId,
                    event: eventId,
                    tickets,
                    totalAmount,
                    paymentStatus: "pending"
                }
            ],
            { session }
        );

        const createdBooking = booking[0];

        // Update event's soldTickets
        event.soldTickets += tickets;
        await event.save({ session });

        // Commit transaction (DB changes)
        await session.commitTransaction();
        session.endSession();

        // Create Stripe PaymentIntent (outside transaction)
        const paymentIntent = await stripe.paymentIntents.create({
            amount: stripeAmount,
            currency: "inr",
            metadata: {
                bookingId: createdBooking._id.toString(),
                eventId: eventId.toString()
            }
        });

        return res.status(201).json({
            success: true,
            bookingId: createdBooking._id,
            clientSecret: paymentIntent.client_secret
        });

    } catch (error) {
        await session.abortTransaction().catch(() => {});
        session.endSession();
        return res.status(500).json({ success: false, message: error.message });
    }
};

export const stripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const bookingId = paymentIntent.metadata.bookingId;

        await Booking.findByIdAndUpdate(bookingId, { paymentStatus: "paid" });
        console.log(`Booking ${bookingId} marked as paid.`);
    }

    if (event.type === "payment_intent.payment_failed") {
        const paymentIntent = event.data.object;
        const bookingId = paymentIntent.metadata.bookingId;

        await Booking.findByIdAndUpdate(bookingId, { paymentStatus: "failed" });
        console.log(`Booking ${bookingId} marked as failed.`);
    }

    res.json({ received: true });
};
