"use client";
import { DashboardSidebar, StatsElement } from "@/components";
import React, { useEffect } from "react";
import { FaArrowUp } from "react-icons/fa6";

const AdminDashboardPage = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 flex justify-start max-w-screen-2xl mx-auto max-xl:flex-col min-h-screen">
      <DashboardSidebar />
      <div className="flex flex-col items-center ml-5 gap-y-6 w-full max-xl:ml-0 max-xl:px-4 max-xl:mt-6 max-md:gap-y-4 p-6">
        <div className="flex justify-between w-full gap-4 max-md:flex-col max-md:w-full max-md:gap-y-4">
          <StatsElement />
          <StatsElement />
          <StatsElement />
        </div>
        <div className="w-full bg-gradient-to-r from-purple-600 to-purple-700 dark:from-purple-700 dark:to-purple-800 text-white rounded-2xl shadow-lg p-8 flex flex-col justify-center items-center gap-y-3">
          <h4 className="text-3xl text-purple-100 max-[400px]:text-2xl font-semibold">
            Number of visitors today
          </h4>
          <p className="text-4xl font-bold">1,200</p>
          <p className="text-green-300 flex gap-x-2 items-center text-lg">
            <FaArrowUp />
            12.5% Since last month
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
