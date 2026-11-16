'use client';

import Link from "next/link";
import { useState } from "react";
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import brandLogo from '../../../public/herbalhub.png';
import Image from "next/image";
import { login } from "@/lib/auth-helpers";
import { FaSpinner } from "react-icons/fa";

const Login = () => {
    const router = useRouter();
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (data) => {
        setIsLoading(true);

        try {
            const result = await login(data.email, data.password);
            if (result.success) {
                toast.success('Login Successful!');
                router.push('/dashboard');
            }
        } catch (error) {
            let errorMessage = error.message || 'Login failed';

            if (errorMessage.includes('Invalid email or password')) {
                errorMessage = 'Invalid email or password';
            } else if (errorMessage.includes('Admin account not found')) {
                errorMessage = 'No admin account found with this email';
            }

            toast.error(errorMessage || 'Login Failed');
        } finally {
            setIsLoading(false);
        }
    };

    const inputClass = "w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-white text-sm md:text-base placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0c7c40]/30 focus:border-[#0c7c40] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-[#102D50]";
    const errorClass = "mt-1.5 text-xs text-red-500 font-medium";

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] p-4">
            <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(16,45,80,0.08)] border border-gray-100">
                <div className="flex flex-col items-center justify-center mb-8 space-y-4">
                    <div className="flex justify-center items-center w-full">
                        <Image
                            src={brandLogo}
                            alt="Herbalhub Logo"
                            width={220}
                            height={80}
                            className="mx-auto object-contain"
                            priority
                        />
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-[#102D50] mb-1">
                            Admin Portal
                        </h2>
                        <p className="text-gray-500 text-sm">
                            Sign in to manage your Herbalhub platform
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#102D50] mb-1.5">
                            Email Address
                        </label>
                        <input
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                            type="email"
                            placeholder="admin@herbalhub.com"
                            className={inputClass}
                            disabled={isLoading}
                        />
                        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-[#102D50] mb-1.5">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                {...register("password", {
                                    required: "Password is required"
                                })}
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                className={inputClass + " pr-12"}
                                disabled={isLoading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#102D50]"
                                disabled={isLoading}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        {errors.password && <p className={errorClass}>{errors.password.message}</p>}
                    </div>

                    <div className="flex items-center justify-end">
                        <Link
                            href="/forgot-password"
                            className="text-xs font-medium text-[#0c7c40] hover:text-[#096333] hover:underline transition-colors"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-[#0c7c40] hover:bg-[#096333] text-white w-full cursor-pointer font-semibold py-3 px-4 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md shadow-[#0c7c40]/20 hover:shadow-lg hover:shadow-[#0c7c40]/30"
                    >
                        {isLoading ? (
                            <>
                                <FaSpinner className="animate-spin text-white" />
                                <span>Signing in...</span>
                            </>
                        ) : 'Sign In to Dashboard'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;