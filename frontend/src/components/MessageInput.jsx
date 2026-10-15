import { useRef, useState } from "react";
import { useChatStore } from "../stores/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

export default function MessageInput() {
    const [text, setText] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const fileInputRef = useRef(null);
    const textareaRef = useRef(null);

    const { sendMessage, isSendingMessage } = useChatStore();

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Only image files are allowed.");
            return;
        }

        if (file.size > MAX_IMAGE_SIZE) {
            toast.error("Image must be smaller than 5MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
        setImage(file);
        e.target.value = "";
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isSendingMessage) return;
        if (!text.trim() && !image) return;

        sendMessage({ text: text.trim(), image }, () => {
            setText("");
            handleRemoveImage();
            textareaRef.current?.focus();
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-base-300 bg-base-100"
        >
            {imagePreview && (
                <div className="relative mb-3 w-fit">
                    <img
                        src={imagePreview}
                        alt="preview"
                        className="max-h-28 rounded-lg"
                    />
                    <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="btn btn-circle btn-xs btn-error absolute -top-2 -right-2"
                        aria-label="Remove image"
                    >
                        <X className="size-3" />
                    </button>
                </div>
            )}

            <div className="flex items-end gap-2">
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />

                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="btn btn-ghost btn-circle"
                    aria-label="Attach image"
                >
                    <Image className="size-5" />
                </button>

                <textarea
                    ref={textareaRef}
                    rows={1}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a message..."
                    className="textarea textarea-bordered flex-1 resize-none"
                />

                <button
                    type="submit"
                    disabled={isSendingMessage || (!text.trim() && !image)}
                    className="btn btn-primary btn-circle"
                    aria-label="Send message"
                >
                    {isSendingMessage ? (
                        <span className="loading loading-spinner loading-sm" />
                    ) : (
                        <Send className="size-5" />
                    )}
                </button>
            </div>
        </form>
    );
}
