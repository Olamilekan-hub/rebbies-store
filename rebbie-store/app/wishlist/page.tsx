import { Loader } from "@/components/Loader";
import dynamic from "next/dynamic";
import React, { Suspense } from "react";

import { WishlistModule } from "@/components/modules/wishlist"; //slow

// const DynamicWishlistModule = dynamic(
//   () =>
//     (async () => {
//       const mod = await import("@/components/modules/wishlist");
//       return mod.WishlistModule
//     })(),
//   { ssr: false }
// );


const WishlistPage = () => {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-screen-2xl mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-8">Wishlist</h1>
      </div>
      <Suspense fallback={<Loader />}>
        <WishlistModule />
      </Suspense>
    </div>
  );
};

export default WishlistPage;
