
import { Loader } from "@/components/Loader";
import { CartModule } from "@/components/modules/cart";
import { Suspense } from "react";

const CartPage = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="mx-auto max-w-2xl px-4 pb-24 pt-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <h1 className="text-4xl font-bold tracking-tight text-purple-600 dark:text-purple-400 sm:text-5xl mb-8">
          Shopping Cart
        </h1>
        <Suspense fallback={<Loader />}>
          <CartModule />
        </Suspense>
      </div>
    </div>
  );
};

export default CartPage;
