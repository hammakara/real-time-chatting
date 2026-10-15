import { useEffect, useRef } from "react";
import { useChatStore } from "../stores/useChatStore";
import { useAuthStore } from "../stores/useAuthStore";
import Avatar from "./Avatar";
import { ArrowLeft } from "lucide-react";

export default function Conversation({ onlineUserIds, onBack }) {
    const {
        selectedUser,
        getMessages,
        isMessagesLoading,
        setSelectedUser,
        messages,
    } = useChatStore();
    const authUser = useAuthStore((state) => state.authUser);

    const messagesEndRef = useRef(null);

    const onlineSet = new Set((onlineUserIds || []).map(String));
    const isOnline = onlineSet.has(String(selectedUser?._id));

    useEffect(() => {
        if (!selectedUser?._id) return;

        getMessages(selectedUser._id);
    }, [selectedUser?._id, getMessages]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <section className="flex h-full min-w-0 flex-1 flex-col">
            <header className="flex items-center gap-3 border-b border-base-300 bg-base-100 px-4 py-3">
                <button
                    type="button"
                    className="btn btn-ghost btn-sm btn-circle md:hidden"
                    onClick={() =>
                        onBack ? onBack() : setSelectedUser(null)
                    }
                    aria-label="Back to conversations"
                >
                    <ArrowLeft className="size-5" />
                </button>

                <Avatar
                    user={selectedUser}
                    size="sm"
                    isOnline={isOnline}
                />

                <div className="min-w-0">
                    <p className="font-semibold truncate">
                        {selectedUser?.fullName}
                    </p>
                    <p className="text-xs text-base-content/60">
                        {isOnline ? "Online" : "Offline"}
                    </p>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-base-200/40">
                {isMessagesLoading ? (
                    <div className="flex justify-center py-10">
                        <span className="loading loading-spinner text-primary" />
                    </div>
                ) : (
                    <MessagesList
                        messages={messages}
                        authUserId={authUser?._id}
                    />
                )}

                <div ref={messagesEndRef} />
            </div>
        </section>
    );
}

function MessagesList({ messages, authUserId }) {
    if (messages.length === 0) {
        return (
            <p className="text-sm text-base-content/60 text-center py-10">
                No messages yet. Say hi!
            </p>
        );
    }

    return messages.map((message) => {
        const isMine =
            (typeof message.senderId === "object"
                ? message.senderId?._id
                : message.senderId) === authUserId;

        return (
            <div
                key={message._id}
                className={`chat ${isMine ? "chat-end" : "chat-start"} ${
                    message.isOptimistic ? "opacity-60" : ""
                }`}
            >
                <div className="chat-image avatar">
                    {!isMine && (
                        <div className="w-8 rounded-full">
                            <Avatar user={message.senderId} size="sm" />
                        </div>
                    )}
                </div>

                <div className="chat-header text-xs opacity-60 mb-1">
                    {!isMine && message.senderId?.fullName
                        ? message.senderId.fullName
                        : ""}
                </div>

                <div
                    className={`chat-bubble ${
                        isMine
                            ? "chat-bubble-primary"
                            : "bg-base-100 text-base-content"
                    }`}
                >
                    {message.image && (
                        <img
                            src={message.image}
                            alt="attachment"
                            className="max-w-[240px] rounded-lg mb-1"
                            loading="lazy"
                        />
                    )}
                    {message.text && <p>{message.text}</p>}
                </div>

                <div className="chat-footer opacity-60 text-xs mt-1">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </div>
            </div>
        );
    });
}
