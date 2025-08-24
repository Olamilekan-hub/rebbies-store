// ===============================
// CART PAGE COMPONENT
// frontend/src/app/cart/page.tsx
// ===============================

'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ShoppingBagIcon,
  HeartIcon,
  TrashIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowLeftIcon,
  GiftIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { useCart, formatPrice } from '@/hooks/useCart';
import { CartItem } from '@/hooks/useCart';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
// import Badge from '@/components/ui/Badge';
import Input  from '@/components/ui/Input';
import clsx from 'clsx';

// ===============================
// CART ITEM ROW (FULL PAGE VERSION)
// ===============================

interface CartItemRowProps {
  item: CartItem;
  currency: string;
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onToggleWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
}

const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onToggleWishlist,
  isWishlisted = false
}) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const price = item.variant.prices?.find(p => p.currency_code === currency)?.amount || 0;
  const totalPrice = price * item.quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 0 && newQuantity <= 99) {
      setQuantity(newQuantity);
      onUpdateQuantity(item.id, newQuantity);
    }
  };

  const handleDirectQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value) || 0;
    handleQuantityChange(newQuantity);
  };

  return (
    <Card className="p-6">
      <div className="flex gap-6">
        {/* Product Image */}
        <div className="w-32 h-32 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
          {item.product.images?.[0]?.url ? (
            <Image
              src={item.product.images[0].url}
              alt={item.product.title || 'Product'}
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-neutral-400">
              <ShoppingBagIcon className="w-12 h-12" />
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="font-semibold text-neutral-900 text-lg mb-2">
                <Link 
                  href={`/products/${item.product.handle}`}
                  className="hover:text-rebbie-600 transition-colors"
                >
                  {item.product.title}
                </Link>
              </h3>
              
              {/* Variant Information */}
              {/* <div className="flex flex-wrap gap-2 mb-3">
                {item.variant.title && item.variant.title !== 'Default Title' && (
                  <Badge variant="secondary">
                    {item.variant.title}
                  </Badge>
                )}
                {item.product.collection && (
                  <Badge variant="outline">
                    {item.product.collection.title}
                  </Badge>
                )}
              </div> */}

              {/* Product Description */}
              {item.product.description && (
                <p className="text-sm text-neutral-600 line-clamp-2 mb-3">
                  {item.product.description}
                </p>
              )}

              {/* In Stock Status */}
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-green-600 font-medium">In Stock</span>
                <span className="text-neutral-500">• Ready to ship</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleWishlist?.(item.product.id)}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors"
                title={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {isWishlisted ? (
                  <HeartSolidIcon className="w-5 h-5 text-red-500" />
                ) : (
                  <HeartIcon className="w-5 h-5 text-neutral-400" />
                )}
              </button>
              
              <button
                onClick={() => onRemoveItem(item.id)}
                className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"
                title="Remove from cart"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Price and Quantity */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Quantity Controls */}
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-neutral-700">Quantity:</span>
                <div className="flex items-center border border-neutral-300 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-neutral-100 rounded-l-lg"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleDirectQuantityChange}
                    className="w-16 h-10 text-center border-0 focus:ring-0 bg-neutral-50"
                    min="1"
                    max="99"
                  />
                  
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-neutral-100 rounded-r-lg"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Unit Price */}
              <div className="text-sm text-neutral-600">
                <span className="font-medium">{formatPrice(price, currency)}</span> each
              </div>
            </div>

            {/* Total Price */}
            <div className="text-right">
              <div className="text-2xl font-bold text-neutral-900">
                {formatPrice(totalPrice, currency)}
              </div>
              {quantity > 1 && (
                <div className="text-sm text-neutral-500">
                  {quantity} × {formatPrice(price, currency)}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

// ===============================
// PROMO CODE COMPONENT
// ===============================

const PromoCodeSection: React.FC = () => {
  const [promoCode, setPromoCode] = useState('');
  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsApplied(true);
    setIsLoading(false);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <TagIcon className="w-5 h-5 text-rebbie-600" />
        <h3 className="font-semibold text-neutral-900">Promo Code</h3>
      </div>

      {!isApplied ? (
        <div className="flex gap-3">
          <Input
            placeholder="Enter promo code"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleApplyPromo}
            disabled={!promoCode.trim() || isLoading}
            variant="outline"
          >
            {isLoading ? 'Applying...' : 'Apply'}
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-green-700 font-medium">WELCOME10 applied</span>
          </div>
          <button
            onClick={() => setIsApplied(false)}
            className="text-green-600 hover:text-green-700 text-sm"
          >
            Remove
          </button>
        </div>
      )}
    </Card>
  );
};

// ===============================
// ORDER SUMMARY COMPONENT
// ===============================

interface OrderSummaryProps {
  currency: string;
  cartTotal: number;
  shippingCost: number;
  promoDiscount?: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  currency,
  cartTotal,
  shippingCost,
  promoDiscount = 0
}) => {
  const finalTotal = cartTotal + shippingCost - promoDiscount;

  return (
    <Card className="p-6 sticky top-6">
      <h3 className="font-semibold text-neutral-900 text-lg mb-6">Order Summary</h3>
      
      <div className="space-y-4 text-sm">
        <div className="flex justify-between">
          <span className="text-neutral-600">Subtotal</span>
          <span className="text-neutral-900 font-medium">{formatPrice(cartTotal, currency)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-neutral-600">Shipping</span>
          <span className={clsx(
            shippingCost === 0 ? 'text-green-600 font-medium' : 'text-neutral-900 font-medium'
          )}>
            {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost, currency)}
          </span>
        </div>

        {promoDiscount > 0 && (
          <div className="flex justify-between">
            <span className="text-neutral-600">Discount</span>
            <span className="text-green-600 font-medium">
              -{formatPrice(promoDiscount, currency)}
            </span>
          </div>
        )}
        
        <div className="border-t border-neutral-200 pt-4">
          <div className="flex justify-between text-lg">
            <span className="font-semibold text-neutral-900">Total</span>
            <span className="font-bold text-rebbie-600">{formatPrice(finalTotal, currency)}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <Link href="/checkout" className="block mt-6">
        <Button fullWidth size="lg">
          Proceed to Checkout
        </Button>
      </Link>

      {/* Trust Badges */}
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-3 text-sm text-neutral-600">
          <ShieldCheckIcon className="w-5 h-5 text-green-500" />
          <span>Secure SSL encrypted checkout</span>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-neutral-600">
          <TruckIcon className="w-5 h-5 text-blue-500" />
          <span>Free shipping on orders over ₦50,000</span>
        </div>
        
        <div className="flex items-center gap-3 text-sm text-neutral-600">
          <GiftIcon className="w-5 h-5 text-purple-500" />
          <span>Free gift wrapping available</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="mt-6 p-4 bg-neutral-50 rounded-lg">
        <div className="text-xs text-neutral-600 text-center mb-2">We accept</div>
        <div className="flex justify-center gap-2 text-xs text-neutral-500">
          🏦 Bank Transfer • 💳 Cards • 📱 USSD • 🚚 COD
        </div>
      </div>
    </Card>
  );
};

// ===============================
// MAIN CART PAGE
// ===============================

export default function CartPage() {
  const [isClient, setIsClient] = useState(false);
  
  // Prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  const {
    state,
    updateQuantity,
    removeItem,
    clearCart,
    getCartTotal,
    getCartCount,
    getShippingCost,
    changeCurrency,
    changeShippingLocation
  } = useCart();

  const { items, currency, shippingLocation } = state;
  const cartTotal = getCartTotal();
  const cartCount = getCartCount();
  const shippingCost = getShippingCost();

  // Mock wishlist state (this would come from a real wishlist context)
  const [wishlistedItems, setWishlistedItems] = useState<string[]>([]);

  // Show loading state during hydration
  if (!isClient) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-neutral-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-neutral-300 rounded w-48 mx-auto"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleWishlistToggle = (productId: string) => {
    setWishlistedItems(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBagIcon className="w-24 h-24 text-neutral-300 mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-neutral-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-neutral-600 mb-8">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Link href="/products">
              <Button size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/products"
              className="flex items-center gap-2 text-rebbie-600 hover:text-rebbie-700 transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5" />
              <span>Continue Shopping</span>
            </Link>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900">Shopping Cart</h1>
              <p className="text-neutral-600 mt-1">
                {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
              </p>
            </div>

            {/* Currency Selector */}
            <div className="flex items-center gap-3">
              <span className="text-sm text-neutral-600">Currency:</span>
              <select
                value={currency}
                onChange={(e) => changeCurrency(e.target.value as any)}
                className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
              >
                <option value="NGN">🇳🇬 Nigerian Naira (₦)</option>
                <option value="USD">🇺🇸 US Dollar ($)</option>
                <option value="EUR">🇪🇺 Euro (€)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                currency={currency}
                onUpdateQuantity={updateQuantity}
                onRemoveItem={removeItem}
                onToggleWishlist={handleWishlistToggle}
                isWishlisted={wishlistedItems.includes(item.product.id)}
              />
            ))}

            {/* Promo Code */}
            <PromoCodeSection />

            {/* Clear Cart */}
            <div className="flex justify-end">
              <button
                onClick={clearCart}
                className="text-sm text-neutral-500 hover:text-red-600 transition-colors"
              >
                Clear entire cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              currency={currency}
              cartTotal={cartTotal}
              shippingCost={shippingCost}
              promoDiscount={0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}