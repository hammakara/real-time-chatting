import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "./cloudinary.js";

const userSocketMap = new Map();

let io;

export const getIO = () => io;

export const getUserSocketMap = () => {
    return userSocketMap;
};

const parseCookies = (cookieHeader = "") => {
    return cookieHeader.split(";").reduce((cookies, part) => {
        const separatorIndex = part.indexOf("=");
        if (separatorIndex === -1) return cookies;
        const key = part.slice(0, separatorIndex).trim();
        const value = decodeURIComponent(part.slice(separatorIndex + 1).trim());
        cookies[key] = value;
        return cookies;
    }, {});
};

export const initSocket = (server) => {
    const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
        .split(",")
        .map((origin) => origin.trim());

    io = new Server(server, {
        cors: {
            origin: allowedOrigins,
            credentials: true
        }
    });

    io.use(async (socket, next) => {
        const token = parseCookies(socket.handshake.headers.cookie).token;

        if (!token) {
            return next(new Error("Not authorized"));
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select("-password");

            if (!user) {
                return next(new Error("Not authorized"));
            }

            socket.user = user;
            next();
        } catch (error) {
            next(new Error("Not authorized"));
        }
    });

    const broadcastOnlineUsers = () => {
        io.emit("online-users", Array.from(userSocketMap.keys()));
    };

    io.on("connection", (socket) => {
        const userId = String(socket.user._id);
        userSocketMap.set(userId, socket.id);

        broadcastOnlineUsers();

        socket.on("send-message", async ({ userToChatWith, text, image }, callback) => {
            try {
                if (!text?.trim() && !image) {
                    return callback?.({ success: false, error: "Message cannot be empty!" });
                }

                let imageUrl;
                if (image) {
                    const uploadResponse = await cloudinary.uploader.upload(image);
                    imageUrl = uploadResponse.secure_url;
                }

                const newMessage = new Message({
                    senderId: userId,
                    receiverId: userToChatWith,
                    text: text?.trim(),
                    image: imageUrl
                });

                await newMessage.save();

                const receiverSocketId = userSocketMap.get(
                    String(userToChatWith)
                );
                const selfSocketId = userSocketMap.get(String(userId));

                const populatedMessage = await newMessage.populate(
                    "senderId",
                    "fullName profilePicture"
                );

                if (receiverSocketId) {
                    io.to(receiverSocketId).emit("newMessage", populatedMessage);
                }
                if (selfSocketId) {
                    io.to(selfSocketId).emit("newMessage", populatedMessage);
                }

                callback?.({ success: true, data: populatedMessage });
            } catch (error) {
                console.log(error);
                callback?.({ success: false, error: "Server Error" });
            }
        });

        socket.on("disconnect", () => {
            if (userSocketMap.get(userId) === socket.id) {
                userSocketMap.delete(userId);
                broadcastOnlineUsers();
            }
        });
    });

    return io;
};
