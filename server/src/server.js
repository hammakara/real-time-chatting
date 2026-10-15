import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import cookieParser from 'cookie-parser';
import http from 'http';
import connectDB from "./libs/db.js";
import authRoutes from './routes/auth.route.js';
import messageRoutes from './routes/message.route.js';
import { initSocket } from './libs/socket.js';
dotenv.config();
const app = express();
const server = http.createServer(app);
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
connectDB()

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

app.use(cors({
    origin: CLIENT_URL.split(",").map((origin) => origin.trim()),
    credentials: true
}))

const port = process.env.PORT
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);

app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

initSocket(server)

server.listen(port, () => {
    console.log(`Listening on port ${port}`);
})
