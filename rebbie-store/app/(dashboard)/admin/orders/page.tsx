"use client";
import { AdminOrders, DashboardSidebar } from "@/components";
import React from "react";

const DashboardOrdersPage = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 flex justify-start max-w-screen-2xl mx-auto min-h-screen max-xl:flex-col">
      <DashboardSidebar />
      <div className="flex-1 p-6">
        <AdminOrders />
      </div>
    </div>
  );
};

export default DashboardOrdersPage;
