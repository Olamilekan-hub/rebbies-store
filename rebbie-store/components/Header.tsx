"use client";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import HeaderTop from "./HeaderTop";
import Link from "next/link";
import { FaBell, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { LuShoppingCart } from "react-icons/lu";
import { IoHeart } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import ThemeToggle from "./ThemeToggle";
import CustomButton from "./CustomButton";
import { signOut, useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { useWishlistStore } from "@/app/_zustand/wishlistStore";
import { useProductStore } from "@/app/_zustand/store";
import apiClient from "@/lib/api";

const Header = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { wishlist, setWishlist, wishQuantity } = useWishlistStore();
  const { allQuantity } = useProductStore();
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLogout = () => {
    setTimeout(() => signOut(), 1000);
    toast.success("Logout successful!");
  };

  // Get user initials for avatar
  const getUserInitials = (name: string) => {
    if (!name) return "U";
    const names = name.split(" ");
    if (names.length >= 2) {
      return (names[0].charAt(0) + names[1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // getting all wishlist items by user id
  const getWishlistByUserId = async (id: string) => {
    const response = await apiClient.get(`/api/wishlist/${id}`, {
      cache: "no-store",
    });
    const wishlist = await response.json();
    const productArray: {
      id: string;
      title: string;
      price: number;
      image: string;
      slug: string
      stockAvailabillity: number;
    }[] = [];

    wishlist.map((item: any) => productArray.push({ id: item?.product?.id, title: item?.product?.title, price: item?.product?.price, image: item?.product?.mainImage, slug: item?.product?.slug, stockAvailabillity: item?.product?.inStock }));

    setWishlist(productArray);
  };

  // getting user by email so I can get his user id
  const getUserByEmail = async () => {
    if (session?.user?.email) {

      apiClient.get(`/api/users/email/${session?.user?.email}`, {
        cache: "no-store",
      })
        .then((response) => response.json())
        .then((data) => {
          getWishlistByUserId(data?.id);
        });
    }
  };

  useEffect(() => {
    getUserByEmail();
  }, [session?.user?.email, wishlist.length]);

  return (
    <>
      <HeaderTop />
      <header className={`sticky z-50 transition-all duration-300 ${isScrolled ? 'top-0 bg-[#7c3aed]/80 dark:bg-black/80 backdrop-blur-md shadow-lg' : 'top-10 bg-[#7c3aed] dark:bg-black'}`}>
        {pathname.startsWith("/admin") === false && (
          <div className="flex items-center justify-between px-6 py-4 mx-auto lg:px-16 max-w-screen-2xl">
            {/* Left - Logo and Navigation */}
            <div className="flex items-center gap-8">
              <Link href="/" className="transition-transform duration-300 hover:scale-105">
                <h1 className="text-xl font-bold text-transparent bg-gradient-to-r from-white via-white/80 to-white/60 bg-clip-text">
                  Rebbie Vault
                </h1>
              </Link>

              {/* Navigation Menu */}
              <nav className="items-center hidden gap-8 text-sm font-bold md:flex">
                <Link href="/" className="text-white transition-all duration-300 hover:text-white/70 hover:scale-105">
                  Home
                </Link>
                <Link href="/shop" className="text-white duration-300 ransition-all hover:text-white/70 hover:scale-105">
                  Products
                </Link>
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {/* Notification Icons */}
              <div className="flex items-center gap-3">
                <Link href="/cart">
                  <div className="relative p-2 text-white transition-all duration-300 border border-white rounded-full cursor-pointer realtive hover:scale-105">
                    <LuShoppingCart className="w-4 h-4" />
                    {allQuantity > 0 && (
                      <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full -top-2 -right-2 bg-gradient-to-r from-primary-600 to-primary-800 animate-pulse">
                        {allQuantity}
                      </span>
                    )}
                  </div>
                </Link>
                {session ? (
                  <>
                    <Link href="/wishlist">
                      <div className="relative text-white transition-all duration-300 cursor-pointer realtive hover:scale-105 ">
                        <IoHeart className="w-5 h-5" />
                        {wishQuantity > 0 && (
                          <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full -top-2 -right-2 bg-gradient-to-r from-primary-600 to-primary-800 animate-pulse">
                            {wishQuantity}
                          </span>
                        )}
                      </div>
                    </Link>
                    <div className="relative text-white transition-all duration-300 cursor-pointer realtive hover:scale-105 ">
                      <IoMdNotificationsOutline className="w-5 h-5" />
                      <span className="absolute w-3 h-3 bg-red-500 rounded-full -top-1 -right-1 animate-pulse"></span>
                    </div>
                  </>
                ) : (
                  <></>
                )}
              </div>

              {/* Auth Buttons or User Profile */}
              {session ? (
                <div className="relative group">
                  <button className="flex items-center justify-center w-6 h-6 font-semibold text-white transition-all duration-300 border border-white rounded-full border-1 hover:shadow-lg hover:shadow-primary-500/25 hover:scale-110 dark:border-0 dark:bg-gradient-to-r from-primary-600 to-primary-800">
                    {getUserInitials(session.user?.name || "")}
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 invisible transition-all duration-300 transform translate-y-2 border shadow-xl opacity-0 w-52 bg-white/95 backdrop-blur-md border-gray-200/20 top-14 dark:bg-gray-800/95 rounded-xl dark:border-gray-700/20 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0">
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="font-medium text-black truncate dark:text-white">{session.user?.name}</p>
                      <p className="text-sm text-gray-500 truncate dark:text-gray-400">{session.user?.email}</p>
                    </div>
                    <div className="p-1">
                      <Link
                        href="/account"
                        className="flex items-center gap-3 px-3 py-3 text-gray-700 transition-all duration-300 rounded-lg dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400"
                      >
                        <FaUser className="w-5 h-5" />
                        My Account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full gap-3 px-3 py-3 text-red-600 transition-all duration-300 rounded-lg dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-105"
                      >
                        <FaSignOutAlt className="w-5 h-5" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login">
                    <CustomButton
                      text="Log in"
                      variant="outline"
                      paddingX={4}
                      paddingY={2}
                      textSize="xs"
                      textColor="white"
                    />
                  </Link>
                  <Link href="/register">
                    <CustomButton
                      text="Sign up"
                      variant="secondary"
                      paddingX={4}
                      paddingY={2}
                      textSize="xs"
                    />
                  </Link>
                </div>
              )}

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </div>
        )}

        {/* Admin Header */}
        {pathname.startsWith("/admin") === true && (
          <div className="flex items-center justify-between px-6 py-4 mx-auto lg:px-16 max-w-screen-2xl">
            <Link href="/" className="px-3 py-2 transition-transform duration-300 bg-white shadow-lg hover:scale-105 dark:bg-black rounded-xl shadow-black/50 hover:shadow-black-500/70 dark:shadow-white/10 dark:hover:shadow-white-500/20">
              <h1 className="text-xl font-bold text-transparent bg-gradient-to-r from-primary-500 via-primary-500/80 to-primary-500/60 bg-clip-text">
                Rebbie Vault
              </h1>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/cart">
                <div className="relative p-2 text-white transition-all duration-300 border border-white rounded-full cursor-pointer realtive hover:scale-105">
                  <LuShoppingCart className="w-4 h-4" />
                  {allQuantity > 0 && (
                    <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full -top-2 -right-2 bg-gradient-to-r from-primary-600 to-primary-800 animate-pulse">
                      {allQuantity}
                    </span>
                  )}
                </div>
              </Link>
              <Link href="/wishlist">
                <div className="relative text-white transition-all duration-300 cursor-pointer realtive hover:scale-105 ">
                  <IoHeart className="w-5 h-5" />
                  {wishQuantity > 0 && (
                    <span className="absolute flex items-center justify-center w-5 h-5 text-xs font-bold text-white rounded-full -top-2 -right-2 bg-gradient-to-r from-primary-600 to-primary-800 animate-pulse">
                      {wishQuantity}
                    </span>
                  )}
                </div>
              </Link>
              <div className="relative text-white transition-all duration-300 cursor-pointer realtive hover:scale-105 ">
                <IoMdNotificationsOutline className="w-5 h-5" />
                <span className="absolute w-3 h-3 bg-red-500 rounded-full -top-1 -right-1 animate-pulse"></span>
              </div>

              {/* Admin Profile */}
              <div className="relative group">
                <button className="flex items-center justify-center w-8 h-8 text-sm font-semibold text-white transition-all duration-300 border border-white rounded-full dark:border-0 dark:bg-gradient-to-r from-primary-600 to-primary-800 hover:shadow-lg hover:shadow-primary-500/25 hover:scale-110">
                  {getUserInitials(session?.user?.name || "A")}
                </button>

                <div className="absolute right-0 invisible transition-all duration-300 border shadow-xl opacity-0 w-52 bg-white/95 backdrop-blur-md border-gray-200/20 top-14 dark:bg-gray-800/95 rounded-xl dark:border-gray-700/20 group-hover:opacity-100 group-hover:visible">
                  <div className="p-1">
                    <Link href="/admin" className="flex items-center gap-3 px-3 py-3 text-gray-700 transition-all duration-300 rounded-lg dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400">
                      Dashboard
                    </Link>
                    <Link href="/admin/profile" className="flex items-center gap-3 px-3 py-3 text-gray-700 transition-all duration-300 rounded-lg dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400">
                      Profile
                    </Link>
                    <button onClick={handleLogout} className="flex items-center w-full gap-3 px-3 py-3 text-red-600 transition-all duration-300 rounded-lg dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-105">
                      Logout
                    </button>
                  </div>
                </div>
              </div>

              <ThemeToggle />
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
