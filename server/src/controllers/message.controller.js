import cloudinary from "../libs/cloudinary.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import { getIO, getUserSocketMap } from "../libs/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        
        const loginUserId = req.user._id;
        const filterUsers = await User.find({ _id: { $ne: loginUserId } }).select('-password');
        res.status(200).json(filterUsers);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Server Error"
        })
    }
}

export const getMessage = async (req, res) => {
    try {
        const { id: userToChatWith } = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatWith },
                { senderId: userToChatWith, receiverId: myId }
            ]
        }).sort({ createdAt: 1 });
        res.status(200).json(messages);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Server Error"
        })
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: userToChatWith } = req.params;
        const myId = req.user._id;

        if (!text?.trim() && !image) {
            return res.status(400).json({
                success: false,
                error: "Message cannot be empty!"
            })
        }

        let imageUrl;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }
        const newMessage = new Message({
            senderId: myId,
            receiverId: userToChatWith,
            text: text?.trim(),
            image: imageUrl
        })
        await newMessage.save();

        const receiverSocketMap = getUserSocketMap();
        const receiverSocketId = receiverSocketMap.get(String(userToChatWith));

        if (receiverSocketId) {
            getIO()?.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            error: "Server Error"
        })
    }
}