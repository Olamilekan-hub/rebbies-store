'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Bars3Icon, 
  XMarkIcon, 
  UserIcon,
  HeartIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';
import { CartIcon, MiniCartPreview } from '@/components/cart/CartIcon';
import clsx from 'clsx';
import { useAuth } from '@/context/AuthContext'; // ✅ import

export const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const isLoggedIn = !!user; 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMiniCartVisible, setIsMiniCartVisible] = useState(false);
  const [isAccountDropdownOpen, setIsAccountDropdownOpen] = useState(false);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAccountDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Get user's first initial for avatar
  const getUserInitial = () => {
    if (user?.first_name) {
      return user.first_name.charAt(0).toUpperCase();
    }
    return 'U'; // fallback
  };

  const navigation = [
    { name: 'Home', href: '/', showUnderline: true },
    { name: 'Men', href: '/products?category=men', showUnderline: false },
    { name: 'Women', href: '/products?category=women', showUnderline: false },
    { name: 'Shop Now', href: '/products', isButton: true, showUnderline: true },
  ];

  const isCurrentPage = (href: string, showUnderline: boolean = true) => {
    // Only show underline for items that should have it
    if (!showUnderline) return false;
    
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname?.startsWith(href.split('?')[0])) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-rebbie-300">
      {/* Top Bar */}
      <div className="text-white bg-rebbie-950">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-12">
            {/* Left side - empty as requested */}
            <div className="flex-1">              
                <div className="flex items-center gap-3 md:gap-5">
                  <Link 
                    href="/delivery"
                    className="text-xs font-medium text-white transition-colors md:text-sm hover:text-neutral-200"
                  >
                    Delivery
                  </Link>
                  <Link 
                    href="/contact"
                    className="text-xs font-medium text-white transition-colors md:text-sm hover:text-neutral-200"
                  >
                    Contact
                  </Link>
                  <Link 
                    href="/about"
                    className="text-xs font-medium text-white transition-colors md:text-sm hover:text-neutral-200"
                  >
                    About us
                  </Link>
                </div>
            </div>
            
            {/* Right side - Cart and Auth */}
            <div className="flex items-center gap-2 md:gap-5">
              {/* Cart with Mini Preview */}
              <div 
                className="relative flex items-center"
                onMouseEnter={() => setIsMiniCartVisible(true)}
                onMouseLeave={() => setIsMiniCartVisible(false)}
              >
                <CartIcon showLabel={true} className="text-white hover:bg-rebbie-300 hover:text-neutral-200" />
                <MiniCartPreview 
                  isVisible={isMiniCartVisible}
                  onClose={() => setIsMiniCartVisible(false)}
                />
              </div>

              {/* Auth Section */}
              {isLoggedIn ? (
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setIsAccountDropdownOpen(!isAccountDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1 transition-colors rounded-full hover:bg-neutral-700"
                  >
                    {/* User Avatar */}
                    <div className="flex items-center justify-center w-6 h-6 text-xs font-semibold text-white rounded-full bg-rebbie-600">
                      {getUserInitial()}
                    </div>
                    <span className="hidden text-xs font-medium md:block md:text-sm">Account</span>
                    <ChevronDownIcon className={clsx(
                      "w-3 h-3 transition-transform duration-200",
                      isAccountDropdownOpen ? "rotate-180" : ""
                    )} />
                  </button>

                  {/* Dropdown Menu */}
                  {isAccountDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-neutral-200 py-1 z-50">
                      <Link 
                        href="/account"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors"
                        onClick={() => setIsAccountDropdownOpen(false)}
                      >
                        <UserIcon className="w-4 h-4" />
                        Profile
                      </Link>
                      <button
                        onClick={async () => {
                          await logout();
                          setIsAccountDropdownOpen(false);
                        }}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors text-left"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center hidden gap-2 md:flex">
                  <Link 
                    href="/login"
                    className="h-12 px-2 py-1 text-xs font-medium transition-colors md:py-4 md:px-6 md:text-sm hover:text-neutral-200 border-x-2 border-rebbie-300"
                  >
                    Login
                  </Link>
                  <Link 
                    href="/register"
                    className="px-3 py-1 text-xs font-medium text-white transition-colors rounded-full md:text-sm bg-rebbie-800 hover:bg-rebbie-700"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="border-b border-white shadow-sm bg-rebbie-300">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center gap-2">
                {/* Commented out logo for future use */}
                {/* <div className="flex items-center justify-center w-8 h-8 rounded-full bg-rebbie-600">
                  <span className="text-sm font-bold text-white">R</span>
                </div> */}
                <span className="text-2xl font-bold text-neutral-900">
                  Rebbie's Store
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="items-center hidden space-x-12 md:flex">
              {navigation.map((item) => {
                const isCurrent = isCurrentPage(item.href, item.showUnderline);
                
                if (item.isButton) {
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={clsx(
                        'px-3 py-1 rounded-full font-semibold transition-all duration-200',
                        isCurrent
                          ? 'text-rebbie-600 border-b-2 border-rebbie-600 bg-transparent rounded-none'
                          : 'text-white bg-rebbie-600 hover:bg-rebbie-700 hover:shadow-md'
                      )}
                    >
                      {item.name}
                    </Link>
                  );
                }

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      'py-2 font-semibold transition-all duration-200 relative',
                      isCurrent
                        ? 'text-rebbie-600 border-b-2 border-rebbie-600'
                        : 'text-neutral-700 hover:text-rebbie-600'
                    )}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="p-2 transition-colors rounded-full md:hidden hover:bg-neutral-200"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Bars3Icon className="w-6 h-6 text-neutral-700" />
            </button>
          </div>
        </div>
      </div>

      {/* White separator line */}
      {/* <div className="h-px bg-rebbie-800"></div> */}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-rebbie-300">
          <div className="fixed inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="fixed top-0 right-0 w-full h-full max-w-sm shadow-xl bg-rebbie-300">
            <div className="flex items-center justify-between p-4 border-b border-neutral-200">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-full hover:bg-neutral-100"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>
            
            <nav className="p-4 space-y-4">
              {navigation.map((item) => {
                const isCurrent = isCurrentPage(item.href, item.showUnderline);
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={clsx(
                      'block py-3 px-4 rounded-full font-semibold transition-colors',
                      item.isButton
                        ? isCurrent
                          ? 'text-rebbie-600 bg-rebbie-50 border-l-4 border-rebbie-600'
                          : 'text-white bg-rebbie-600'
                        : isCurrent
                        ? 'text-rebbie-600 bg-rebbie-50 border-l-4 border-rebbie-600'
                        : 'text-neutral-700 hover:text-rebbie-600 hover:bg-neutral-50'
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                );
              })}
              
              <div className="pt-4 space-y-4 border-t border-neutral-200">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-3 py-2 text-neutral-600">
                      <div className="flex items-center justify-center w-8 h-8 text-sm font-semibold text-white rounded-full bg-rebbie-600">
                        {getUserInitial()}
                      </div>
                      <span className="font-medium">
                        {user?.first_name} {user?.last_name}
                      </span>
                    </div>
                    <Link
                      href="/account"
                      className="flex items-center gap-3 py-2 text-neutral-700 hover:text-rebbie-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <UserIcon className="w-6 h-6" />
                      <span>My Profile</span>
                    </Link>
                    <button
                      onClick={async () => {
                        await logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 py-2 text-neutral-700 hover:text-rebbie-600 w-full text-left"
                    >
                      <ArrowRightOnRectangleIcon className="w-6 h-6" />
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-center border rounded-full text-neutral-700 border-neutral-300 hover:bg-neutral-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      className="block px-4 py-2 text-center text-white rounded-full bg-rebbie-600 hover:bg-rebbie-700"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                )}
                
                <Link
                  href="/wishlist"
                  className="flex items-center gap-3 py-2 text-neutral-700 hover:text-rebbie-600"
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

export default Header;