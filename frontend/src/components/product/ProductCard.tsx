'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HeartIcon, ShoppingBagIcon, EyeIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { RebbieProduct, RebbieProductVariant } from '@/lib/types';
import { formatPrice } from '@/lib/medusa';
import { useCartOperations } from '@/hooks/useCart';

interface ProductCardProps {
  product: RebbieProduct;
  className?: string;
  showQuickView?: boolean;
  showWishlist?: boolean;
  onQuickView?: (product: RebbieProduct) => void;
  onWishlistToggle?: (product: RebbieProduct) => void;
  isWishlisted?: boolean;
  currency?: string;
}

export default function ProductCard({
  product,
  className = '',
  showQuickView = true,
  showWishlist = true,
  onQuickView,
  onWishlistToggle,
  isWishlisted = false,
  currency = 'NGN',
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [wishlisted, setWishlisted] = useState(isWishlisted);

  const { quickAddToCart, loading: addingToCart } = useCartOperations();

  // Get primary variant and pricing
  const primaryVariant = product.variants?.[0];
  const hasVariants = product.variants && product.variants.length > 0;
  
  // Get price from variant
  const getPrice = () => {
    if (!primaryVariant?.prices) return 0;
    
    const price = primaryVariant.prices.find(p => 
      p.currency_code?.toLowerCase() === currency.toLowerCase()
    );
    
    return price?.amount || 0;
  };

  const price = getPrice();
  const formattedPrice = formatPrice(price, currency);

  // Get product images
  const primaryImage = product.images?.[0]?.url;
  const secondaryImage = product.images?.[1]?.url;

  // Handle add to cart
  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!primaryVariant) {
      alert('Please select a variant first');
      return;
    }

    const success = await quickAddToCart(primaryVariant as RebbieProductVariant);
    if (success) {
      // Show success notification
      const event = new CustomEvent('showToast', {
        detail: {
          type: 'success',
          message: `${product.title} added to cart!`,
        },
      });
      window.dispatchEvent(event);
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setWishlisted(!wishlisted);
    onWishlistToggle?.(product);

    // Show notification
    const event = new CustomEvent('showToast', {
      detail: {
        type: 'info',
        message: wishlisted 
          ? `${product.title} removed from wishlist` 
          : `${product.title} added to wishlist`,
      },
    });
    window.dispatchEvent(event);
  };

  // Handle quick view
  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  return (
    <div
      className={`product-card group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/products/${product.handle}`}>
        {/* Product Image */}
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          {/* Primary Image */}
          {primaryImage && !imageError ? (
            <Image
              src={primaryImage}
              alt={product.title || 'Product image'}
              fill
              className={`object-cover transition-transform duration-500 group-hover:scale-105 ${
                imageLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setImageLoading(false)}
              onError={() => setImageError(true)}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            // Fallback placeholder
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <div className="text-center text-gray-400">
                <div className="text-4xl mb-2">📦</div>
                <div className="text-sm">No Image</div>
              </div>
            </div>
          )}

          {/* Secondary Image (hover effect) */}
          {secondaryImage && isHovered && !imageError && (
            <Image
              src={secondaryImage}
              alt={`${product.title} - alternate view`}
              fill
              className="object-cover transition-opacity duration-300 opacity-100"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}

          {/* Loading Overlay */}
          {imageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}

          {/* Product Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.is_thrift && (
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                Thrift
              </span>
            )}
            {product.condition && product.condition !== 'New' && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                {product.condition}
              </span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {showWishlist && (
              <button
                onClick={handleWishlistToggle}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                {wishlisted ? (
                  <HeartSolidIcon className="w-4 h-4 text-red-500" />
                ) : (
                  <HeartIcon className="w-4 h-4 text-gray-600" />
                )}
              </button>
            )}

            {showQuickView && (
              <button
                onClick={handleQuickView}
                className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-50 transition-colors"
                aria-label="Quick view"
              >
                <EyeIcon className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>

          {/* Quick Add to Cart (bottom overlay) */}
          <div className={`absolute bottom-0 left-0 right-0 transform transition-transform duration-300 ${
            isHovered ? 'translate-y-0' : 'translate-y-full'
          }`}>
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || !hasVariants}
              className="w-full bg-rebbie-purple-600 text-white py-3 px-4 font-medium hover:bg-rebbie-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {addingToCart ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingBagIcon className="w-4 h-4" />
                  Add to Cart
                </>
              )}
            </button>
          </div>
        </div>

        {/* Product Information */}
        <div className="p-4">
          {/* Category */}
          {product.category_names && product.category_names.length > 0 && (
            <p className="text-xs text-rebbie-purple-600 font-medium mb-1 uppercase tracking-wide">
              {product.category_names[0]}
            </p>
          )}

          {/* Product Title */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-rebbie-purple-600 transition-colors">
            {product.title}
          </h3>

          {/* Product Description */}
          {product.description && (
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {product.description}
            </p>
          )}

          {/* Pricing */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-gray-900">
                {formattedPrice}
              </span>
              
              {/* Multiple variants pricing indicator */}
              {hasVariants && product.variants!.length > 1 && (
                <span className="text-xs text-gray-500">
                  {product.variants!.length} options
                </span>
              )}
            </div>

            {/* Rating (placeholder for future) */}
            <div className="flex items-center gap-1">
              <div className="flex text-yellow-400">
                <span className="text-sm">⭐⭐⭐⭐⭐</span>
              </div>
              <span className="text-xs text-gray-500">(12)</span>
            </div>
          </div>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map(tag => (
                <span
                  key={tag.id}
                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full"
                >
                  {tag.value}
                </span>
              ))}
              {product.tags.length > 3 && (
                <span className="text-xs text-gray-500">
                  +{product.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Nigerian Shipping Info */}
          <div className="mt-3 flex items-center gap-2 text-xs text-green-600">
            <span>🚚</span>
            <span>Lagos same-day delivery</span>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ===============================
// PRODUCT CARD SKELETON
// ===============================

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md animate-pulse">
      {/* Image Skeleton */}
      <div className="aspect-square bg-gray-200" />
      
      {/* Content Skeleton */}
      <div className="p-4">
        <div className="h-3 bg-gray-200 rounded w-1/3 mb-2" />
        <div className="h-5 bg-gray-200 rounded w-full mb-2" />
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-3" />
        <div className="flex justify-between items-center">
          <div className="h-6 bg-gray-200 rounded w-1/4" />
          <div className="h-4 bg-gray-200 rounded w-1/3" />
        </div>
        <div className="mt-3 h-3 bg-gray-200 rounded w-1/2" />
      </div>
    </div>
  );
};

// ===============================
// PRODUCT GRID COMPONENT
// ===============================

interface ProductGridProps {
  products: RebbieProduct[];
  loading?: boolean;
  className?: string;
  onProductQuickView?: (product: RebbieProduct) => void;
  onWishlistToggle?: (product: RebbieProduct) => void;
  wishlistedProducts?: string[];
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading = false,
  className = '',
  onProductQuickView,
  onWishlistToggle,
  wishlistedProducts = [],
}) => {
  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🛍️</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No Products Found</h3>
        <p className="text-gray-600">Try adjusting your search or filter criteria</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {products.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onQuickView={onProductQuickView}
          onWishlistToggle={onWishlistToggle}
          isWishlisted={wishlistedProducts.includes(product.id)}
        />
      ))}
    </div>
  );
};