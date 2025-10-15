export const dynamic = "force-dynamic";
export const revalidate = 0;

import {
  Breadcrumb,
  Filters,
  Pagination,
  Products,
  SortBy,
} from "@/components";
import React from "react";
import { sanitize } from "@/lib/sanitize";

// improve readabillity of category text, for example category text "smart-watches" will be "smart watches"
const improveCategoryText = (text: string): string => {
  if (text.indexOf("-") !== -1) {
    let textArray = text.split("-");

    return textArray.join(" ");
  } else {
    return text;
  }
};

const ShopPage = async ({ params, searchParams }: { params: Promise<{ slug?: string[] }>, searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) => {
  // Await both params and searchParams
  const awaitedParams = await params;
  const awaitedSearchParams = await searchParams;
  
  return (
    <div className="text-gray-800 dark:text-white bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-10 max-sm:px-5 py-8">
        <Breadcrumb />
        <div className="grid grid-cols-[250px_1fr] gap-x-10 max-md:grid-cols-1 max-md:gap-y-8 mt-6">
          <Filters />
          <div>
            <div className="flex justify-between items-center max-lg:flex-col max-lg:gap-y-5 mb-6">
              <h2 className="text-3xl font-bold max-sm:text-2xl max-[400px]:text-xl uppercase text-purple-600 dark:text-purple-400">
                {awaitedParams?.slug && awaitedParams?.slug[0]?.length > 0
                  ? sanitize(improveCategoryText(awaitedParams?.slug[0]))
                  : "All products"}
              </h2>
              <SortBy />
            </div>
            <div className="border-b border-purple-200 dark:border-purple-700 mb-6"></div>
            <Products params={awaitedParams} searchParams={awaitedSearchParams} />
            <Pagination />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
