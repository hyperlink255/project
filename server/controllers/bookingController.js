import mongoose from "mongoose";
import Stripe from "stripe";
import Event from "../models/eventModel.js";
import Booking from "../models/bookingModel.js";
import { v2 as cloudinary } from "cloudinary";
import qrcode from "qrcode";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createBooking = async (req, res) => {
    const session = await mongoose.startSession();
    try {
        const userId = req.user._id;
        const { eventId, tickets } = req.body;
        console.log(eventId, tickets);

        if (!eventId || !tickets || tickets <= 0) {
            return res.status(400).json({ success: false, message: "eventId and positive tickets required" });
        }

        session.startTransaction();

        const event = await Event.findById(eventId).session(session);
        if (!event) {
            await session.abortTransaction();
            return res.status(404).json({ success: false, message: "Event not found" });
        }

        const availableTickets = event.totalTickets - event.soldTickets;
        if (availableTickets < tickets) {
            await session.abortTransaction();
            return res.status(400).json({ success: false, message: "Not enough tickets available" });
        }

        const totalAmount = event.price * tickets; // INR
        const stripeAmount = Math.round(totalAmount * 100);

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

        event.soldTickets += tickets;
        await event.save({ session });

        await session.commitTransaction();
        session.endSession();

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
        await session.abortTransaction().catch(() => { });
        session.endSession();
        return res.status(500).json({ success: false, message: error.message });
    }
};
export const getAllBooking = async (req, res) => {
    try {
        const userId = req.user._id;
        const role = req.user.role;
        const title = req.query.title || ''
        const paymentStatus = req.query.paymentStatus || ''
        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5;
        const skip = (page - 1) * limit
        let filter = {};
        if (role === "user") {
            filter.user = userId
        }

        if (role === "organizer") {
            const organizerEvent = await Event.find({ organizer: userId }).select('_id');
            filter.event = { $in: organizerEvent.map(event => event._id) };
        }
        if (title) {
            const matchedEvents = await Event.find({ title: { $regex: title, $options: 'i' } }).select("_id")
            const matchedEventsIds = matchedEvents.map(event => event._id);
            if (filter.event) {
                filter.event = {
                    $in: matchedEventsIds.filter(id => filter.event.$in.includes(id))
                }
            } else {
                filter.event = {
                    $in: matchedEventsIds
                }
            }
        }
        if (paymentStatus) {
            obj.paymentStatus = paymentStatus
        }

        const total = await Booking.countDocuments(filter)
        const bookings = await Booking.find(obj).skip(skip).limit(limit).populate("event user");
        res.status(200).json({
            success: true,
            total,
            page,
            limit,
            bookings
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });

    }
}
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

        const booking = await Booking.findById(bookingId).populate("event user");
        if (!booking) {
            console.error(`Booking ${bookingId} not found`);
            return;
        }

        const qrUrl = await generateAndUploadQRCode(
            `${process.env.FRONTEND_URL}/ticket/${booking._id}`, // payload
            "ticket_qr" // optional prefix
        );

        booking.paymentStatus = "paid";
        booking.qrCode = qrUrl;
        await booking.save();

        console.log(`Booking ${bookingId} marked as paid and QR generated.`);
    }

    if (event.type === "payment_intent.payment_failed") {
        const paymentIntent = event.data.object;
        const bookingId = paymentIntent.metadata.bookingId;

        await Booking.findByIdAndUpdate(bookingId, { paymentStatus: "failed" });
        console.log(`Booking ${bookingId} marked as failed.`);
    }

    res.json({ received: true });
};
export const getSingleBooking = async (req, res) => {
    try {
        const userId = req.user._id;
        const bookingId = req.params.id;
        const role = req.user._id;

        const booking = await Booking.findById(bookingId).populate("user event");
        if (!booking) {
            return res.status(401).json({ success: false, message: "Booking not found" })
        }

        if (role === "user" && booking.user._id.toString() !== userId.toString()) {
            return res.status(403).json({ success: false, message: "Unauthorized access" })
        }

        if (role === "organizer") {
            const eventDetails = await Event.findById(booking.event._id)
            if (!eventDetails || eventDetails.organizer.toString() !== userId.toString()) {
                return res.status(403).json({ success: false, message: "Unauthorized access" })
            }
        }
        res.status(200).json({
            success: true,
            booking
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
export const updateBooking = async (req, res) => {
    try {
        const bookingId = req.params.id;
        const { tickets, paymentStatus } = req.body;
        const booking = await Booking.findById(bookingId).populate("event user");
        if (!booking) return res.status(404).json({ message: "Booking not found" });
        if (req.user.role === 'user') {
            return res.status(403).json({ message: "Not authorized" });
        }
        if (req.user.role === 'organizer' &&
            booking.event.organizer.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({ message: "Not authorized" });
        }
        if (tickets) {
            if (new Date(booking.event.date) <= Date.now()) {
                return res.status(400).json({ message: "Event already started" })
            }
            booking.tickets = tickets
        }

        const allowed = {
            pending: ["paid", "failed"],
            failed: ["paid"],
            paid: []

        }
        if (paymentStatus && paymentStatus !== booking.paymentStatus) {
            if (!allowed[booking.paymentStatus].includes(paymentStatus)) {
                return res.status(400).json({ message: "Invalid payment status change" });
            }
            booking.paymentStatus = paymentStatus;
        }
        if ((tickets && booking.paymentStatus === "paid") ||
            (paymentStatus === "paid")) {
            booking.qrCode = await generateAndUploadQRCode(
                `${process.env.FRONTEND_URL}/ticket/${booking._id}`,
                `booking_${booking._id}`
            )
        }
        await booking.save();
        res.json({ success: true, booking });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
export const cancelBooking = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const bookingId = req.params.id;
    const user = req.user; 

    const booking = await Booking.findById(bookingId).populate("event user");
    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });

    if (user.role !== "admin" && booking.user._id.toString() !== user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to cancel this booking" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Booking already cancelled" });
    }

    if (booking.event && booking.event.date && new Date(booking.event.date) <= new Date()) {
      return res.status(400).json({ success: false, message: "Cannot cancel after event start" });
    }

    await session.startTransaction();

    booking.status = "cancelled";
    await booking.save({ session });

    if (booking.event) {
      const event = await Event.findById(booking.event._id).session(session);
      event.soldTickets = Math.max(0, (event.soldTickets || 0) - (booking.tickets || 0));
      await event.save({ session });
    }

    await session.commitTransaction();
    session.endSession();

    if (booking.paymentStatus === "paid" && stripe && booking.paymentInfo && booking.paymentInfo.paymentIntentId) {
      try {
        await stripe.refunds.create({
          payment_intent: booking.paymentInfo.paymentIntentId,
          metadata: { bookingId: booking._id.toString() },
        });

        booking.paymentStatus = "refunded";
        booking.refundInfo = { refundedAt: new Date() };
        await booking.save();
      } catch (refundErr) {
        console.error("Refund error:", refundErr);
        return res.status(200).json({
          success: true,
          message: "Booking cancelled but refund failed. Admin will handle refund.",
          booking,
          refundError: refundErr.message,
        });
      }
    }

    return res.status(200).json({ success: true, message: "Booking cancelled", booking });
  } catch (err) {
    try { await session.abortTransaction(); } catch(e){/*ignore*/ }
    session.endSession();
    return res.status(500).json({ success: false, message: err.message });
  }
};
export const cancelBookingsByEvent = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    const eventId = req.params.eventId;
    const user = req.user;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ success: false, message: "Event not found" });

    if (user.role !== "admin" && event.organizer.toString() !== user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to cancel bookings for this event" });
    }

    await session.startTransaction();

    const result = await Booking.updateMany(
      { event: eventId, status: { $ne: "cancelled" } },
      { $set: { status: "cancelled" } },
      { session }
    );

    event.soldTickets = 0;
    event.status = "cancelled"; 
    await event.save({ session });

    await session.commitTransaction();
    session.endSession();

    if (stripe) {
      const paidBookings = await Booking.find({ event: eventId, paymentStatus: "paid" }).lean();
      for (const b of paidBookings) {
        if (b.paymentInfo && b.paymentInfo.paymentIntentId) {
          try {
            await stripe.refunds.create({
              payment_intent: b.paymentInfo.paymentIntentId,
              metadata: { bookingId: b._id.toString() },
            });
            await Booking.findByIdAndUpdate(b._id, { paymentStatus: "refunded", "refundInfo.refundedAt": new Date() });
          } catch (refundErr) {
            console.error(`Refund failed for booking ${b._id}:`, refundErr.message);
          }
        }
      }
    }

    return res.status(200).json({ success: true, message: "Event cancelled, bookings marked cancelled", modifiedCount: result.nModified || result.modifiedCount });
  } catch (err) {
    try { await session.abortTransaction(); } catch(e){/*ignore*/ }
    session.endSession();
    return res.status(500).json({ success: false, message: err.message });
  }
};
export const getOrganizerDashboard = async (req, res) => {
  try {
    const organizerId = req.user._id;

    const events = await Event.find({ organizer: organizerId }).select("_id");
    const eventIds = events.map(e => e._id);

    const matchStage = {
      $match: {
        event: { $in: eventIds },
        paymentStatus: "paid"
      }
    };

    const summary = await Booking.aggregate([
      matchStage,
      {
        $group: {
          _id: null,
          totalTicketsSold: { $sum: "$tickets" },
          totalRevenue: { $sum: "$totalAmount" }
        }
      }
    ]);

    const totals = summary[0] || { totalTicketsSold: 0, totalRevenue: 0 };

    const monthly = await Booking.aggregate([
      matchStage,
      {
        $group: {
          _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          tickets: { $sum: "$tickets" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } }
    ]);

    const monthlyFormatted = monthly.map(m => ({
      year: m._id.year,
      month: m._id.month,
      revenue: m.revenue,
      tickets: m.tickets,
      bookings: m.count
    }));

    return res.status(200).json({
      success: true,
      data: {
        totalTicketsSold: totals.totalTicketsSold || 0,
        totalRevenue: totals.totalRevenue || 0,
        monthly: monthlyFormatted
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
export const getUserDashboard = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date();

    const totalBookingsCount = await Booking.countDocuments({ user: userId, status: { $ne: "cancelled" } });

    const upcoming = await Booking.find({
      user: userId,
      status: { $ne: "cancelled" }
    }).populate({
      path: "event",
      match: { date: { $gt: today } }
    }).sort({ "event.date": 1 });

    const upcomingFiltered = upcoming.filter(b => b.event);

    const past = await Booking.find({
      user: userId,
      status: { $ne: "cancelled" }
    }).populate({
      path: "event",
      match: { date: { $lt: today } }
    }).sort({ "event.date": -1 });

    const pastFiltered = past.filter(b => b.event);

    return res.status(200).json({
      success: true,
      data: {
        totalBookings: totalBookingsCount,
        upcoming: upcomingFiltered,
        past: pastFiltered
      }
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};
export async function generateAndUploadQRCode(payload, publicIdPrefix = "booking_qr") {
    const qrString = typeof payload === "string" ? payload : JSON.stringify(payload);

    const dataUrl = await qrcode.toDataURL(qrString, { errorCorrectionLevel: "H" });
    const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const uploadResult = await cloudinary.uploader.upload_stream_async
        ? await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: "booking_qr",
                    public_id: `${publicIdPrefix}_${Date.now()}`,
                    overwrite: true,
                    resource_type: "image",
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            stream.end(buffer);
        })
        :
        await cloudinary.uploader.upload(dataUrl, {
            folder: "booking_qr",
            public_id: `${publicIdPrefix}_${Date.now()}`,
        });

    return uploadResult.secure_url || uploadResult.url;
}



