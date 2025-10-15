'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Bars3Icon, 
  XMarkIcon, 
  MagnifyingGlassIcon,
  UserIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { CartIcon, MiniCartPreview } from '@/components/cart/CartIcon';
import  Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import clsx from 'clsx';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMiniCartVisible, setIsMiniCartVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navigation = [
    { name: 'Fashion Bags', href: '/products?category=bags' },
    { name: 'Jewelry', href: '/products?category=jewelry' },
    { name: 'Fragrances', href: '/products?category=fragrances' },
    { name: 'Sale', href: '/products?sale=true' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-rebbie-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-xl font-bold text-neutral-900">
                Rebbie's Store
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-neutral-700 hover:text-rebbie-600 font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Search Icon (Mobile) */}
            <button className="lg:hidden p-2 rounded-lg hover:bg-neutral-100">
              <MagnifyingGlassIcon className="w-6 h-6 text-neutral-700" />
            </button>

            {/* Account */}
            <Link 
              href="/account"
              className="hidden sm:flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <UserIcon className="w-6 h-6 text-neutral-700" />
              <span className="hidden md:block text-sm font-medium text-neutral-700">Account</span>
            </Link>

            {/* Wishlist */}
            <Link 
              href="/wishlist"
              className="hidden sm:flex items-center gap-2 p-2 rounded-lg hover:bg-neutral-100 transition-colors"
            >
              <HeartIcon className="w-6 h-6 text-neutral-700" />
              <span className="hidden md:block text-sm font-medium text-neutral-700">Wishlist</span>
            </Link>

            {/* Cart with Mini Preview */}
            <div 
              className="relative"
              onMouseEnter={() => setIsMiniCartVisible(true)}
              onMouseLeave={() => setIsMiniCartVisible(false)}
            >
              <CartIcon showLabel={false} />
              <MiniCartPreview 
                isVisible={isMiniCartVisible}
                onClose={() => setIsMiniCartVisible(false)}
              />
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-lg hover:bg-neutral-100"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Bars3Icon className="w-6 h-6 text-neutral-700" />
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="lg:hidden pb-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-0 right-0 w-full max-w-sm h-full bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-neutral-100"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="p-4 space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-2 text-neutral-700 hover:text-rebbie-600 font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="border-t border-neutral-200 pt-4 space-y-4">
                <Link
                  href="/account"
                  className="flex items-center gap-3 py-2 text-neutral-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <UserIcon className="w-6 h-6" />
                  <span>My Account</span>
                </Link>
                
                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 py-2 text-neutral-700"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <HeartIcon className="w-6 h-6" />
                  <span>Wishlist</span>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};