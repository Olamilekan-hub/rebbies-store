"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { categoryMenuList, CategoryMenuItem } from "@/lib/utils";
import { IoArrowForward } from "react-icons/io5";

interface CategoryMenuProps {
  maxCategories?: number;
  showCTA?: boolean;
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({ 
  maxCategories, 
  showCTA = true 
}) => {
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());

  // Handle empty category list
  if (!categoryMenuList || categoryMenuList.length === 0) {
    return null;
  }

  // Limit categories if specified
  const displayedCategories = maxCategories 
    ? categoryMenuList.slice(0, maxCategories)
    : categoryMenuList;

  const handleImageError = (categoryId: number) => {
    setImageErrors(prev => new Set(prev).add(categoryId));
  };

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl dark:text-white">
            Shop by <span className="text-transparent bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text">Category</span>
          </h2>
          <div className="max-w-4xl mx-auto">
            <p className="mb-4 text-lg text-gray-700 dark:text-gray-300 md:text-xl">
              Browse our beauty store by category:
            </p>
            <ul className="grid gap-2 text-base text-left text-gray-600 md:grid-cols-2 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <span className="text-pink-500">✓</span> Skincare products for glowing skin
              </li>
              <li className="flex items-center gap-2">
                <span className="text-pink-500">✓</span> Makeup for every look
              </li>
              <li className="flex items-center gap-2">
                <span className="text-pink-500">✓</span> Hair care essentials
              </li>
              <li className="flex items-center gap-2">
                <span className="text-pink-500">✓</span> Fragrances & body care
              </li>
              <li className="flex items-center gap-2">
                <span className="text-pink-500">✓</span> Jewelry & accessories
              </li>
              <li className="flex items-center gap-2">
                <span className="text-pink-500">✓</span> Natural & organic options
              </li>
            </ul>
          </div>
        </div>{/* Categories Grid */}
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:gap-8">
          {displayedCategories.map((category) => (
            <Link
              key={category.id}
              href={category.href}
              title={`Shop ${category.title}`}
              aria-label={`Browse ${category.title} products`}
              className="relative p-6 overflow-hidden transition-all duration-500 group bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-3xl hover:shadow-2xl hover:-translate-y-2"
            >
              {/* Background gradient overlay */}
              <div 
                className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-pink-400/10 to-purple-600/10 group-hover:opacity-100"
                aria-hidden="true"
              ></div>              {/* Category Image */}
              <div className="relative w-20 h-20 mx-auto mb-4 overflow-hidden transition-transform duration-500 rounded-2xl group-hover:scale-110">
                {imageErrors.has(category.id) ? (
                  <div className="flex items-center justify-center w-full h-full bg-gray-200 dark:bg-gray-600">
                    <span className="text-2xl text-gray-400 dark:text-gray-500">
                      {category.title.charAt(0)}
                    </span>
                  </div>
                ) : (
                  <Image
                    src={category.src}
                    alt={`${category.title} category`}
                    fill
                    sizes="(max-width: 768px) 80px, 80px"
                    className="object-cover"
                    priority={category.id <= 4}
                    onError={() => handleImageError(category.id)}
                  />
                )}
                {/* Overlay on hover */}
                <div 
                  className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-t from-purple-600/20 to-transparent group-hover:opacity-100"
                  aria-hidden="true"
                ></div>
              </div>

              {/* Category Title */}
              <h3 className="mb-2 font-semibold text-center text-gray-900 transition-colors duration-300 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400">
                {category.title}
              </h3>

              {/* Shop Now Link */}
              <div className="flex items-center justify-center text-sm text-gray-500 transition-colors duration-300 dark:text-gray-400 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                <span className="mr-1">Shop Now</span>
                <IoArrowForward className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>              {/* Decorative elements */}
              <div 
                className="absolute w-3 h-3 transition-opacity duration-500 bg-purple-400 rounded-full opacity-0 top-2 right-2 group-hover:opacity-60"
                aria-hidden="true"
              ></div>
              <div 
                className="absolute w-2 h-2 transition-opacity duration-700 bg-pink-400 rounded-full opacity-0 bottom-2 left-2 group-hover:opacity-40"
                aria-hidden="true"
              ></div>
            </Link>
          ))}
        </div>        {/* Bottom CTA */}
        {showCTA && (
          <div className="mt-16 text-center">
            <Link
              href="/shop"
              title="View all products"
              aria-label="View all products in our shop"
              className="inline-flex items-center px-8 py-4 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl hover:shadow-xl hover:scale-105"
            >
              View All Products
              <IoArrowForward className="w-5 h-5 ml-2" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default CategoryMenu;
