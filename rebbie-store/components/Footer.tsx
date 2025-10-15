import React from "react";
import Link from "next/link";
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  const shopLinks = [
    { name: "All Products", href: "/products" },
    { name: "Hair Products", href: "/products?category=hair" },
    { name: "Jewelry", href: "/products?category=jewelry" },
    { name: "Accessories", href: "/products?category=accessories" },
    { name: "New Arrivals", href: "/products?filter=new" },
  ];

  const supportLinks = [
    { name: "Help Center", href: "/help" },
    { name: "Shipping & Returns", href: "/shipping" },
    { name: "Size Guide", href: "/size-guide" },
    { name: "Contact Us", href: "/contact" },
    { name: "Track Order", href: "/track" },
  ];

  return (
    <footer className="bg-black dark:bg-black text-white transition-colors duration-300 border-t border-white/70">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Footer Content */}
        <div className="flex justify-between items-center gap-8">
          {/* Company Section */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
            <h2 className="text-3xl font-bold text-transparent bg-gradient-to-r from-white via-white/80 to-white/60 bg-clip-text">
                Rebbie Vault
              </h2>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Your one-stop shop for everything tech. Premium products at competitive prices, with fast shipping and exceptional customer service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaFacebookF className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                <FaLinkedinIn className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Shop Section */}
          <div>
            <h3 className="text-white font-semibold mb-4">Shop</h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Section */}
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Rebbie Vault. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/legal" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                Legal Information
              </Link>
              <Link href="/account" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                My Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
