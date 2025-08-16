import axios from "axios";
import { useContext, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { AppContext } from "../context/AppContext";
import { createAxiosInstance } from "../services/axiosInstance";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

function Booking() {
  const [tickets, setTickets] = useState(1);
  const [clientSecret, setClientSecret] = useState(null);
  const { events, BACKEND_URL } = useContext(AppContext);
  const axios = createAxiosInstance(BACKEND_URL);
  const stripe = useStripe();
  const elements = useElements();
  const { eventId } = useParams();
  const event = events.find((e) => e._id === eventId);

  const handleBooking = async () => {
    try {
      const res = await axios.post(
        "/api/bookings/booking",
        { eventId: event._id, tickets },
        { withCredentials: true }
      );
      if (res.status === 201) {
        setClientSecret(res.data.clientSecret);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePayment = async () => {
    if (!stripe || !elements || !clientSecret) return;

    const cardElement = elements.getElement(CardElement);

    const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      console.error("Payment failed:", error.message);
      toast.error("Payment failed ❌");
    } else if (paymentIntent.status === "succeeded") {
      toast.success("Payment successful 🎉");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          🎟️ Book Your Event
        </h1>

        {event ? (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700">{event.title}</h2>
            <p className="text-gray-500 text-sm">
              Price: <span className="font-medium text-gray-800">₹{event.price}</span> per ticket
            </p>
          </div>
        ) : (
          <p className="text-red-500 mb-6 text-center">Event not found</p>
        )}

        {/* Ticket Input */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Number of Tickets
          </label>
          <input
            type="number"
            min="1"
            value={tickets}
            onChange={(e) => setTickets(Number(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Booking Button */}
        <button
          onClick={handleBooking}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-300"
        >
          Create Booking
        </button>

        {clientSecret && (
          <div className="mt-8">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Enter Payment Details
            </label>
            <div className="p-3 border rounded-lg mb-4 shadow-sm">
              <CardElement />
            </div>
            <button
              onClick={handlePayment}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition duration-300"
            >
              Pay Now 💳
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookingWrapper() {
  return (
    <Elements stripe={stripePromise}>
      <Booking />
    </Elements>
  );
}
