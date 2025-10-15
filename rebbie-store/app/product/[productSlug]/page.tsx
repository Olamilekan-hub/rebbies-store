import {
  StockAvailabillity,
  UrgencyText,
  SingleProductRating,
  ProductTabs,
  SingleProductDynamicFields,
  AddToWishlistBtn,
} from "@/components";
import apiClient from "@/lib/api";
import Image from "next/image";
import { notFound } from "next/navigation";
import React from "react";
import { FaSquareFacebook } from "react-icons/fa6";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaSquarePinterest } from "react-icons/fa6";
import { sanitize } from "@/lib/sanitize";

interface ImageItem {
  imageID: string;
  productID: string;
  image: string;
}

interface SingleProductPageProps {
  params: Promise<{  productSlug: string, id: string }>;
}

const SingleProductPage = async ({ params }: SingleProductPageProps) => {
  const paramsAwaited = await params;
  // sending API request for a single product with a given product slug
  const data = await apiClient.get(
    `/api/slugs/${paramsAwaited?.productSlug}`
  );
  const product = await data.json();

  // sending API request for more than 1 product image if it exists
  const imagesData = await apiClient.get(
    `/api/images/${paramsAwaited?.id}`
  );
  const images = await imagesData.json();

  if (!product || product.error) {
    notFound();
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-screen-2xl mx-auto">
        <div className="flex justify-center gap-x-16 pt-10 max-lg:flex-col items-center gap-y-8 px-5">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg">
            <Image
              src={product?.mainImage ? `/${product?.mainImage}` : "/product_placeholder.jpg"}
              width={500}
              height={500}
              alt="main image"
              className="w-auto h-auto rounded-xl"
            />
            <div className="flex justify-around mt-5 flex-wrap gap-y-2 gap-x-2 max-[500px]:justify-center">
              {images?.map((imageItem: ImageItem, key: number) => (
                <Image
                  key={imageItem.imageID + key}
                  src={`/${imageItem.image}`}
                  width={100}
                  height={100}
                  alt="product image"
                  className="w-auto h-auto rounded-lg border-2 border-transparent hover:border-purple-300 cursor-pointer transition-all duration-300"
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-y-7 text-gray-800 dark:text-white max-[500px]:text-center bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
            <SingleProductRating rating={product?.rating} />
            <h1 className="text-4xl font-bold text-purple-600 dark:text-purple-400">{sanitize(product?.title)}</h1>
            <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">₦{product?.price?.toLocaleString()}</p>
            <StockAvailabillity stock={94} inStock={product?.inStock} />
            <SingleProductDynamicFields product={product} />
            <div className="flex flex-col gap-y-4 max-[500px]:items-center">
              <AddToWishlistBtn product={product} slug={paramsAwaited.productSlug} />
              <p className="text-lg text-gray-600 dark:text-gray-400">
                SKU: <span className="ml-1 font-semibold">abccd-18</span>
              </p>
              <div className="text-lg flex gap-x-3 items-center">
                <span className="text-gray-600 dark:text-gray-400">Share:</span>
                <div className="flex items-center gap-x-2 text-2xl">
                  <FaSquareFacebook className="text-blue-600 hover:text-blue-700 cursor-pointer transition-colors" />
                  <FaSquareXTwitter className="text-gray-800 dark:text-white hover:text-gray-600 cursor-pointer transition-colors" />
                  <FaSquarePinterest className="text-red-600 hover:text-red-700 cursor-pointer transition-colors" />
                </div>
              </div>
              <div className="flex gap-x-3 items-center">
                <span className="text-gray-600 dark:text-gray-400 text-sm">Payment methods:</span>
                <div className="flex gap-x-2">
                  <Image
                    src="/visa.svg"
                    width={40}
                    height={40}
                    alt="visa icon"
                    className="w-auto h-auto opacity-80 hover:opacity-100 transition-opacity"
                  />
                  <Image
                    src="/mastercard.svg"
                    width={40}
                    height={40}
                    alt="mastercard icon"
                    className="h-auto w-auto opacity-80 hover:opacity-100 transition-opacity"
                  />
                  <Image
                    src="/ae.svg"
                    width={40}
                    height={40}
                    alt="americal express icon"
                    className="h-auto w-auto opacity-80 hover:opacity-100 transition-opacity"
                  />
                  <Image
                    src="/paypal.svg"
                    width={40}
                    height={40}
                    alt="paypal icon"
                    className="w-auto h-auto opacity-80 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="py-16">
          <ProductTabs product={product} />
        </div>
      </div>
    </div>
  );
};

export default SingleProductPage;
