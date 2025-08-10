import express from 'express';
import { forgetPassword, loginUser, registerUser } from '../controllers/userController.js';
import upload from '../middleware/upload.js';
const router = express.Router()

router.post("/register",upload.single('image'),registerUser)
router.post("/login",loginUser)
router.post("/forget",forgetPassword)

export default router
