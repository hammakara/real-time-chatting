import { useEffect, useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useChatStore } from "../stores/useChatStore";
import { socket } from "../libs/socket";
import Sidebar from "../components/Sidebar";
import Conversation from "../components/Conversation";
import ChatContainer from "../components/ChatContainer";
import MessageInput from "../components/MessageInput";

export default function HomePage() {
    const authUser = useAuthStore((state) => state.authUser);
    const selectedUser = useChatStore((state) => state.selectedUser);
    const { newMessage, setSelectedUser } = useChatStore();

    const [onlineUserIds, setOnlineUserIds] = useState([]);
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        if (!authUser?._id) return;

        const onNewMessage = (message) => newMessage(message);
        const onOnlineUsers = (userIds) => setOnlineUserIds(userIds);
        const onConnect = () => {
            setIsConnected(true);
            // Catch up on anything missed while the socket was down.
            const { selectedUser, getMessages } = useChatStore.getState();
            if (selectedUser?._id) getMessages(selectedUser._id);
        };
        const onDisconnect = () => setIsConnected(false);
        const onConnectError = () => setIsConnected(false);

        socket.on("newMessage", onNewMessage);
        socket.on("online-users", onOnlineUsers);
        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("connect_error", onConnectError);
        socket.connect();

        return () => {
            socket.off("newMessage", onNewMessage);
            socket.off("online-users", onOnlineUsers);
            socket.off("connect", onConnect);
            socket.off("disconnect", onDisconnect);
            socket.off("connect_error", onConnectError);
            socket.disconnect();
        };
    }, [authUser?._id, newMessage]);

    return (
        <div className="pt-16 h-screen">
            {!isConnected && (
                <div className="flex items-center justify-center gap-2 bg-warning/20 text-warning-content text-sm py-1.5">
                    <span className="loading loading-spinner loading-xs" />
                    Reconnecting to chat server...
                </div>
            )}

            <div className={`flex ${isConnected ? "h-[calc(100vh-4rem)]" : "h-[calc(100vh-6rem)]"} overflow-hidden`}>
                <div
                    className={`w-full md:w-auto shrink-0 ${
                        selectedUser ? "hidden md:block" : "block"
                    }`}
                >
                    <Sidebar onlineUserIds={onlineUserIds} />
                </div>

                <div className="flex-1 min-w-0 flex flex-col">
                    {selectedUser ? (
                        <>
                            <Conversation
                                onlineUserIds={onlineUserIds}
                                onBack={() => setSelectedUser(null)}
                            />
                            <MessageInput />
                        </>
                    ) : (
                        <ChatContainer />
                    )}
                </div>
            </div>
        </div>
    );
}
