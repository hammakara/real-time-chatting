import { io } from "socket.io-client";

// Set VITE_BACKEND_URL in the deployment environment. The localhost fallback
// keeps local dev working without extra setup.
export const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:5001";

export const socket = io(BACKEND_URL, {
    withCredentials: true,
    autoConnect: false,
    // Vercel/Render can drop idle connections; back off and retry.
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
});
