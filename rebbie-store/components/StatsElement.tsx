// *********************
// IN DEVELOPMENT
// *********************

import React from "react";
import { FaArrowUp } from "react-icons/fa6";


const StatsElement = () => {
  return (
    <div className="flex-1 min-w-[250px] h-36 bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700 text-gray-800 dark:text-white flex flex-col justify-center items-center rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 max-md:w-full">
      <h4 className="text-xl text-purple-600 dark:text-purple-400 font-semibold">New Products</h4>
      <p className="text-3xl font-bold text-gray-800 dark:text-white mt-2">2,230</p>
      <p className="text-green-500 flex gap-x-2 items-center mt-2 text-sm">
        <FaArrowUp />
        12.5% Since last month
      </p>
    </div>
  );
};

export default StatsElement;
