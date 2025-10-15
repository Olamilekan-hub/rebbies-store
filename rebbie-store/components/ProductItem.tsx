import Image from "next/image";
import React from "react";
import Link from "next/link";
import ProductItemRating from "./ProductItemRating";
import CustomButton from "./CustomButton";
import { sanitize } from "@/lib/sanitize";
import { IoHeart, IoHeartOutline } from "react-icons/io5";

const ProductItem = ({
  product,
  color,
}: {
  product: Product;
  color: string;
}) => {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-800 group">
      {/* Image Container */}
      <div className="relative bg-gray-50 dark:bg-gray-800 p-4">
        <Link href={`/product/${product.slug}`}>
          <Image
            src={
              product.mainImage
                ? `/${product.mainImage}`
                : "/product_placeholder.jpg"
            }
            width={280}
            height={200}
            className="w-full h-48 object-contain transition-transform duration-300 group-hover:scale-105"
            alt={sanitize(product?.title) || "Product image"}
          />
        </Link>

        {/* Sale Badge */}
        {product.onSale && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-medium">
            30%
          </div>
        )}

        {/* Wishlist Heart */}
        <button className="absolute top-2 right-2 p-2 rounded-full bg-white dark:bg-gray-700 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110">
          <IoHeartOutline className="w-4 h-4 text-gray-500 dark:text-gray-400 hover:text-red-500" />
        </button>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <Link
          href={`/product/${product.slug}`}
          className="block font-medium text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-300 line-clamp-2 text-sm"
        >
          {sanitize(product.title)}
        </Link>

        {/* Brand */}
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {product.brand || "Brand"}
        </p>

        {/* Rating */}
        <ProductItemRating productRating={product?.rating} />

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900 dark:text-white">
            ₦{product.price?.toLocaleString()}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              ₦{product.originalPrice?.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <CustomButton
          text="Add To Cart"
          variant="primary"
          customWidth="full"
          paddingX={4}
          paddingY={2}
          textSize="sm"
          className="w-full"
        />
      </div>
    </div>
  );
};

export default ProductItem;
