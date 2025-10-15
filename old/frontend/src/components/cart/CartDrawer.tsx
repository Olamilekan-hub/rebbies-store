'use client';

import React, { Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Dialog, Transition } from '@headlessui/react';
import { 
  XMarkIcon, 
  MinusIcon, 
  PlusIcon,
  TrashIcon,
  ShoppingBagIcon,
  TruckIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { useCart, formatPrice, CartItem } from '@/context/CartContext';
import Button from '@/components/ui/Button';
// import { Badge } from '@/components/ui/Badge';
import clsx from 'clsx';

// ===============================
// CART ITEM COMPONENT
// ===============================

interface CartItemRowProps {
  item: CartItem;
  currency: string;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
}

const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  currency,
  onUpdateQuantity,
  onRemoveItem
}) => {
  const price = item.variant.prices?.find(p => p.currency_code === currency)?.amount || 0;
  const totalPrice = price * item.quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 0) {
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  return (
    <div className="flex items-start gap-4 py-6 border-b border-neutral-200 last:border-b-0">
      {/* Product Image */}
      <div className="w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
        {item.product.images?.[0]?.url ? (
          <Image
            src={item.product.images[0].url}
            alt={item.product.title || 'Product'}
            width={80}
            height={80}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400">
            <ShoppingBagIcon className="w-8 h-8" />
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-neutral-900 text-sm mb-1 line-clamp-2">
          {item.product.title}
        </h3>
        
        {/* Variant Information */}
        {/* <div className="flex flex-wrap gap-2 mb-2">
          {item.variant.title && item.variant.title !== 'Default Title' && (
            <Badge variant="secondary" size="sm">
              {item.variant.title}
            </Badge>
          )}
        </div> */}

        {/* Price */}
        <div className="text-sm text-neutral-600 mb-3">
          <span className="font-medium text-neutral-900">
            {formatPrice(totalPrice, currency)}
          </span>
          {item.quantity > 1 && (
            <span className="ml-2">
              ({formatPrice(price, currency)} each)
            </span>
          )}
        </div>

        {/* Quantity Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center border border-neutral-300 rounded-lg">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 rounded-l-lg"
              disabled={item.quantity <= 1}
            >
              <MinusIcon className="w-4 h-4" />
            </button>
            
            <span className="w-12 h-8 flex items-center justify-center text-sm font-medium bg-neutral-50">
              {item.quantity}
            </span>
            
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-neutral-100 rounded-r-lg"
            >
              <PlusIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Remove Button */}
          <button
            onClick={() => onRemoveItem(item.id)}
            className="text-neutral-400 hover:text-red-500 transition-colors"
          >
            <TrashIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ===============================
// SHIPPING CALCULATOR
// ===============================

interface ShippingCalculatorProps {
  currency: string;
  cartTotal: number;
  shippingCost: number;
  shippingLocation: string;
  onLocationChange: (location: 'lagos' | 'nigeria' | 'international') => void;
}

const ShippingCalculator: React.FC<ShippingCalculatorProps> = ({
  currency,
  cartTotal,
  shippingCost,
  shippingLocation,
  onLocationChange
}) => {
  const shippingOptions = [
    {
      id: 'lagos',
      name: 'Lagos',
      description: 'Same-day delivery',
      cost: 2000,
      freeThreshold: 50000
    },
    {
      id: 'nigeria',
      name: 'Nigeria',
      description: '2-3 business days',
      cost: 5000,
      freeThreshold: 100000
    },
    {
      id: 'international',
      name: 'International',
      description: '7-14 business days',
      cost: 15000,
      freeThreshold: 200000
    }
  ];

  return (
    <div className="bg-neutral-50 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 text-sm font-medium text-neutral-900">
        <TruckIcon className="w-4 h-4" />
        Shipping Options
      </div>

      <div className="space-y-2">
        {shippingOptions.map((option) => (
          <label
            key={option.id}
            className={clsx(
              'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors',
              shippingLocation === option.id
                ? 'border-rebbie-500 bg-rebbie-50'
                : 'border-neutral-200 hover:border-neutral-300'
            )}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                name="shipping"
                value={option.id}
                checked={shippingLocation === option.id}
                onChange={() => onLocationChange(option.id as any)}
                className="text-rebbie-600"
              />
              <div>
                <div className="text-sm font-medium text-neutral-900">
                  {option.name}
                </div>
                <div className="text-xs text-neutral-600">
                  {option.description}
                </div>
              </div>
            </div>

            <div className="text-right">
              {cartTotal >= option.freeThreshold ? (
                <span className="text-sm font-medium text-green-600">FREE</span>
              ) : (
                <span className="text-sm font-medium text-neutral-900">
                  {formatPrice(option.cost, currency)}
                </span>
              )}
            </div>
          </label>
        ))}
      </div>

      {/* Free Shipping Progress */}
      {shippingCost > 0 && (
        <div className="mt-3 p-3 bg-blue-50 rounded-lg">
          <div className="text-xs text-blue-700 mb-1">
            Add {formatPrice(
              shippingOptions.find(opt => opt.id === shippingLocation)?.freeThreshold! - cartTotal,
              currency
            )} more for free shipping!
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(
                  (cartTotal / shippingOptions.find(opt => opt.id === shippingLocation)?.freeThreshold!) * 100,
                  100
                )}%`
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

// ===============================
// MAIN CART DRAWER
// ===============================

interface CartDrawerProps {
  className?: string;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ className }) => {
  const {
    state,
    updateQuantity,
    removeItem,
    clearCart,
    closeCart,
    getCartTotal,
    getCartCount,
    getShippingCost,
    changeCurrency,
    changeShippingLocation
  } = useCart();

  const { items, isOpen, currency, shippingLocation } = state;
  const cartTotal = getCartTotal();
  const cartCount = getCartCount();
  const shippingCost = getShippingCost();
  const finalTotal = cartTotal + shippingCost;

  const currencyOptions = [
    { value: 'NGN', symbol: '₦', label: 'Nigerian Naira' },
    { value: 'USD', symbol: '$', label: 'US Dollar' },
    { value: 'EUR', symbol: '€', label: 'Euro' }
  ];

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeCart}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-neutral-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
                      <div className="flex items-center gap-3">
                        <ShoppingBagIcon className="w-6 h-6 text-neutral-600" />
                        <h2 className="text-lg font-semibold text-neutral-900">
                          Shopping Cart
                        </h2>
                        {/* {cartCount > 0 && (
                          <Badge variant="primary">
                            {cartCount} {cartCount === 1 ? 'item' : 'items'}
                          </Badge>
                        )} */}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Currency Selector */}
                        <select
                          value={currency}
                          onChange={(e) => changeCurrency(e.target.value as any)}
                          className="text-sm border border-neutral-300 rounded-lg px-2 py-1"
                        >
                          {currencyOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.symbol}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={closeCart}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Cart Content */}
                    <div className="flex-1 overflow-y-auto">
                      {items.length === 0 ? (
                        // Empty Cart
                        <div className="flex flex-col items-center justify-center h-full px-6 py-12 text-center">
                          <ShoppingBagIcon className="w-16 h-16 text-neutral-300 mb-4" />
                          <h3 className="text-lg font-medium text-neutral-900 mb-2">
                            Your cart is empty
                          </h3>
                          <p className="text-neutral-600 mb-6">
                            Discover amazing products and add them to your cart
                          </p>
                          <Button onClick={closeCart} size="lg">
                            Continue Shopping
                          </Button>
                        </div>
                      ) : (
                        // Cart Items
                        <div className="px-6">
                          {/* Items List */}
                          <div className="divide-y divide-neutral-200">
                            {items.map((item) => (
                              <CartItemRow
                                key={item.id}
                                item={item}
                                currency={currency}
                                onUpdateQuantity={updateQuantity}
                                onRemoveItem={removeItem}
                              />
                            ))}
                          </div>

                          {/* Shipping Calculator */}
                          <div className="mt-6">
                            <ShippingCalculator
                              currency={currency}
                              cartTotal={cartTotal}
                              shippingCost={shippingCost}
                              shippingLocation={shippingLocation}
                              onLocationChange={changeShippingLocation}
                            />
                          </div>

                          {/* Order Summary */}
                          <div className="mt-6 bg-neutral-50 rounded-lg p-4">
                            <h3 className="font-medium text-neutral-900 mb-3">Order Summary</h3>
                            
                            <div className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-neutral-600">Subtotal</span>
                                <span className="text-neutral-900">{formatPrice(cartTotal, currency)}</span>
                              </div>
                              
                              <div className="flex justify-between">
                                <span className="text-neutral-600">Shipping</span>
                                <span className={clsx(
                                  shippingCost === 0 ? 'text-green-600 font-medium' : 'text-neutral-900'
                                )}>
                                  {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost, currency)}
                                </span>
                              </div>
                              
                              <div className="border-t border-neutral-200 pt-2 mt-2">
                                <div className="flex justify-between font-semibold text-base">
                                  <span className="text-neutral-900">Total</span>
                                  <span className="text-rebbie-600">{formatPrice(finalTotal, currency)}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Clear Cart Button */}
                          <button
                            onClick={clearCart}
                            className="w-full mt-4 text-sm text-neutral-500 hover:text-red-600 transition-colors"
                          >
                            Clear Cart
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    {items.length > 0 && (
                      <div className="border-t border-neutral-200 px-6 py-4 space-y-3">
                        <Link href="/cart" onClick={closeCart}>
                          <Button variant="outline" fullWidth>
                            View Cart Details
                          </Button>
                        </Link>
                        
                        <Link href="/checkout" onClick={closeCart}>
                          <Button fullWidth size="lg">
                            Checkout • {formatPrice(finalTotal, currency)}
                          </Button>
                        </Link>

                        {/* Nigerian Payment Info */}
                        <div className="text-xs text-center text-neutral-500">
                          🇳🇬 Paystack, Bank Transfer & Pay-on-Delivery available
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default CartDrawer;