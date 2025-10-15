"use client";
import {
  CustomButton,
  DashboardProductTable,
  DashboardSidebar,
} from "@/components";
import React from "react";

const DashboardProducts = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 flex justify-start max-w-screen-2xl mx-auto min-h-screen max-xl:flex-col max-xl:gap-y-4">
      <DashboardSidebar />
      <div className="flex-1 p-6">
        <DashboardProductTable />
      </div>
    </div>
  );
};

export default DashboardProducts;
