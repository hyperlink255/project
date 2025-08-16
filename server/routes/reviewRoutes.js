import express from  'express'
import { authorizeRoles, protect } from '../middleware/verifyToken.js';
import { createReview, deleteReview, getEventReviews, updateReview } from '../controllers/reviewController.js';

const router = express.Router()

router.post("/review", protect, authorizeRoles("user"), createReview);
router.put('/review/:id', protect, authorizeRoles("user", "admin"), updateReview);
router.get("/reviews/:eventId", protect, authorizeRoles("user"), getEventReviews);
router.delete('/review/:id', protect, authorizeRoles("user", "admin"), deleteReview);

export default router