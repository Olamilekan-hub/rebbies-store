
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShoppingBagIcon, MagnifyingGlassIcon, UserIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = [
    {
      name: 'Fashion Bags',
      href: '/products/category/fashion-bags',
      subcategories: [
        { name: 'Thrift Fashion Bags', href: '/products/category/thrift-fashion-bags' },
        { name: 'Non-Thrift Fashion Bags', href: '/products/category/non-thrift-fashion-bags' },
      ],
    },
    {
      name: 'Jewelry',
      href: '/products/category/jewelry',
      subcategories: [
        { name: 'Necklaces', href: '/products/category/necklaces' },
        { name: 'Earrings', href: '/products/category/earrings' },
        { name: 'Rings', href: '/products/category/rings' },
        { name: 'Bracelets', href: '/products/category/bracelets' },
        { name: 'African Jewelry', href: '/products/category/african-jewelry' },
      ],
    },
    {
      name: 'Fragrances',
      href: '/products/category/fragrances',
      subcategories: [
        { name: "Men's Fragrances", href: '/products/category/mens-fragrances' },
        { name: "Women's Fragrances", href: '/products/category/womens-fragrances' },
      ],
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-rebbie-purple-600 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="hidden md:block">
              📞 Call us: +234-806-577-6378 | 📧 contact@rebbies-store.com
            </div>
            <div className="flex items-center space-x-4">
              <span>Free shipping on orders over ₦50,000</span>
              <div className="hidden sm:flex items-center space-x-2">
                <span>NGN</span>
                <span>|</span>
                <span>USD</span>
                <span>|</span>
                <span>EUR</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold">
              <span className="text-rebbie-purple-600">Rebbie's</span>
              <span className="text-black ml-1">Store</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-rebbie-purple-600 transition-colors">
              Home
            </Link>
            {categories.map((category) => (
              <div key={category.name} className="relative group">
                <Link
                  href={category.href}
                  className="text-gray-700 hover:text-rebbie-purple-600 transition-colors flex items-center"
                >
                  {category.name}
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </Link>
                
                {/* Dropdown Menu */}
                <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 border border-gray-100">
                  <div className="py-2">
                    {category.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory.name}
                        href={subcategory.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-rebbie-purple-50 hover:text-rebbie-purple-600 transition-colors"
                      >
                        {subcategory.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search for bags, jewelry, fragrances..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rebbie-purple-500 focus:border-transparent"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Account */}
            <Link href="/account" className="text-gray-700 hover:text-rebbie-purple-600 transition-colors">
              <UserIcon className="h-6 w-6" />
            </Link>

            {/* Cart */}
            <Link href="/cart" className="text-gray-700 hover:text-rebbie-purple-600 transition-colors relative">
              <ShoppingBagIcon className="h-6 w-6" />
              <span className="absolute -top-2 -right-2 bg-rebbie-purple-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-rebbie-purple-600 transition-colors"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-4 space-y-4">
            {/* Mobile Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rebbie-purple-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Mobile Navigation */}
            <nav className="space-y-3">
              <Link href="/" className="block text-gray-700 hover:text-rebbie-purple-600 transition-colors">
                Home
              </Link>
              {categories.map((category) => (
                <div key={category.name}>
                  <Link href={category.href} className="block text-gray-700 hover:text-rebbie-purple-600 transition-colors font-medium">
                    {category.name}
                  </Link>
                  <div className="ml-4 mt-2 space-y-2">
                    {category.subcategories.map((subcategory) => (
                      <Link
                        key={subcategory.name}
                        href={subcategory.href}
                        className="block text-sm text-gray-600 hover:text-rebbie-purple-600 transition-colors"
                      >
                        {subcategory.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}