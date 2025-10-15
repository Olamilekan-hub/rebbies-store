"use client";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import { BiPhoneCall } from "react-icons/bi";
import { CiLocationOn } from "react-icons/ci";

const HeaderTop = () => {
  return (
    <div className="h-12 text-white bg-black dark:bg-primary-700 max-lg:px-5 max-lg:h-16 max-[573px]:px-0 transition-colors transition-300 transition-duration-600 duration-600 ease-in-out">
      <div className="max-w-6xl mx-auto flex justify-between h-full max-lg:flex-col max-lg:justify-center max-lg:items-center  mx-auto px-12 text-sm">
        <div className="flex items-center h-full gap-x-5 max-[370px]:text-sm max-[370px]:gap-x-2">
          <div className="flex items-center font-semibold gap-x-2">
            <BiPhoneCall className="text-white" />
            <span>+234 80 123 4567</span>
          </div>
        </div>
        <div className="flex items-center h-full gap-x-5 max-[370px]:text-sm max-[370px]:gap-x-2">
          <div className="flex items-center font-semibold gap-x-2">
            <CiLocationOn className="text-white" />
            <span>Lagos, Nigeria</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderTop;