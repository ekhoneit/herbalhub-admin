'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { verifyOtp } from '@/lib/auth-helpers';
import Swal from 'sweetalert2';

const VerifyOtp = () => {
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [email, setEmail] = useState('');
    const [isPasswordReset, setIsPasswordReset] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        // Get email from session storage
        const storedEmail = sessionStorage.getItem('verificationEmail');
        const resetFlag = sessionStorage.getItem('isPasswordReset') === 'true';

        if (!storedEmail) {
            router.push('/sign-up');
            return;
        }

        setEmail(storedEmail);
        setIsPasswordReset(resetFlag);
    }, [router]);

    useEffect(() => {
        // Countdown timer
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    const handleOtpChange = (index, value) => {
        const cleaned = value.replace(/\D/g, "");
        if (!cleaned) {
            const newOtp = [...otp];
            newOtp[index] = "";
            setOtp(newOtp);
            return;
        }

        if (cleaned.length > 1) {
            handlePasteDirect(cleaned, index);
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = cleaned;
        setOtp(newOtp);

        if (index < 5) {
            document.getElementById(`otp-${index + 1}`)?.focus();
        }
    };

    const handlePasteDirect = (pastedText, startIndex = 0) => {
        const digits = pastedText.replace(/\D/g, "").slice(0, 6).split("");
        if (digits.length === 0) return;

        const newOtp = [...otp];
        for (let i = 0; i < 6; i++) {
            if (i >= startIndex && digits[i - startIndex] !== undefined) {
                newOtp[i] = digits[i - startIndex];
            } else if (startIndex === 0 && digits[i] !== undefined) {
                newOtp[i] = digits[i];
            }
        }
        setOtp(newOtp);

        const nextFocusIndex = Math.min(startIndex + digits.length, 5);
        document.getElementById(`otp-${nextFocusIndex}`)?.focus();
    };

    const handlePaste = (e, index) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text");
        handlePasteDirect(pastedData, index);
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`)?.focus();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const otpCode = otp.join('');

        // Changed from 8 to 6
        if (otpCode.length !== 6) {
            await Swal.fire({
                icon: 'error',
                title: 'Invalid OTP',
                text: 'Please enter all 6 digits',
                confirmButtonColor: '#14b8a6'
            });
            return;
        }

        setIsLoading(true);
        try {
            const result = await verifyOtp(email, otpCode, isPasswordReset);

            if (result.success) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Verified!',
                    text: isPasswordReset
                        ? 'Email verified! You can now reset your password.'
                        : 'Email verified successfully!',
                    timer: 1500,
                    showConfirmButton: false
                });

                // Clear session storage
                sessionStorage.removeItem('verificationEmail');
                sessionStorage.removeItem('isPasswordReset');

                // Redirect
                if (isPasswordReset) {
                    router.push('/reset-password');
                } else {
                    router.push('/');
                }
            }
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Verification Failed',
                text: error.message || 'Invalid OTP. Please try again.',
                confirmButtonColor: '#14b8a6'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsLoading(true);
        try {
            // Call your resend OTP API here
            await Swal.fire({
                icon: 'success',
                title: 'Code Resent!',
                text: 'A new verification code has been sent to your email.',
                timer: 1500,
                showConfirmButton: false
            });

            setTimer(60);
            setCanResend(false);
            setOtp(['', '', '', '', '', '']); 
        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Failed',
                text: 'Failed to resend code. Please try again.',
                confirmButtonColor: '#14b8a6'
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA] p-4">
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(16,45,80,0.08)] border border-gray-100 p-8 md:p-12 max-w-xl w-full">
                <div className="text-center mb-8">
                    <h1 className="text-2xl md:text-3xl font-bold text-[#102D50] mb-2 font-inter">
                        Verify Your Email
                    </h1>
                    <p className="text-gray-500 text-sm">
                        We've sent a 6-digit verification code to
                    </p>
                    <p className="text-[#0c7c40] font-semibold mt-1">{email}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* OTP Input Fields - 6 digits */}
                    <div className="flex justify-center space-x-2 md:space-x-3">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                inputMode="numeric"
                                maxLength={6}
                                value={digit}
                                onChange={(e) => handleOtpChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                onPaste={(e) => handlePaste(e, index)}
                                disabled={isLoading}
                                className="w-12 h-12 md:w-14 md:h-14 text-center text-xl font-bold border border-gray-200 rounded-xl focus:border-[#0c7c40] focus:ring-2 focus:ring-[#0c7c40]/30 focus:outline-none transition disabled:bg-gray-100 text-[#102D50]"
                            />
                        ))}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-3 px-4 bg-[#0c7c40] hover:bg-[#096333] text-white font-semibold rounded-xl transition duration-200 shadow-md shadow-[#0c7c40]/20 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isLoading ? 'Verifying...' : 'Verify Email'}
                    </button>

                    {/* Resend Code */}
                    <div className="text-center">
                        {canResend ? (
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={isLoading}
                                className="text-[#0c7c40] hover:text-[#096333] font-semibold text-sm disabled:text-gray-400 cursor-pointer"
                            >
                                Resend Code
                            </button>
                        ) : (
                            <p className="text-gray-500 text-sm">
                                Resend code in {timer}s
                            </p>
                        )}
                    </div>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-500 text-sm">
                        Wrong email?{' '}
                        <button
                            onClick={() => router.push('/sign-up')}
                            className="text-[#0c7c40] hover:text-[#096333] hover:underline font-semibold cursor-pointer"
                        >
                            Go back
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default VerifyOtp;