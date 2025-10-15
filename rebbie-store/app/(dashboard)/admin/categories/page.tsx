"use client";
import { CustomButton, DashboardSidebar } from "@/components";
import { nanoid } from "nanoid";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { formatCategoryName } from "../../../../utils/categoryFormating";
import apiClient from "@/lib/api";

const DashboardCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  // getting all categories to be displayed on the all categories page
  useEffect(() => {
    apiClient.get("/api/categories")
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCategories(data);
      });
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 flex justify-start max-w-screen-2xl mx-auto min-h-screen max-xl:flex-col max-xl:gap-y-4">
      <DashboardSidebar />
      <div className="flex-1 p-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-purple-600 dark:text-purple-400 text-center mb-6">
            All Categories
          </h1>
          <div className="flex justify-end mb-6">
            <Link href="/admin/categories/new">
              <CustomButton
                buttonType="button"
                customWidth="180px"
                paddingX={6}
                paddingY={3}
                textSize="base"
                text="Add New Category"
                backgroundColor="bg-purple-600"
                textColor="text-white"
                className="hover:bg-purple-700 transition-colors duration-200"
              />
            </Link>
          </div>
          <div className="overflow-auto max-h-[70vh] rounded-lg border border-gray-200 dark:border-gray-700">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="p-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Category Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories &&
                  categories.map((category: Category) => (
                    <tr key={nanoid()} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                      <td className="w-4 p-4">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500 dark:focus:ring-purple-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          />
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {formatCategoryName(category?.name)}
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/categories/${category?.id}`}
                          className="font-medium text-purple-600 dark:text-purple-500 hover:text-purple-800 dark:hover:text-purple-400 transition-colors duration-200"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardCategory;
