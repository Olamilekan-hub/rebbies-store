"use client";
import React, { useEffect, useState } from "react";
import ProductItem from "./ProductItem";
import Heading from "./Heading";
import apiClient from "@/lib/api";

const ProductsSection = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get("/api/products");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.status}`);
        }
        
        const data = await response.json();
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="bg-purple-50 dark:bg-gray-900 border-t-4 border-purple-200 dark:border-purple-800">
        <div className="max-w-screen-2xl mx-auto pt-20">
          <Heading title="FEATURED PRODUCTS" />
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-purple-50 dark:bg-gray-900 border-t-4 border-purple-200 dark:border-purple-800">
        <div className="max-w-screen-2xl mx-auto pt-20">
          <Heading title="FEATURED PRODUCTS" />
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <p className="text-red-600 dark:text-red-400 mb-4">
                Unable to load products at the moment.
              </p>
              <button 
                onClick={() => window.location.reload()} 
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
