import { useRef } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import Avatar from "../components/Avatar";
import { Loader, Upload } from "lucide-react";
import toast from "react-hot-toast";

export default function ProfilePage() {
    const { authUser, updateProfile, isUpdatingProfile } = useAuthStore();
    const fileInputRef = useRef(null);

    if (!authUser) {
        return (
            <div className="flex justify-center items-center h-screen pt-16">
                <span className="loading loading-spinner text-primary" />
            </div>
        );
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            toast.error("Only image files are allowed.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must be smaller than 5MB.");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            await updateProfile({ profilePicture: reader.result });
        };
        reader.readAsDataURL(file);
        e.target.value = "";
    };

    return (
        <div className="pt-16 min-h-screen bg-base-200/40">
            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="bg-base-100 rounded-2xl border border-base-300 p-8">
                    <h1 className="text-2xl font-bold mb-8">My Profile</h1>

                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        <div className="relative">
                            <Avatar user={authUser} size="lg" />

                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUpdatingProfile}
                                className="btn btn-circle btn-sm btn-primary absolute -bottom-1 -right-1"
                                aria-label="Change profile picture"
                            >
                                {isUpdatingProfile ? (
                                    <Loader className="size-3 animate-spin" />
                                ) : (
                                    <Upload className="size-3" />
                                )}
                            </button>

                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                        </div>

                        <div className="flex-1 w-full space-y-4">
                            <div>
                                <label className="label-text text-sm text-base-content/60">
                                    Full Name
                                </label>
                                <p className="font-medium">
                                    {authUser.fullName}
                                </p>
                            </div>

                            <div>
                                <label className="label-text text-sm text-base-content/60">
                                    Email
                                </label>
                                <p className="font-medium">{authUser.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
