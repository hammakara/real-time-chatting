import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import { useAuthStore } from "./useAuthStore";
import toast from "react-hot-toast";

export const useChatStore = create((set, get) => ({
    users: [],
    selectedUser: null,
    messages: [],
    isUsersLoading: false,
    isMessagesLoading: false,
    isSendingMessage: false,

    setSelectedUser: (selectedUser) => set({ selectedUser }),

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/messages/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to load users.");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getMessages: async (userId) => {
        set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to load messages.");
        } finally {
            set({ isMessagesLoading: false });
        }
    },

    sendMessage: async (payload, onDone) => {
        set({ isSendingMessage: true });
        const { selectedUser, messages } = get();

        if (!selectedUser) return;

        const optimisticMessage = {
            _id: `temp-${Date.now()}`,
            senderId: useAuthStore.getState().authUser?._id,
            receiverId: selectedUser._id,
            text: payload.text,
            image: payload.image ?? null,
            createdAt: new Date().toISOString(),
            isOptimistic: true,
        };

        set({ messages: [...messages, optimisticMessage] });

        try {
            const res = await axiosInstance.post(
                `/messages/send/${selectedUser._id}`,
                payload
            );
            const savedMessage = res.data;

            set({
                messages: get()
                    .messages.filter((m) => m._id !== optimisticMessage._id)
                    .filter((m) => m._id !== savedMessage._id)
                    .concat(savedMessage),
            });
        } catch (error) {
            set({
                messages: get().messages.filter(
                    (m) => m._id !== optimisticMessage._id
                ),
            });
            toast.error(error.response?.data?.error || "Failed to send message.");
        } finally {
            set({ isSendingMessage: false });
            onDone?.();
        }
    },

    newMessage: (message) => {
        const { selectedUser, messages } = get();
        const authUser = useAuthStore.getState().authUser;

        const senderId =
            typeof message.senderId === "object" && message.senderId !== null
                ? message.senderId._id
                : message.senderId;

        const isMyMessage = senderId === authUser?._id;

        const belongsToActiveChat =
            senderId === selectedUser?._id || isMyMessage;

        const isDuplicate = messages.some((m) => m._id === message._id);

        if (!belongsToActiveChat) return;
        if (isDuplicate) return;

        set({ messages: [...messages, message] });
    },
}));
