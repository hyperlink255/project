import Event from "../models/eventModel.js";
import Booking from "../models/bookingModel.js";
import {v2 as Cloudinary} from "cloudinary";

export const createEvent = async (req, res) => {

    try {
        const { title, description, date, price, location } = req.body;
        const image = req.file;
        if (!title || !price || !location || !description ) {
            return res.status(400).json({ success: false, message: "All required fields must be provided" });
        }

        if (!image) {
            return res.status(400).json({ success: false, message: "Thumbnail not attached" });
        }

        const imageUpload = await Cloudinary.uploader.upload(image.path)

        const event = await Event.create({
            ...req.body,
            image: imageUpload.secure_url,
            organizer: req.user._id,
            date: Date.now(date),
            status: "pending"
        });

        res.status(201).json({ success: true, event,message: "Event created successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getEvents = async (req, res) => {
    try {
        const { title, page = 1, limit = 5, upcoming, category } = req.query;
        const skip = (page - 1) * limit;

        let filter = { status: "approved" };

        if (title) {
            filter.title = { $regex: title, $options: "i" };
        }
        if (category) {
            filter.category = category;
        }

        if (upcoming === "true") {
            filter.date = { $gte: new Date() };
        }

        const total = await Event.countDocuments(filter);

        const events = await Event.find(filter)
            .populate("organizer", "name email _id")
            .sort({ date: 1 })
            .skip(skip)
            .limit(parseInt(limit))
             const totalPage = Math.ceil(total / limit)
             res.status(200).json({ success: true,
             totalPage, page, events });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const getSingleEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id)
            .populate("organizer", "name email")
            .populate({
                path: "reviews",
                populate: { path: "user", select: "name" }
            });

        if (!event) return res.status(404).json({ success: false, message: "Event not found" });

        res.status(200).json({ success: true, event });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const approveEvent = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });

        event.status = "approved";
        event.approvedBy = req.user._id;
        await event.save();

        res.status(200).json({ success: true, message: "Event approved" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const rejectEvent = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });

        event.status = "rejected";
        event.rejectedBy = req.user._id;
        await event.save();

        res.status(200).json({ success: true, message: "Event rejected" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const updateEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });

        if (req.user.role !== "admin" && event.organizer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }
        Object.assign(event, req.body);
        if (req.file) {
            const imageUpload = await Cloudinary.uploader.upload(req.file.path);
            event.image = imageUpload.secure_url;
        }
        await event.save();
        res.status(200).json({ success: true, event });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
export const cancelEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });

        if (req.user.role !== "admin" && event.organizer.toString() !== req.user._id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        event.status = "cancelled";
        await event.save();

        await Booking.updateMany({ event: event._id }, { status: "cancelled" });

        res.status(200).json({ success: true, message: "Event cancelled & all bookings updated" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
