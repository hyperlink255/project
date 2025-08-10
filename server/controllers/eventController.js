import Booking from '../models/bookingModel.js';
import Event from '../models/eventModel.js'
import { v2 as cloudinary } from 'cloudinary'

export const createEvent = async (req, res) => {
    try {

        const imageFile = req.file
        if (!imageFile) {
            return res.status(400).json({ success: false, message: 'Thumbnail Not Attached' });
        }
        const imageUpload = await cloudinary.uploader.upload(imageFile.path);
        const event = await Event.create({
            ...req.body,
            date: Date.now(),
            image: imageUpload.secure_url,
            organizer: req.user._id
        });
        res.status(200).json({ success: true, event })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}
export const getEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: "approved" }).populate("organizer", "name")
        res.status(200).json({ success: true, events })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })

    }
}
export const approveEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id)
        if (!event) return res.status(404).json({ message: "Event not found" });
        event.status = "approved"
        await event.save()
        res.status(200).json({ success: true, message: "Event approved" })
    } catch (error) {
        res.status(500).json({ success: true, message: error.message })
    }

}
export const rejectEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const event = await Event.findById(id)
        if (!event) return res.status(404).json({ message: "Event not found" });
        event.status = "rejected"
        await event.save()
        res.status(200).json({ success: true, message: "Event rejected" })
    } catch (error) {
        res.status(500).json({ success: true, message: error.message })
    }
}
export const getDashboardData = async (req, res) => {
    try {
        let matchCondition = {}
        let role = req.user.role;
        if (role === "admin") {
            matchCondition.organizer = req.user._id;
        } else if (role === "user") {
            matchCondition.user = req.user._id
        }
        const totalEvents = await Event.countDocuments(matchCondition)
        const approveEvent = await Event.countDocuments({ ...matchCondition, status: "approved" })
        const rejectedEvents = await Event.countDocuments({ ...matchCondition, status: "rejected" })

        let totalTicketsSold = 0;
        let totalRevenue = 0;

            const ticketsData = await Booking.aggregate([
                { $match: matchCondition },
                {
                    $group: {
                        _id: null,
                        ticketsSold: { $sum: "$tickets" },
                        revenue: { $sum: "$totalAmount" }
                    }
                }
            ])

            if(ticketsData.length > 0){
                totalTicketsSold = ticketsData[0].ticketsSold;
                totalRevenue = ticketsData[0].revenue;
            }

            res.status(200).json({success:true,data:{
                totalEvents,
                approveEvent,
                rejectedEvents,
                totalTicketsSold,
                totalRevenue
            }})

    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
}