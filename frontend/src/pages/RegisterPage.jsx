import { useState } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import {
    Loader,
    Lock,
    Mail,
    MessageSquare,
    User,
    Eye,
    EyeOff,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import AuthImagePattern from "../components/AuthImagePattern.jsx";
import toast from "react-hot-toast";

export default function RegisterPage() {
    const [showPassword, setShowPassword] = useState(false);

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });

    const { isRegister, register } = useAuthStore();
    const navigate = useNavigate();

    const onChangeInput = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        if (!formData.fullName.trim()) {
            toast.error("Please enter your full name.");
            return false;
        }

        if (!formData.email.trim()) {
            toast.error("Please enter your email.");
            return false;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            toast.error("Please enter a valid email address.");
            return false;
        }

        if (!formData.password.trim()) {
            toast.error("Please enter your password.");
            return false;
        }

        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const success = await register({
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            password: formData.password,
        });

        if (success) {
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Left side */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12">
                <div className="w-full max-w-md space-y-8">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="flex flex-col items-center gap-2 group">
                            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <MessageSquare className="size-6 text-primary" />
                            </div>

                            <h1 className="text-2xl font-bold mt-2">
                                Create Account
                            </h1>

                            <p className="text-base-content/60">
                                Get started with your free account!
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">
                                    Full Name
                                </span>
                            </label>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="size-5 text-base-content/40" />
                                </div>

                                <input
                                    type="text"
                                    name="fullName"
                                    className="input input-bordered w-full pl-10"
                                    placeholder="Full Name"
                                    value={formData.fullName}
                                    onChange={onChangeInput}
                                    autoComplete="name"
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">
                                    Email
                                </span>
                            </label>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="size-5 text-base-content/40" />
                                </div>

                                <input
                                    type="email"
                                    name="email"
                                    className="input input-bordered w-full pl-10"
                                    placeholder="example@gmail.com"
                                    value={formData.email}
                                    onChange={onChangeInput}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-medium">
                                    Password
                                </span>
                            </label>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="size-5 text-base-content/40" />
                                </div>

                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    className="input input-bordered w-full pl-10 pr-12"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={onChangeInput}
                                    autoComplete="new-password"
                                    minLength={6}
                                    required
                                />

                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 px-3 flex items-center text-base-content/50 hover:text-base-content"
                                    onClick={() =>
                                        setShowPassword((prev) => !prev)
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className="size-5" />
                                    ) : (
                                        <Eye className="size-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            className="btn btn-primary w-full"
                            disabled={isRegister}
                        >
                            {isRegister ? (
                                <>
                                    <Loader className="size-5 animate-spin" />
                                    Creating account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    <div className="text-center">
                        <p className="text-base-content/60">
                            Already have an account?{" "}
                            <Link to="/login" className="link link-primary">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side */}
            <AuthImagePattern
                title="Join our community"
                subtitle="Connect with friends, share moments, and stay in touch."
            />
        </div>
    );
}