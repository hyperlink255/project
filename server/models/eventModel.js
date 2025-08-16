import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Event title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    category: {
      type: String,
      enum: ["Music", "Sports", "Workshop", "Conference", "Other"],
      default: "Other",
    },
    date: {
      type: Date,
      required: [true, "Event date is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    price: {
      type: Number,
      required: [true, "Ticket price is required"],
    },
    totalTickets: {
      type: Number,
      required: [true, "Total tickets required"],
    },
    availableTickets: {
      type: Number,
      required: true,
    },
    image: {
      type: String, // Cloudinary URL
      required: true,
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reviews : [{
      type:mongoose.Schema.Types.ObjectId,
      ref: "Review",
      required:true,
    }],
    
    status: {
      type: String,
      enum: ["pending", "approved", "rejected","cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Event =  mongoose.model("Event", eventSchema);
export default Event
