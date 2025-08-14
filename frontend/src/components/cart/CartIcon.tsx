'use client';

import React from 'react';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/Badge';
import clsx from 'clsx';

interface CartIconProps {
  className?: string;
  showLabel?: boolean;
  variant?: 'header' | 'mobile' | 'floating';
}

export const CartIcon: React.FC<CartIconProps> = ({ 
  className, 
  showLabel = false, 
  variant = 'header' 
}) => {
  const { toggleCart, getCartCount } = useCart();
  const cartCount = getCartCount();

  const baseClasses = {
    header: 'relative flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer',
    mobile: 'relative flex flex-col items-center gap-1 p-2 text-sm cursor-pointer',
    floating: 'fixed bottom-20 right-4 z-40 bg-rebbie-600 text-white p-4 rounded-full shadow-lg hover:bg-rebbie-700 transition-all cursor-pointer'
  };

  return (
    <button
      onClick={toggleCart}
      className={clsx(baseClasses[variant], className)}
      aria-label={`Shopping cart with ${cartCount} items`}
    >
      <div className="relative">
        <ShoppingBagIcon className={clsx(
          variant === 'header' ? 'w-6 h-6' : 
          variant === 'mobile' ? 'w-5 h-5' : 
          'w-6 h-6'
        )} />
        
        {cartCount > 0 && (
          <div className={clsx(
            'absolute -top-2 -right-2 min-w-[18px] h-[18px] flex items-center justify-center rounded-full text-xs font-medium',
            variant === 'floating' 
              ? 'bg-white text-rebbie-600' 
              : 'bg-rebbie-600 text-white'
          )}>
            {cartCount > 99 ? '99+' : cartCount}
          </div>
        )}
      </div>
      
      {showLabel && (
        <span className={clsx(
          variant === 'mobile' ? 'text-xs' : 'text-sm font-medium'
        )}>
          Cart
        </span>
      )}
    </button>
  );
};

// ===============================
// MINI CART PREVIEW (HOVER COMPONENT)
// ===============================

interface MiniCartPreviewProps {
  isVisible: boolean;
  onClose: () => void;
}

export const MiniCartPreview: React.FC<MiniCartPreviewProps> = ({
  isVisible,
  onClose
}) => {
  const { state, formatPrice, getCartTotal } = useCart();
  const { items, currency } = state;

  if (!isVisible || items.length === 0) return null;

  const cartTotal = getCartTotal();
  const displayItems = items.slice(0, 3); // Show only first 3 items

  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-neutral-200 z-50">
      <div className="p-4">
        <h3 className="font-semibold text-neutral-900 mb-3">
          Recently Added ({items.length})
        </h3>
        
        <div className="space-y-3">
          {displayItems.map((item) => {
            const price = item.variant.prices?.find(p => p.currency_code === currency)?.amount || 0;
            
            return (
              <div key={item.id} className="flex items-center gap-3">
                <div className="w-12 h-12 bg-neutral-100 rounded-lg overflow-hidden">
                  {item.product.images?.[0]?.url ? (
                    <img
                      src={item.product.images[0].url}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ShoppingBagIcon className="w-4 h-4 text-neutral-400" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-neutral-900 truncate">
                    {item.product.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-neutral-600">
                    <span>Qty: {item.quantity}</span>
                    <span>•</span>
                    <span className="font-medium">{formatPrice(price, currency)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {items.length > 3 && (
          <div className="text-xs text-neutral-500 mt-2">
            +{items.length - 3} more items
          </div>
        )}
        
        <div className="border-t border-neutral-200 mt-4 pt-4">
          <div className="flex justify-between items-center mb-3">
            <span className="font-semibold text-neutral-900">Subtotal:</span>
            <span className="font-bold text-rebbie-600">{formatPrice(cartTotal, currency)}</span>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                // This would open the cart drawer
                onClose();
                // toggleCart(); // Already handled by CartIcon
              }}
              className="px-3 py-2 text-sm border border-neutral-300 rounded-lg hover:bg-neutral-50 transition-colors"
            >
              View Cart
            </button>
            <button className="px-3 py-2 text-sm bg-rebbie-600 text-white rounded-lg hover:bg-rebbie-700 transition-colors">
              Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};