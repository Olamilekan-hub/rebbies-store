// *********************
// Role of the component: Wishlist icon with quantity located in the header
// Name of the component: HeartElement.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <HeartElement />
// Input parameters: no input parameters
// Output: wishlist icon with quantity
// *********************

"use client";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import Link from "next/link";
import React from "react";
import { FaHeart } from "react-icons/fa6";

const HeartElement = ({wishQuantity}: {wishQuantity: number}) => {
  return (
    <div className="relative group">
      <Link href="/wishlist" className="transition-all duration-300 hover:scale-110">
        <FaHeart className="text-2xl text-gray-700 dark:text-gray-300 transition-colors duration-300 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
        {wishQuantity > 0 && (
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-primary-600 to-primary-800 text-white text-xs font-bold rounded-full flex justify-center items-center animate-pulse">
            {wishQuantity}
          </span>
        )}
      </Link>
    </div>
  );
};

export default HeartElement;
