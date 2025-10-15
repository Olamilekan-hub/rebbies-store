// *********************
// Role of the component: Sidebar on admin dashboard page
// Name of the component: DashboardSidebar.tsx
// Developer: Aleksandar Kuzmanovic
// Version: 1.0
// Component call: <DashboardSidebar />
// Input parameters: no input parameters
// Output: sidebar for admin dashboard page
// *********************

import React from "react";
import { MdDashboard } from "react-icons/md";
import { FaTable } from "react-icons/fa6";
import { FaRegUser } from "react-icons/fa6";
import { FaGear } from "react-icons/fa6";
import { FaBagShopping } from "react-icons/fa6";
import { MdCategory } from "react-icons/md";


import Link from "next/link";

const DashboardSidebar = () => {
  return (
    <div className="xl:w-[300px] bg-gradient-to-b from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 h-full max-xl:w-full shadow-lg">
      <div className="p-6 border-b border-purple-500">
        <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
        <p className="text-purple-200 text-sm">Rebbie Vault</p>
      </div>
      <Link href="/admin">
        <div className="flex gap-x-3 w-full hover:bg-purple-500 dark:hover:bg-purple-600 cursor-pointer items-center py-4 px-6 text-lg text-white transition-colors duration-200 border-l-4 border-transparent hover:border-purple-200">
          <MdDashboard className="text-xl" />
          <span className="font-medium">Dashboard</span>
        </div>
      </Link>
      <Link href="/admin/orders">
        <div className="flex gap-x-3 w-full hover:bg-purple-500 dark:hover:bg-purple-600 cursor-pointer items-center py-4 px-6 text-lg text-white transition-colors duration-200 border-l-4 border-transparent hover:border-purple-200">
          <FaBagShopping className="text-xl" />
          <span className="font-medium">Orders</span>
        </div>
      </Link>
      <Link href="/admin/products">
        <div className="flex gap-x-3 w-full hover:bg-purple-500 dark:hover:bg-purple-600 cursor-pointer items-center py-4 px-6 text-lg text-white transition-colors duration-200 border-l-4 border-transparent hover:border-purple-200">
          <FaTable className="text-xl" />
          <span className="font-medium">Products</span>
        </div>
      </Link>
      <Link href="/admin/categories">
        <div className="flex gap-x-3 w-full hover:bg-purple-500 dark:hover:bg-purple-600 cursor-pointer items-center py-4 px-6 text-lg text-white transition-colors duration-200 border-l-4 border-transparent hover:border-purple-200">
          <MdCategory className="text-xl" />
          <span className="font-medium">Categories</span>
        </div>
      </Link>
      <Link href="/admin/users">
        <div className="flex gap-x-3 w-full hover:bg-purple-500 dark:hover:bg-purple-600 cursor-pointer items-center py-4 px-6 text-lg text-white transition-colors duration-200 border-l-4 border-transparent hover:border-purple-200">
          <FaRegUser className="text-xl" />
          <span className="font-medium">Users</span>
        </div>
      </Link>
      <Link href="/admin/settings">
        <div className="flex gap-x-3 w-full hover:bg-purple-500 dark:hover:bg-purple-600 cursor-pointer items-center py-4 px-6 text-lg text-white transition-colors duration-200 border-l-4 border-transparent hover:border-purple-200">
          <FaGear className="text-xl" />
          <span className="font-medium">Settings</span>
        </div>
      </Link>
    </div>
  );
};

export default DashboardSidebar;
