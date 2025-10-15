import { ProductItem } from "@/components";
import apiClient from "@/lib/api";
import React from "react";
import { sanitize } from "@/lib/sanitize";

interface Props {
  searchParams: { search: string };
}

// sending api request for search results for a given search text
const SearchPage = async ({ searchParams }: Props) => {
  const sp = await searchParams;
  const data = await apiClient.get(
    `/api/search?query=${sp?.search || ""}`
  );

  const products = await data.json();

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        {sp?.search && (
          <h3 className="text-4xl text-center py-10 max-sm:text-3xl text-purple-600 dark:text-purple-400 font-bold">
            Showing results for "{sanitize(sp?.search)}"
          </h3>
        )}
        <div className="grid grid-cols-4 justify-items-center gap-x-4 gap-y-8 max-[1300px]:grid-cols-3 max-lg:grid-cols-2 max-[500px]:grid-cols-1 mt-8">
          {products.length > 0 ? (
            products.map((product: Product) => (
              <ProductItem key={product.id} product={product} color="purple" />
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <h3 className="text-3xl mt-5 text-gray-600 dark:text-gray-400 max-[1000px]:text-2xl max-[500px]:text-lg font-semibold">
                No products found for specified query
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mt-4 text-lg">
                Try searching with different keywords or browse our categories
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

/*

*/
