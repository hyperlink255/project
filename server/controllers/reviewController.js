import Review from "../models/reviewModel.js";
import Event from "../models/eventModel.js";

export const createReview = async (req, res) => {
  try {
    const { event, rating, comment } = req.body;
    const userId = req.user._id;

    const eventData = await Event.findById(event);
    if (!eventData) {
      return res.status(404).json({ success: false, message: "Event not found" });
    }

    const existingReview = await Review.findOne({ event, user: userId });
    if (existingReview) {
      return res.status(400).json({ success: false, message: "You have already reviewed this event" });
    }

    const review = await Review.create({
      user: userId,
      event,
      rating,
      comment
    });

    res.status(201).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getEventReviews = async (req, res) => {
  try {
    const { eventId } = req.params;
    const reviews = await Review.find({ event: eventId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reviews });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const user = req.user;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (user.role !== "admin" && review.user.toString() !== user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to update this review" });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;
    await review.save();

    res.status(200).json({ success: true, review });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    if (user.role !== "admin" && review.user.toString() !== user._id.toString()) {
      return res.status(403).json({ success: false, message: "Not authorized to delete this review" });
    }

    await review.deleteOne();
    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
