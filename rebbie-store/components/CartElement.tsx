// *********************
// Role of the component: Cart icon and quantity that will be located in the header
// Name of the component: CartElement.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <CartElement />
// Input parameters: no input parameters
// Output: Cart icon and quantity
// *********************

"use client";
import Link from 'next/link'
import React from 'react'
import { FaCartShopping } from 'react-icons/fa6'
import { useProductStore } from "@/app/_zustand/store";

const CartElement = () => {
    const { allQuantity } = useProductStore();
  return (
    <div className="relative group">
      <Link href="/cart" className="transition-all duration-300 hover:scale-110">
        <FaCartShopping className="text-2xl text-gray-700 dark:text-gray-300 transition-colors duration-300 group-hover:text-primary-600 dark:group-hover:text-primary-400" />
        {allQuantity > 0 && (
          <span className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-primary-600 to-primary-800 text-white text-xs font-bold rounded-full flex justify-center items-center animate-pulse">
            {allQuantity}
          </span>
        )}
      </Link>
    </div>
  )
}

export default CartElement