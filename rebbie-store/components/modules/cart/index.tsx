"use client"

import { useProductStore } from "@/app/_zustand/store";
import toast from "react-hot-toast";
import Image from "next/image"
import Link from "next/link";
import { FaCheck, FaCircleQuestion, FaClock, FaXmark } from "react-icons/fa6";
import QuantityInputCart from "@/components/QuantityInputCart";
import { sanitize } from "@/lib/sanitize";

export const CartModule = () => {

  const { products, removeFromCart, calculateTotals, total } =
    useProductStore();

  const handleRemoveItem = (id: string) => {
    removeFromCart(id);
    calculateTotals();
    toast.success("Product removed from the cart");
  };
  return (

    <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
      <section aria-labelledby="cart-heading" className="lg:col-span-7">
        <h2 id="cart-heading" className="sr-only">
          Items in your shopping cart
        </h2>

        <ul
          role="list"
          className="divide-y divide-purple-100 dark:divide-gray-700 border-b border-t border-purple-200 dark:border-gray-700"
        >
          {products.map((product) => (
            <li key={product.id} className="flex py-6 sm:py-10 bg-white dark:bg-gray-800 rounded-xl mb-4 p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="flex-shrink-0">
                <Image
                  width={192}
                  height={192}
                  src={product?.image ? `/${product.image}` : "/product_placeholder.jpg"}
                  alt="product image"
                  className="h-24 w-24 rounded-xl object-cover object-center sm:h-48 sm:w-48 border border-purple-200 dark:border-gray-600"
                />
              </div>

              <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                  <div>
                    <div className="flex justify-between">
                      <h3 className="text-lg">
                        <Link
                          href={`#`}
                          className="font-semibold text-gray-800 dark:text-white hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                        >
                          {sanitize(product.title)}
                        </Link>
                      </h3>
                    </div>
                    <p className="mt-2 text-lg font-bold text-purple-600 dark:text-purple-400">
                      ₦{product.price.toLocaleString()}
                    </p>
                  </div>

                  <div className="mt-4 sm:mt-0 sm:pr-9">
                    <QuantityInputCart product={product} />
                    <div className="absolute right-0 top-0">
                      <button
                        onClick={() => handleRemoveItem(product.id)}
                        type="button"
                        className="-m-2 inline-flex p-2 text-gray-400 hover:text-red-500 transition-colors duration-200 rounded-lg"
                      >
                        <span className="sr-only">Remove</span>
                        <FaXmark className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>
                </div>

                <p className="mt-4 flex space-x-2 text-sm text-gray-700 dark:text-gray-300">
                  {1 ? (
                    <FaCheck
                      className="h-5 w-5 flex-shrink-0 text-green-500"
                      aria-hidden="true"
                    />
                  ) : (
                    <FaClock
                      className="h-5 w-5 flex-shrink-0 text-gray-300"
                      aria-hidden="true"
                    />
                  )}

                  <span className="font-medium">{1 ? "In stock" : `Ships in 3 days`}</span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Order summary */}
      <section
        aria-labelledby="summary-heading"
        className="mt-16 rounded-xl bg-white dark:bg-gray-800 border border-purple-200 dark:border-gray-700 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8 shadow-lg"
      >
        <h2
          id="summary-heading"
          className="text-2xl font-bold text-purple-600 dark:text-purple-400"
        >
          Order Summary
        </h2>

        <dl className="mt-6 space-y-4">
          <div className="flex items-center justify-between">
            <dt className="text-sm text-gray-600 dark:text-gray-400">Subtotal</dt>
            <dd className="text-sm font-semibold text-gray-900 dark:text-white">
              ₦{total.toLocaleString()}
            </dd>
          </div>
          <div className="flex items-center justify-between border-t border-purple-100 dark:border-gray-700 pt-4">
            <dt className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <span>Shipping estimate</span>
              <a
                href="#"
                className="ml-2 flex-shrink-0 text-purple-400 hover:text-purple-600 dark:hover:text-purple-300"
              >
                <span className="sr-only">
                  Learn more about how shipping is calculated
                </span>
                <FaCircleQuestion
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </a>
            </dt>
            <dd className="text-sm font-semibold text-gray-900 dark:text-white">₦2,000</dd>
          </div>
          <div className="flex items-center justify-between border-t border-purple-100 dark:border-gray-700 pt-4">
            <dt className="flex text-sm text-gray-600 dark:text-gray-400">
              <span>Tax estimate</span>
              <a
                href="#"
                className="ml-2 flex-shrink-0 text-purple-400 hover:text-purple-600 dark:hover:text-purple-300"
              >
                <span className="sr-only">
                  Learn more about how tax is calculated
                </span>
                <FaCircleQuestion
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </a>
            </dt>
            <dd className="text-sm font-semibold text-gray-900 dark:text-white">
              ₦{Math.round(total * 0.075).toLocaleString()}
            </dd>
          </div>
          <div className="flex items-center justify-between border-t border-purple-200 dark:border-gray-700 pt-4">
            <dt className="text-lg font-bold text-purple-600 dark:text-purple-400">
              Order Total
            </dt>
            <dd className="text-lg font-bold text-purple-600 dark:text-purple-400">
              ₦{total === 0 ? 0 : Math.round(total + total * 0.075 + 2000).toLocaleString()}
            </dd>
          </div>
        </dl>
        {products.length > 0 && (
          <div className="mt-8">
            <Link
              href="/checkout"
              className="block flex justify-center items-center w-full uppercase bg-purple-600 px-4 py-4 text-lg font-bold text-white shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 rounded-xl transition-all duration-200 hover:shadow-xl"
            >
              <span>Proceed to Checkout</span>
            </Link>
          </div>
        )}
      </section>
    </form>

  )

}
