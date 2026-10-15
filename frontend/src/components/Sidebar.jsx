import { useEffect, useRef } from "react";
import { useChatStore } from "../stores/useChatStore";
import Avatar from "./Avatar";
import { Users } from "lucide-react";

export default function Sidebar({ onlineUserIds }) {
    const {
        users,
        selectedUser,
        setSelectedUser,
        getUsers,
        isUsersLoading,
    } = useChatStore();

    const usersRef = useRef(null);

    useEffect(() => {
        getUsers();
    }, [getUsers]);

    useEffect(() => {
        usersRef.current?.scrollTo({ top: usersRef.current.scrollHeight });
    }, [users]);

    const onlineSet = new Set((onlineUserIds || []).map(String));

    return (
        <aside className="h-full w-full md:w-72 shrink-0 border-r border-base-300 bg-base-100 flex flex-col">
            <header className="border-b border-base-300 px-4 py-3">
                <div className="flex items-center gap-2">
                    <Users className="size-5 text-primary" />
                    <h2 className="font-semibold">Conversations</h2>
                </div>
            </header>

            <div ref={usersRef} className="flex-1 overflow-y-auto">
                {isUsersLoading && users.length === 0 ? (
                    <div className="flex justify-center py-10">
                        <span className="loading loading-spinner text-primary" />
                    </div>
                ) : users.length === 0 ? (
                    <p className="text-sm text-base-content/60 text-center px-4 py-10">
                        No other users yet.
                    </p>
                ) : (
                    <ul>
                        {users.map((user) => {
                            const isSelected = selectedUser?._id === user._id;
                            const isOnline = onlineSet.has(String(user._id));

                            return (
                                <li key={user._id}>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedUser(user)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-base-200 ${
                                            isSelected
                                                ? "bg-base-300/70"
                                                : ""
                                        }`}
                                    >
                                        <Avatar
                                            user={user}
                                            isOnline={isOnline}
                                        />

                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">
                                                {user.fullName}
                                            </p>
                                            <p className="text-xs text-base-content/60 truncate">
                                                {isOnline ? "Online" : "Offline"}
                                            </p>
                                        </div>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </div>
        </aside>
    );
}
