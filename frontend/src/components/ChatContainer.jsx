import { useChatStore } from "../stores/useChatStore";
import { MessageCircle } from "lucide-react";

export default function ChatContainer() {
    const { selectedUser } = useChatStore();

    if (!selectedUser) {
        return (
            <div className="flex-1 hidden md:flex flex-col items-center justify-center bg-base-200/40 text-center px-6">
                <MessageCircle className="size-16 text-base-content/20 mb-4" />
                <p className="text-lg font-medium">
                    Select a conversation to start messaging
                </p>
                <p className="text-sm text-base-content/60 mt-1">
                    Your messages are delivered in real time.
                </p>
            </div>
        );
    }

    return (
        <div className="flex-1 md:flex hidden min-w-0">
            <p className="m-auto text-base-content/60">
                Select a conversation to start messaging
            </p>
        </div>
    );
}
