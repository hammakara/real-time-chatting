export default function Avatar({ user, size = "md", isOnline = false, className = "" }) {
    const sizes = {
        sm: "size-10",
        md: "size-12",
        lg: "size-20",
    };

    const initials = (user?.fullName || "U")
        .trim()
        .split(" ")
        .map((part) => part[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div className={`avatar ${isOnline ? "avatar-online" : ""}`}>
            <div
                className={`avatar-placeholder ${sizes[size]} rounded-full overflow-hidden bg-base-300 ring-1 ring-base-content/10 ${className}`}
            >
                {user?.profilePicture ? (
                    <img
                        src={user.profilePicture}
                        alt={user.fullName || "avatar"}
                        loading="lazy"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/20 text-primary font-semibold">
                        <span>{initials}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
