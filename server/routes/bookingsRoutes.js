import express from 'express'
import { protect } from '../middleware/verifyToken.js'
import { cancelBooking, cancelBookingsByEvent,
     createBooking, generateAndUploadQRCode, getAllBooking,
       getOrganizerDashboard,
        getSingleBooking, getUserDashboard, 
        updateBooking } from '../controllers/bookingController.js'
const router = express.Router()

router.post("/booking", protect, createBooking)
router.get("/booking/", protect, getAllBooking)
router.get("/booking/:id", protect, getSingleBooking)
router.put("/booking/:id", protect, updateBooking)
router.patch("/booking/:id/cancel", protect, cancelBooking)

router.patch("/events/:eventId/cancel-bookings", protect, cancelBookingsByEvent)
router.get("/dashboard/user",protect,getUserDashboard)
router.get("/dashboard/organizerr",protect,getOrganizerDashboard)
router.post("/utils/generate-qr",protect, generateAndUploadQRCode)


export default router