import Link from "next/link";
import React from "react";
import { CustomButton } from "@/components";

const IntroducingSection = () => {
  return (
    <div className="py-20 pt-24 bg-gradient-to-r from-purple-100 via-white to-purple-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="text-center flex flex-col gap-y-8 items-center max-w-6xl mx-auto px-6">
        <h2 className="text-gray-800 dark:text-white text-8xl font-extrabold text-center mb-2 max-md:text-6xl max-[480px]:text-4xl leading-tight">
          WELCOME TO <span className="text-purple-600">REBBIE</span> <span className="text-purple-500">VAULT</span>
        </h2>
        <div className="flex flex-col gap-y-4">
          <p className="text-gray-700 dark:text-gray-300 text-center text-2xl font-semibold max-md:text-xl max-[480px]:text-base">
            Your premier destination for premium beauty essentials.
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-center text-xl max-md:text-lg max-[480px]:text-base">
            Discover luxurious hair products, stunning jewelry, and beauty accessories.
          </p>
          <div className="mt-6 flex justify-center">            <CustomButton
              text="EXPLORE COLLECTION"
              variant="primary"
              paddingX={12}
              paddingY={4}
              textSize="xl"
              className="font-bold bg-purple-600 hover:bg-purple-700 transition-colors duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntroducingSection;
