import { CategoryMenu, Hero, Incentives, Newsletter } from "@/components";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-center py-20">
        <h1 className="text-5xl font-bold mb-4">Welcome to Rebbie&apos;s Store</h1>
        <p className="text-xl mb-8">Your Premier E-Commerce Destination</p>
        <div className="space-x-4">
          <Link 
            href="/shop" 
            className="bg-white text-purple-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 inline-block"
          >
            Shop Now
          </Link>
          <Link 
            href="/test-connection" 
            className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-purple-600 inline-block"
          >
            Test Connection
          </Link>
        </div>
      </div>
      
      <div className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            Store Features
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🛍️</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Easy Shopping
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Browse our extensive catalog of products with ease
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">💳</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Secure Payments
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Safe and secure payment processing with Paystack
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
                Fast Delivery
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Quick and reliable delivery to your doorstep
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
