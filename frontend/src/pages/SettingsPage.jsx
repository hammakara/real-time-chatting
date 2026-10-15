import { useEffect, useState } from "react";
import { Moon, Sun, Monitor } from "lucide-react";

const THEMES = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
];

const THEME_STORAGE_KEY = "chatty-theme";

export default function SettingsPage() {
    const [theme, setTheme] = useState(
        () => localStorage.getItem(THEME_STORAGE_KEY) || "system"
    );

    useEffect(() => {
        const root = document.documentElement;

        const apply = (value) => {
            if (value === "system") {
                const prefersDark = window.matchMedia(
                    "(prefers-color-scheme: dark)"
                ).matches;
                root.setAttribute(
                    "data-theme",
                    prefersDark ? "dark" : "light"
                );
            } else {
                root.setAttribute("data-theme", value);
            }
        };

        apply(theme);
        localStorage.setItem(THEME_STORAGE_KEY, theme);

        if (theme !== "system") return;

        const media = window.matchMedia("(prefers-color-scheme: dark)");
        media.addEventListener("change", apply);

        return () => media.removeEventListener("change", apply);
    }, [theme]);

    return (
        <div className="pt-16 min-h-screen bg-base-200/40">
            <div className="max-w-3xl mx-auto px-4 py-10">
                <div className="bg-base-100 rounded-2xl border border-base-300 p-8">
                    <h1 className="text-2xl font-bold mb-2">Settings</h1>
                    <p className="text-base-content/60 mb-8">
                        Manage your preferences.
                    </p>

                    <section>
                        <h2 className="font-semibold mb-4">Theme</h2>

                        <div className="join">
                            {THEMES.map(({ value, label, icon: Icon }) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setTheme(value)}
                                    className={`btn join-item ${
                                        theme === value
                                            ? "btn-primary"
                                            : "btn-outline"
                                    }`}
                                >
                                    <Icon className="size-4" />
                                    {label}
                                </button>
                            ))}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
