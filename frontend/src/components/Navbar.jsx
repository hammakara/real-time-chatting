import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore.js";
import { Link } from "react-router-dom";
import { MessageSquare, Settings, LogOut, User as UserIcon } from "lucide-react";
import Avatar from "./Avatar";

export default function Navbar() {
    const { logout, authUser } = useAuthStore();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className={"bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg bg-base-100/80"}>
            <div className={'container mx-auto px-4 h-16'}>
                <div className={'flex items-center justify-between h-full'}>
                    <Link to={'/'} className={'flex items-center gap-2.5 hover:opacity-80 transition-all'}>
                        <div className='w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center'>
                            <MessageSquare className={'w-5 h-5 text-primary'} />
                        </div>
                        <h1 className={'text-lg font-bold'}>Chatty</h1>

                    </Link>

                    {authUser && (
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen((prev) => !prev)}
                                className="flex items-center gap-2 rounded-full p-1 pr-3 hover:bg-base-200 transition-colors"
                                aria-expanded={isMenuOpen}
                                aria-label="Open menu"
                            >
                                <Avatar user={authUser} size="sm" />
                                <span className="hidden sm:inline text-sm font-medium">
                                    {authUser.fullName}
                                </span>
                            </button>

                            {isMenuOpen && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setIsMenuOpen(false)}
                                    />

                                    <div className="absolute right-0 mt-2 w-52 rounded-box bg-base-100 border border-base-300 shadow-lg p-2 z-20">
                                        <div className="px-3 py-2 border-b border-base-300 mb-1">
                                            <p className="font-medium truncate">
                                                {authUser.fullName}
                                            </p>
                                            <p className="text-xs text-base-content/60 truncate">
                                                {authUser.email}
                                            </p>
                                        </div>

                                        <ul className="menu p-0">
                                            <li>
                                                <Link
                                                    to="/profile"
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                >
                                                    <UserIcon className="size-4" />
                                                    Profile
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to="/settings"
                                                    onClick={() =>
                                                        setIsMenuOpen(false)
                                                    }
                                                >
                                                    <Settings className="size-4" />
                                                    Settings
                                                </Link>
                                            </li>
                                            <li>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setIsMenuOpen(false);
                                                        logout();
                                                    }}
                                                    className="text-error"
                                                >
                                                    <LogOut className="size-4" />
                                                    Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>

        </header>
    )
}
