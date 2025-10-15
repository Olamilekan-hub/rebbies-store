import React from "react";
import ProductItem from "./ProductItem";
import Heading from "./Heading";
import apiClient from "@/lib/api";

const ProductsSection = async () => {
  // sending API request for getting all products
  const data = await apiClient.get("/api/products");
  const products = await data.json();
  return (
    <div className="bg-purple-50 dark:bg-gray-900 border-t-4 border-purple-200 dark:border-purple-800">
      <div className="max-w-screen-2xl mx-auto pt-20">
        <Heading title="FEATURED PRODUCTS" />
        <div className="grid grid-cols-4 justify-items-center max-w-screen-2xl mx-auto py-10 gap-x-2 px-10 gap-y-8 max-xl:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
          {products.map((product: Product) => (
            <ProductItem key={product.id} product={product} color="purple" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductsSection;
