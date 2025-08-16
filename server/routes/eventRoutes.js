import express from "express";
import {
    createEvent,
    getEvents,
    getSingleEvent,
    approveEvent,
    rejectEvent,
    updateEvent,
    cancelEvent
} from "../controllers/eventController.js";

import upload from "../middleware/upload.js"; 
import { authorizeRoles,protect} from "../middleware/verifyToken.js";

const router = express.Router();

// Public Routes
router.get("/", getEvents);
router.get("/:id", getSingleEvent);

// Organizer / Admin
router.post("/", protect, authorizeRoles("organizer", "admin"), upload.single("image"), createEvent);
router.put("/:id", protect, authorizeRoles("organizer", "admin"), upload.single("image"), updateEvent);
router.delete("/:id/cancel", protect, authorizeRoles("organizer", "admin"), cancelEvent);

// Admin Only
router.patch("/:id/approve", protect, authorizeRoles("admin"), approveEvent);
router.patch("/:id/reject", protect, authorizeRoles("admin"), rejectEvent);

export default router;
