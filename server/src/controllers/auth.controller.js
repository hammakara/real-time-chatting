import bcrypt from 'bcryptjs';
import User from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import { clearAuthToken, generateToken } from '../libs/utils.js';
import cloudinary from '../libs/cloudinary.js';

const sanitizeUser = (user) => {
    const { password, ...safeUser } = user.toObject ? user.toObject() : user;
    return safeUser;
};


export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                error: "Please provide all required fields!"
            })
        }
        const user = await User.findOne({ email })
        if (!user) return res.status(400).json({
            success: false,
            error: "User not found!"
        })
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({
            success: false,
            error: "Invalid credentials!"
        })
        generateToken(user._id, res);
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: sanitizeUser(user)
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
}
export const register = async (req, res) => {
    try {
        const { fullName, email, password } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({
                success: false,
                error: "Please provide all required fields!"
            })
        }
        const existUser = await User.findOne({ email })
        if (existUser) return res.status(400).json({
            success: false,
            error: "User is ready exist!"
        })
        const hashedPass = await bcrypt.hash(password, 10);
        const newUser = new User({
            fullName,
            email,
            password: hashedPass
        })
        await newUser.save();
        generateToken(newUser._id, res);
        res.status(201).json({
            success: true,
            message: "Register",
            user: sanitizeUser(newUser)
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
}

export const logout = async (req, res) => {
    try {
        clearAuthToken(res);
        res.status(200).json({
            success: true,
            message: "Logout",
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
}

export const updateProfile = async (req, res) => {
    try {
        const userId = req.user._id;

        const { profilePicture } = req.body;

        let updatedPicture;
        if (profilePicture) {
            const uploadReponse = await cloudinary.uploader.upload(profilePicture);
            updatedPicture = uploadReponse.secure_url;
        }

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePicture: updatedPicture },
            { new: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            updatedUser
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
}

export const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user)
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Server error"
        });
    }
}