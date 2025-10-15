"use client";
import { CustomButton } from "@/components";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import toast from "react-hot-toast";
import { TbLoader3 } from "react-icons/tb";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import ErrorDisplay from "@/components/auth/ErrorDisplay";
import PasswordStrengthValidator from "@/components/auth/PasswordStrengthValidator";

const ResetPasswordContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [token, setToken] = useState("");

  // Beautiful marketplace/beauty images from Unsplash
  const marketplaceImages = [
    "https://images.unsplash.com/photo-1559181567-c3190ca9959b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Luxury spa
    "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Beauty wellness
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Premium cosmetics
    "https://images.unsplash.com/photo-1564465804875-298ef48520ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Jewelry elegance
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Gold jewelry
    "https://images.unsplash.com/photo-1595475038665-8d69a34838e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Beauty products
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Salon luxury
    "https://images.unsplash.com/photo-1600334129128-685c5582fd35?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Hair care products
  ];

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (tokenParam) {
      setToken(tokenParam);
    } else {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [searchParams]);

  // Image rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % marketplaceImages.length
      );
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [marketplaceImages.length]);

  const isPasswordStrong = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasLowercase = /[a-z]/.test(password);
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[@$!%*?&]/.test(password);
    const commonPasswords = [
      'password', '123456', 'qwerty', 'abc123', 'password123',
      'admin', 'letmein', 'welcome', 'monkey', 'dragon'
    ];
    const isNotCommon = !commonPasswords.includes(password.toLowerCase());

    return hasMinLength && hasLowercase && hasUppercase && hasNumber && hasSpecialChar && isNotCommon;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const password = e.target[0].value;
    const confirmPassword = e.target[1].value;

    // Enhanced validation with strong password requirements
    if (!isPasswordStrong(password)) {
      setError("Password does not meet security requirements. Please check the requirements below.");
      toast.error("Password is not strong enough");
      setIsLoading(false);
      return;
    }

    if (confirmPassword !== password) {
      setError("Passwords do not match");
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Password reset successful! You can now sign in with your new password.");
        toast.success("Password reset successful!");
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        if (data.error) {
          setError(data.error);
          toast.error(data.error);
        } else {
          setError("Failed to reset password. Please try again.");
          toast.error("Failed to reset password. Please try again.");
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || "Network error. Please check your connection and try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Reset password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!token && !error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <TbLoader3 className="animate-spin text-purple-600 dark:text-purple-400" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] flex">
      {/* Left side - Image Gallery */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src={marketplaceImages[currentImageIndex]}
          alt="Beautiful marketplace showcase"
          className="object-cover w-full h-full transition-all duration-1000 ease-in-out hover:scale-105"
          style={{
            animation: 'fadeIn 1s ease-in-out'
          }}
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute bottom-8 left-8 text-white">
          <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text">
            Rebbie Vault
          </h1>
          <p className="text-white/80 mt-2">Create a secure new password for your account.</p>
        </div>
        {/* Image indicators */}
        <div className="absolute bottom-8 right-8 flex space-x-2">
          {marketplaceImages.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentImageIndex ? 'bg-white' : 'bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Reset Password</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Enter your new password below
            </p>
          </div>

          {success ? (
            <div className="text-center space-y-4">
              <ErrorDisplay
                error={success}
                type="info"
                className="mt-4"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Redirecting to login page...
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible className="w-5 h-5" />
                    ) : (
                      <AiOutlineEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                <PasswordStrengthValidator
                  password={password}
                  showValidation={password.length > 0}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    autoComplete="new-password"
                    required
                    className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                  >
                    {showConfirmPassword ? (
                      <AiOutlineEyeInvisible className="w-5 h-5" />
                    ) : (
                      <AiOutlineEye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <CustomButton
                buttonType="submit"
                text={isLoading ? "Resetting password..." : "Reset Password"}
                customWidth="full"
                paddingX={4}
                paddingY={3}
                textSize="base"
                className={`w-full ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              />

              <ErrorDisplay
                error={error}
                onClose={() => setError("")}
                className="mt-4"
              />
            </form>
          )}

          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Remember your password?{" "}
              <a
                href="/login"
                className="text-purple-600 dark:text-purple-400 hover:text-purple-500 font-medium transition-colors duration-200"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ResetPasswordPage = () => {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen">
        <TbLoader3 className="animate-spin text-purple-600 dark:text-purple-400" size={40} />
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;