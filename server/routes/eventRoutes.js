import express from 'express'
import { adminOnly, protect } from '../middleware/verifyToken.js'
import upload from '../middleware/upload.js'
import { approveEvent, createEvent, getDashboardData, getEvents, rejectEvent } from '../controllers/eventController.js'
const router = express.Router()

router.post("/event", protect, adminOnly, upload.single("image"), createEvent)
router.get("/event", protect, getEvents)
router.post("/event/approve/:id", protect, approveEvent)
router.post("/event/reject/:id", protect, rejectEvent)
router.get('/dashboard', protect, adminOnly, getDashboardData)

export default router