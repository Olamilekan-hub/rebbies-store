"use client";
import { CustomButton } from "@/components";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { TbLoader3 } from "react-icons/tb";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import ErrorDisplay from "@/components/auth/ErrorDisplay";
import PasswordStrengthValidator from "@/components/auth/PasswordStrengthValidator";

const RegisterPage = () => {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  // Beautiful marketplace/beauty images from Unsplash (different from login)
  const marketplaceImages = [
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Beauty salon elegance
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Professional salon
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Luxury cosmetics
    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Fine jewelry collection
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Premium hair care
    "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Modern beauty store
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Elegant accessories
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Boutique jewelry
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Natural beauty products
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"  // Designer jewelry display
  ];

  useEffect(() => {
    // chechking if user has already registered redirect to home page
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);

  // Image rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % marketplaceImages.length
      );
    }, 10000); // 30 seconds

    return () => clearInterval(interval);
  }, [marketplaceImages.length]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

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

    const name = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const confirmPassword = e.target[3].value;

    // Enhanced validation with better error messages
    if (!name || name.trim().length < 2) {
      setError("Name must be at least 2 characters long");
      toast.error("Name must be at least 2 characters long");
      setIsLoading(false);
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

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
      // sending API request for registering user
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email,
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setError("");
        toast.success("Registration successful! Please sign in.");
        router.push("/login");
      } else {
        // Enhanced error handling
        if (data.details && Array.isArray(data.details)) {
          // Validation errors from server
          const errorMessage = data.details.map((err: any) => err.message).join(", ");
          setError(errorMessage);
          toast.error(errorMessage);
        } else if (data.error) {
          // General server errors
          setError(data.error);
          toast.error(data.error);
        } else if (data.message) {
          // Custom server messages
          setError(data.message);
          toast.error(data.message);
        } else {
          setError("Registration failed. Please try again.");
          toast.error("Registration failed. Please try again.");
        }
      }
    } catch (error: any) {
      const errorMessage = error.message || "Network error. Please check your connection and try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Registration error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (sessionStatus === "loading") {
    return <div className="flex items-center justify-center h-[100px] w-full flex-1 min-h-screen bg-white/90 dark:bg-gray-800/80 text-black dark:text-white">
      <TbLoader3 className="text-purple-600 animate-spin dark:text-purple-400" size={40} />
      <h1 className="">Loading...</h1>;
    </div>;
  }
  return (
    <div className="min-h-[90vh] flex">
      {/* Left side - Image Gallery */}
      <div className="relative hidden overflow-hidden lg:flex lg:w-1/2">
        <img
          src={marketplaceImages[currentImageIndex]}
          alt="Beautiful marketplace showcase"
          className="object-cover w-full h-[90vh] transition-all duration-1000 ease-in-out hover:scale-105"
          style={{
            animation: 'fadeIn 1s ease-in-out'
          }}
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="absolute text-white bottom-8 left-8">
          <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text">
            Rebbie Vault
          </h1>
          <p className="mt-2 text-white/80">Join our community of beauty enthusiasts.</p>
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Account</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Enter your details to create your account</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="John Doe"
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-300 bg-white border border-gray-300 rounded-xl dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="name@example.com"
                className="w-full px-4 py-3 text-gray-900 placeholder-gray-500 transition-all duration-300 bg-white border border-gray-300 rounded-xl dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
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
                  className="w-full px-4 py-3 pr-12 text-gray-900 placeholder-gray-500 transition-all duration-300 bg-white border border-gray-300 rounded-xl dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 transition-colors duration-200 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
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
              <label htmlFor="confirmpassword" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmpassword"
                  name="confirmpassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  className="w-full px-4 py-3 pr-12 text-gray-900 placeholder-gray-500 transition-all duration-300 bg-white border border-gray-300 rounded-xl dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 transition-colors duration-200 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
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
              text={isLoading ? "Creating account..." : "Create account"}
              customWidth="full"
              paddingX={4}
              paddingY={3}
              textSize="base"
              className={`w-full mt-6 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
              disabled={isLoading}
            />

            <ErrorDisplay
              error={error}
              onClose={() => setError("")}
              className="mt-4"
            />
          </form>

          <div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 bg-white dark:bg-gray-900 dark:text-gray-400">OR CONTINUE WITH</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {/* Add Google signup logic */}}
              className="flex items-center justify-center w-full gap-3 px-4 py-3 mt-4 text-gray-700 transition-all duration-300 bg-white border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <FcGoogle className="w-5 h-5" />
              <span className="font-medium">Google</span>
            </button>
          </div>

          <p className="text-center text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
