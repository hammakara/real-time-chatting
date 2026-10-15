import { create } from "zustand";
import { axiosInstance } from "../libs/axios";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isLoggingIn: false,
    isRegister: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check");

            set({
                authUser: res.data.user ?? res.data,
            });
        } catch (error) {
            set({ authUser: null });
            console.error("Check auth error:", error);
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    login: async (user) => {
        set({ isLoggingIn: true });

        try {
            const res = await axiosInstance.post("/auth/login", user);

            set({
                authUser: res.data.user ?? res.data,
            });

            toast.success(
                res.data.message || "Login successful."
            );

            return true;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Login failed. Please try again.";

            toast.error(message);

            return false;
        } finally {
            set({ isLoggingIn: false });
        }
    },

    register: async (user) => {
        set({ isRegister: true });

        try {
            const res = await axiosInstance.post("/auth/register", user);

            set({
                authUser: res.data.user ?? res.data,
            });

            toast.success(
                res.data.message || "User registered successfully."
            );

            return true;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Registration failed. Please try again.";

            toast.error(message);

            return false;
        } finally {
            set({ isRegister: false });
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout");
            set({ authUser: null });
            toast.success("User logged out successfully.");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Logout failed."
            );
        }

    },

    updateProfile: async (payload) => {
        set({ isUpdatingProfile: true });

        try {
            const res = await axiosInstance.put("/auth/update-profile", payload);

            set({ authUser: res.data.updatedUser ?? res.data });

            toast.success("Profile updated successfully.");

            return true;
        } catch (error) {
            const message =
                error.response?.data?.message ||
                error.response?.data?.error ||
                error.message ||
                "Profile update failed.";

            toast.error(message);

            return false;
        } finally {
            set({ isUpdatingProfile: false });
        }
    }
}));
