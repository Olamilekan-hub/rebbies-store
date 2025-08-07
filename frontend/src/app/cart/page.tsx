/**
 * Shopping Cart Page for Rebbie's Store
 * Displays cart items with ability to update quantities and proceed to checkout
 */

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/medusa';
import { RebbieLineItem } from '@/lib/types';
import { toast } from '@/components/ui/Toast';
import {
  TrashIcon,
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  TruckIcon,
  LockClosedIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';

// ===============================
// CART ITEM COMPONENT
// ===============================

interface CartItemProps {
  item: RebbieLineItem;
  onUpdateQuantity: (lineId: string, quantity: number) => void;
  onRemove: (lineId: string) => void;
  loading?: boolean;
}

const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  loading = false,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setIsUpdating(true);
    try {
      await onUpdateQuantity(item.id, newQuantity);
    } catch (error) {
      toast.error('Failed to update quantity');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    setIsUpdating(true);
    try {
      await onRemove(item.id);
      toast.success('Item removed from cart');
    } catch (error) {
      toast.error('Failed to remove item');
    } finally {
      setIsUpdating(false);
    }
  };

  // Get product image
  const productImage = item.variant?.product?.images?.[0]?.url;
  const productTitle = item.title || item.variant?.product?.title || 'Product';
  const variantTitle = item.variant?.title;

  // Get formatted price
  const unitPrice = item.unit_price || 0;
  const totalPrice = (item.unit_price || 0) * item.quantity;
  const formattedUnitPrice = formatPrice(unitPrice, 'NGN');
  const formattedTotalPrice = formatPrice(totalPrice, 'NGN');

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-6 ${isUpdating ? 'opacity-50' : ''}`}>
      <div className="flex gap-4">
        {/* Product Image */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden">
            {productImage ? (
              <Image
                src={productImage}
                alt={productTitle}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <ShoppingBagIcon className="w-8 h-8" />
              </div>
            )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-medium text-gray-900 line-clamp-2">
                {productTitle}
              </h3>
              {variantTitle && (
                <p className="text-sm text-gray-600 mt-1">{variantTitle}</p>
              )}
              
              {/* Item details */}
              <div className="mt-2 space-y-1 text-sm text-gray-500">
                <div>SKU: {item.variant?.sku || 'N/A'}</div>
                <div>Unit Price: {formattedUnitPrice}</div>
              </div>
            </div>

            {/* Price */}
            <div className="text-right ml-4">
              <div className="text-lg font-semibold text-gray-900">
                {formattedTotalPrice}
              </div>
              {item.quantity > 1 && (
                <div className="text-sm text-gray-500">
                  {formattedUnitPrice} each
                </div>
              )}
            </div>
          </div>

          {/* Quantity Controls & Actions */}
          <div className="mt-4 flex items-center justify-between">
            {/* Quantity Selector */}
            <div className="flex items-center border border-gray-300 rounded-lg">
              <button
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1 || isUpdating}
                className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MinusIcon className="w-4 h-4" />
              </button>
              
              <span className="px-4 py-2 border-l border-r border-gray-300 min-w-[3rem] text-center">
                {isUpdating ? (
                  <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mx-auto" />
                ) : (
                  item.quantity
                )}
              </span>
              
              <button
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={isUpdating}
                className="p-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PlusIcon className="w-4 h-4" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toast.info('Wishlist feature coming soon!')}
                className="p-2 text-gray-400 hover:text-rebbie-purple-600 transition-colors"
                title="Save for later"
              >
                <HeartIcon className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleRemove}
                disabled={isUpdating}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                title="Remove item"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ===============================
// CART SUMMARY COMPONENT
// ===============================

interface CartSummaryProps {
  cart: any;
  onCheckout: () => void;
  checkoutLoading?: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  cart,
  onCheckout,
  checkoutLoading = false,
}) => {
  const subtotal = cart?.subtotal || 0;
  const shippingTotal = cart?.shipping_total || 0;
  const taxTotal = cart?.tax_total || 0;
  const total = cart?.total || 0;

  const formattedSubtotal = formatPrice(subtotal, cart?.currency_code || 'NGN');
  const formattedShipping = formatPrice(shippingTotal, cart?.currency_code || 'NGN');
  const formattedTax = formatPrice(taxTotal, cart?.currency_code || 'NGN');
  const formattedTotal = formatPrice(total, cart?.currency_code || 'NGN');

  return (
    <div className="bg-gray-50 rounded-lg p-6 sticky top-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">{formattedSubtotal}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {shippingTotal > 0 ? formattedShipping : 'Calculated at checkout'}
          </span>
        </div>
        
        {taxTotal > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax</span>
            <span className="font-medium">{formattedTax}</span>
          </div>
        )}
        
        <div className="border-t pt-3">
          <div className="flex justify-between">
            <span className="text-lg font-semibold text-gray-900">Total</span>
            <span className="text-lg font-bold text-gray-900">{formattedTotal}</span>
          </div>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
        <div className="flex items-center gap-2 text-green-800 text-sm">
          <TruckIcon className="w-4 h-4" />
          <span className="font-medium">Same-day delivery in Lagos</span>
        </div>
        <p className="text-green-600 text-xs mt-1">
          Order before 3PM for same-day delivery
        </p>
      </div>

      {/* Security Badge */}
      <div className="mb-6 flex items-center gap-2 text-sm text-gray-600">
        <LockClosedIcon className="w-4 h-4" />
        <span>Secure checkout with Paystack</span>
      </div>

      {/* Checkout Button */}
      <button
        onClick={onCheckout}
        disabled={checkoutLoading || !cart?.items?.length}
        className="w-full btn-base btn-primary py-4 text-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {checkoutLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Processing...
          </div>
        ) : (
          'Proceed to Checkout'
        )}
      </button>

      {/* Continue Shopping */}
      <Link
        href="/products"
        className="block w-full text-center mt-4 text-rebbie-purple-600 hover:text-rebbie-purple-700 font-medium"
      >
        Continue Shopping
      </Link>
    </div>
  );
};

// ===============================
// MAIN CART PAGE
// ===============================

export default function CartPage() {
  const { cart, loading, error, updateItem, removeItem } = useCart();
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    
    // Simulate checkout process
    setTimeout(() => {
      // Navigate to checkout page
      window.location.href = '/checkout';
    }, 1000);
  };

  const handleUpdateQuantity = async (lineId: string, quantity: number) => {
    try {
      await updateItem(lineId, quantity);
    } catch (error) {
      throw error; // Let the component handle the error
    }
  };

  const handleRemoveItem = async (lineId: string) => {
    try {
      await removeItem(lineId);
    } catch (error) {
      throw error; // Let the component handle the error
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-rebbie-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Loading your cart...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">😞</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Cart Error</h1>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/products" className="btn-base btn-primary">
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const cartItems = cart?.items || [];
  const isEmpty = cartItems.length === 0;

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-gray-50">
        {/* Page Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-gray-600 mt-2">
                  {isEmpty ? 'Your cart is empty' : `${cartItems.length} ${cartItems.length === 1 ? 'item' : 'items'} in your cart`}
                </p>
              </div>
              
              {!isEmpty && (
                <Link
                  href="/products"
                  className="btn-base btn-outline"
                >
                  Continue Shopping
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {isEmpty ? (
            /* Empty Cart State */
            <div className="text-center py-16">
              <div className="text-6xl mb-6">🛒</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Looks like you haven't added any items to your cart yet. 
                Start shopping to fill it up!
              </p>
              <div className="space-y-4">
                <Link href="/products" className="btn-base btn-primary px-8 py-3 text-lg">
                  Start Shopping
                </Link>
                <div className="text-sm text-gray-500">
                  or explore our <Link href="/products/category/thrift-fashion-bags" className="text-rebbie-purple-600 hover:underline">thrift collection</Link>
                </div>
              </div>
            </div>
          ) : (
            /* Cart with Items */
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Cart Items ({cartItems.length})
                    </h2>
                    
                    {/* Bulk Actions */}
                    <button
                      onClick={() => toast.info('Bulk actions coming soon!')}
                      className="text-sm text-gray-500 hover:text-rebbie-purple-600"
                    >
                      Select All
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item as RebbieLineItem}
                        onUpdateQuantity={handleUpdateQuantity}
                        onRemove={handleRemoveItem}
                      />
                    ))}
                  </div>
                </div>

                {/* Recommended Products */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">You might also like</h3>
                  <div className="text-center text-gray-500 py-8">
                    <p>Product recommendations coming soon!</p>
                  </div>
                </div>
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <CartSummary
                  cart={cart}
                  onCheckout={handleCheckout}
                  checkoutLoading={checkoutLoading}
                />
              </div>
            </div>
          )}
        </div>

        {/* Trust Badges */}
        {!isEmpty && (
          <section className="bg-white border-t py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                    <TruckIcon className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
                  <p className="text-gray-600 text-sm">Same-day delivery in Lagos, nationwide shipping</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <LockClosedIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">Secure Payment</h3>
                  <p className="text-gray-600 text-sm">Protected by Paystack, multiple payment options</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133