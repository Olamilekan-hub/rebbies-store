"use client";
import { CustomButton } from "@/components";
import { isValidEmailAddressFormat } from "@/lib/utils";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";
import { TbLoader3 } from "react-icons/tb";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import ErrorDisplay from "@/components/auth/ErrorDisplay";

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, status: sessionStatus } = useSession();

  // Beautiful marketplace/beauty images from Unsplash
  const marketplaceImages = [
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Jewelry store
    "https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Beauty products
    "https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Hair salon
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Jewelry display
    "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Beauty salon
    "https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Cosmetics
    "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Luxury jewelry
    "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Hair products
    "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80", // Beauty store
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"  // Elegant jewelry
  ];

  useEffect(() => {
    // Check if session expired
    const expired = searchParams.get('expired');
    if (expired === 'true') {
      setError("Your session has expired. Please log in again.");
      toast.error("Your session has expired. Please log in again.");
    }

    // if user has already logged in redirect to home page
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router, searchParams]);

  // Image rotation effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        (prevIndex + 1) % marketplaceImages.length
      );
    }, 10000); // 30 seconds

    return () => clearInterval(interval);
  }, [marketplaceImages.length]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const email = e.target[0].value;
    const password = e.target[1].value;

    // Enhanced client-side validation
    if (!isValidEmailAddressFormat(email)) {
      setError("Please enter a valid email address");
      toast.error("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    if (!password || password.length < 8) {
      setError("Password must be at least 8 characters long");
      toast.error("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password. Please check your credentials and try again.");
        toast.error("Invalid email or password");
      } else {
        setError("");
        toast.success("Welcome back! Login successful.");
        // Small delay to show success message before redirect
        setTimeout(() => {
          router.replace("/");
        }, 1000);
      }
    } catch (error: any) {
      const errorMessage = error.message || "Login failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
      console.error("Login error:", error);
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
          <p className="mt-2 text-white/80">Your destination for beauty and elegance.</p>
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
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Sign In</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">Enter your credentials to access your account</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
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
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <a href="/forgot-password" className="text-sm text-purple-600 transition-colors duration-200 dark:text-purple-400 hover:text-purple-500">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
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
            </div>

            <CustomButton
              buttonType="submit"
              text={isLoading ? "Signing in..." : "Sign In"}
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
              onClick={() => signIn("google")}
              className="flex items-center justify-center w-full gap-3 px-4 py-3 mt-4 text-gray-700 transition-all duration-300 bg-white border border-gray-300 dark:border-gray-600 rounded-xl dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <FcGoogle className="w-5 h-5" />
              <span className="font-medium">Google</span>
            </button>
          </div>

          <p className="text-center text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <a href="/register" className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
