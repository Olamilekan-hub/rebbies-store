'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';
import { CartIcon } from './CartIcon';

export const FloatingCartButton: React.FC = () => {
  const { getCartCount } = useCart();
  const cartCount = getCartCount();

  // Only show if there are items in cart and on mobile
  if (cartCount === 0) return null;

  return (
    <div className="md:hidden">
      <CartIcon variant="floating" />
    </div>
  );
};