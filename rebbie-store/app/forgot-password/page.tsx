"use client";
import { CustomButton } from "@/components";
import { isValidEmailAddressFormat } from "@/lib/utils";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { TbLoader3 } from "react-icons/tb";
import ErrorDisplay from "@/components/auth/ErrorDisplay";
import Link from "next/link";

const ForgotPasswordPage = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Beautiful marketplace/beauty images from Unsplash
  const marketplaceImages = [
    "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Spa wellness
    "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Beauty products arrangement
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Jewelry collection
    "https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Elegant cosmetics
    "https://images.unsplash.com/photo-1567721913486-6585f069b332?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Luxurious beauty
    "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Premium skincare
    "https://images.unsplash.com/photo-1525904097878-94fb15835963?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Beauty salon interior
    "https://images.unsplash.com/photo-1490723286627-4b66e6b2882a?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Perfume bottles
  ];

  // Image rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % marketplaceImages.length
      );
    }, 10000); // 10 seconds

    return () => clearInterval(interval);
  }, [marketplaceImages.length]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    const email = e.target[0].value;

    // Enhanced client-side validation
    if (!isValidEmailAddressFormat(email)) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccess("Password reset instructions have been sent to your email address.");
        toast.success("Password reset instructions sent!");
        e.target.reset();
      } else {
        if (data.error) {
          setError(data.error);
          toast.error(data.error);
        } else {
          setError("Failed to send password reset email. Please try again.");
          toast.error("Failed to send password reset email. Please try again.");
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || "Network error. Please check your connection and try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Forgot password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex">
      {/* Left side - Image Gallery */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
        <img
          src={marketplaceImages[currentImageIndex]}
          alt="Beautiful marketplace showcase"
          className="object-cover w-full h-full transition-all duration-1000 ease-in-out hover:scale-105"
          style={{
            animation: 'fadeIn 1s ease-in-out'
          }}
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute text-white bottom-8 left-8">
          <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text">
            Rebbie Vault
          </h1>
          <p className="mt-2 text-white/80">Secure password recovery for your account.</p>
        </div>
        {/* Image indicators */}
        <div className="absolute flex space-x-2 bottom-8 right-8">
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
      <div className="flex items-center justify-center flex-1 px-4 bg-white sm:px-6 lg:px-8 dark:bg-gray-900">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Forgot Password</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Enter your email address and we&apos;ll send you instructions to reset your password
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="name@example.com"
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-300 bg-white border border-gray-300 rounded-xl dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>

            <CustomButton
              buttonType="submit"
              text={isLoading ? "Sending instructions..." : "Send Reset Instructions"}
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

            {success && (
              <ErrorDisplay
                error={success}
                type="info"
                onClose={() => setSuccess("")}
                className="mt-4"
              />
            )}
          </form>

          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Remember your password?{" "}
              <Link
                href="/login"
                className="font-medium text-purple-600 transition-colors duration-200 dark:text-purple-400 hover:text-purple-500"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;