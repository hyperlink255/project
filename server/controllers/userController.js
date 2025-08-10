import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

export const registerUser = async (req, res) => {
    try {
        const { name, email, password, adminOnly, organizerOnly} = req.body;
        const image = req.file;

        if (!name || !email || !password || !image) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        let role = "user";
        if (adminOnly && process.env.ADMIN_VERIFY === adminOnly) {
            role = "admin";
        } else if (organizerOnly && process.env.ORGANIZER_VERIFY === organizerOnly) {
            role = "organizer";
        }

        const newUser = new User({
            name,
            email,
            password,
            image: `/uploads/${req.file.filename}`,
            role,
        });

        await newUser.save();
        const token = generateToken(newUser);

        newUser.password = undefined;

        res.status(201).json({
            success: true,
            message: "Registered Successfully",
            user: newUser,
            token,
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// LOGIN
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }

        const user = await User.findOne({ email });
        if (!user || !(await user.isComparePassword(password))) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        const token = generateToken(user);
        user.password = undefined;

        res.status(200).json({ success: true, user, token });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// FORGOT PASSWORD
export const forgetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ success: false, message: "Please fill all fields" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.password = newPassword; // Will be hashed in model
        await user.save();

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
