'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import Link from 'next/link';
import { ProductCard } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { 
  StarIcon, 
  HeartIcon, 
  ShoppingBagIcon, 
  EyeIcon,
  ArrowRightIcon,
  FunnelIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface Product {
  id: string;
  name: string;
  price: string;
  originalPrice?: string;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  badge?: string;
  isNew?: boolean;
  isSoldOut?: boolean;
  isThrift?: boolean;
  discount?: number;
}

interface FeaturedProductsProps {
  className?: string;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ className }) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [wishlistedItems, setWishlistedItems] = useState<string[]>([]);

  // Sample products data - in production, this would come from API
  const products: Product[] = [
    {
      id: '1',
      name: 'Vintage Chanel Quilted Handbag',
      price: '450,000',
      originalPrice: '580,000',
      image: '/product-1.jpg',
      category: 'Fashion Bags',
      rating: 5,
      reviews: 24,
      badge: 'Authentic',
      isThrift: true,
      discount: 22
    },
    {
      id: '2',
      name: 'Contemporary Leather Tote Bag',
      price: '85,000',
      image: '/product-2.jpg',
      category: 'Fashion Bags',
      rating: 4,
      reviews: 18,
      isNew: true
    },
    {
      id: '3',
      name: 'African Gold Necklace Set',
      price: '125,000',
      originalPrice: '150,000',
      image: '/product-3.jpg',
      category: 'Jewelry',
      rating: 5,
      reviews: 31,
      badge: 'Limited',
      discount: 17
    },
    {
      id: '4',
      name: 'Dior Sauvage Eau de Toilette',
      price: '185,000',
      image: '/product-4.jpg',
      category: 'Fragrances',
      rating: 5,
      reviews: 67,
      badge: 'Bestseller'
    },
    {
      id: '5',
      name: 'Emerald Crystal Earrings',
      price: '95,000',
      image: '/product-5.jpg',
      category: 'Jewelry',
      rating: 4,
      reviews: 12,
      isNew: true
    },
    {
      id: '6',
      name: 'Chanel No. 5 Eau de Parfum',
      price: '285,000',
      image: '/product-6.jpg',
      category: 'Fragrances',
      rating: 5,
      reviews: 89,
      badge: 'Iconic'
    },
    {
      id: '7',
      name: 'Hermès Birkin Inspired Bag',
      price: '320,000',
      originalPrice: '450,000',
      image: '/product-7.jpg',
      category: 'Fashion Bags',
      rating: 4,
      reviews: 15,
      isThrift: true,
      discount: 29
    },
    {
      id: '8',
      name: 'Victoria\'s Secret Body Mist',
      price: '15,000',
      image: '/product-8.jpg',
      category: 'Fragrances',
      rating: 4,
      reviews: 43,
      badge: 'Popular'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Products', count: products.length },
    { id: 'fashion-bags', name: 'Fashion Bags', count: products.filter(p => p.category === 'Fashion Bags').length },
    { id: 'jewelry', name: 'Jewelry', count: products.filter(p => p.category === 'Jewelry').length },
    { id: 'fragrances', name: 'Fragrances', count: products.filter(p => p.category === 'Fragrances').length },
    { id: 'thrift', name: 'Thrift Items', count: products.filter(p => p.isThrift).length },
  ];

  // Filter products based on active filter
  const filteredProducts = products.filter(product => {
    switch (activeFilter) {
      case 'fashion-bags':
        return product.category === 'Fashion Bags';
      case 'jewelry':
        return product.category === 'Jewelry';
      case 'fragrances':
        return product.category === 'Fragrances';
      case 'thrift':
        return product.isThrift;
      default:
        return true;
    }
  });

  const handleWishlistToggle = (productId: string) => {
    setWishlistedItems(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <section className={clsx('py-20 bg-neutral-50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-rebbie-100 text-rebbie-800 text-sm font-medium px-4 py-2 rounded-full mb-4">
            <StarIcon className="w-4 h-4" />
            Featured Products
          </div>
          
          <h2 className="text-display-md font-bold text-neutral-900 mb-4">
            Discover Our <span className="text-rebbie-600">Best Sellers</span>
          </h2>
          
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Handpicked collection of premium fashion bags, stunning jewelry, and luxury fragrances 
            loved by thousands of Nigerians
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={clsx(
                'px-6 py-3 rounded-full font-medium transition-all duration-200',
                'flex items-center gap-2',
                activeFilter === category.id
                  ? 'bg-rebbie-600 text-white shadow-rebbie-sm'
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              )}
            >
              {category.name}
              <span className={clsx(
                'text-xs px-2 py-0.5 rounded-full',
                activeFilter === category.id
                  ? 'bg-white/20 text-white'
                  : 'bg-neutral-200 text-neutral-500'
              )}>
                {category.count}
              </span>
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredProducts.slice(0, 8).map((product, index) => (
            <div
              key={product.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-product-hover transition-all duration-300 hover:-translate-y-1">
                
                {/* Product Image */}
                <div className="aspect-square bg-neutral-100 relative overflow-hidden">
                  {/* Placeholder Image */}
                  <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
                    <div className="text-center text-neutral-400">
                      <div className="text-4xl mb-2">
                        {product.category === 'Fashion Bags' ? '👜' : 
                         product.category === 'Jewelry' ? '💎' : '🌸'}
                      </div>
                      <div className="text-xs">{product.category}</div>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {product.badge && (
                      <span className={clsx(
                        'text-xs font-medium px-2 py-1 rounded-full',
                        product.badge === 'Authentic' && 'bg-green-500 text-white',
                        product.badge === 'Limited' && 'bg-accent-gold text-white',
                        product.badge === 'Bestseller' && 'bg-rebbie-600 text-white',
                        product.badge === 'Iconic' && 'bg-neutral-900 text-white',
                        product.badge === 'Popular' && 'bg-blue-500 text-white'
                      )}>
                        {product.badge}
                      </span>
                    )}
                    
                    {product.isNew && (
                      <span className="bg-accent-coral text-white text-xs font-medium px-2 py-1 rounded-full">
                        New
                      </span>
                    )}
                    
                    {product.isThrift && (
                      <span className="bg-emerald-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        ♻️ Thrift
                      </span>
                    )}
                    
                    {product.discount && (
                      <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded-full">
                        -{product.discount}%
                      </span>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <button
                      onClick={() => handleWishlistToggle(product.id)}
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-neutral-50 transition-colors"
                    >
                      {wishlistedItems.includes(product.id) ? (
                        <HeartSolidIcon className="w-4 h-4 text-red-500" />
                      ) : (
                        <HeartIcon className="w-4 h-4 text-neutral-600" />
                      )}
                    </button>

                    <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-neutral-50 transition-colors">
                      <EyeIcon className="w-4 h-4 text-neutral-600" />
                    </button>
                  </div>

                  {/* Add to Cart Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button className="w-full bg-rebbie-600 text-white py-3 px-4 font-medium hover:bg-rebbie-700 transition-colors flex items-center justify-center gap-2">
                      <ShoppingBagIcon className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>

                  {/* Out of Stock Overlay */}
                  {product.isSoldOut && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="bg-white text-neutral-900 font-medium px-4 py-2 rounded-full">
                        Sold Out
                      </span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="text-xs text-rebbie-600 font-medium mb-1 uppercase tracking-wide">
                    {product.category}
                  </div>
                  
                  <h3 className="font-semibold text-neutral-900 line-clamp-2 mb-2 group-hover:text-rebbie-600 transition-colors">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={clsx(
                            'w-3 h-3',
                            i < product.rating ? 'fill-current' : 'text-neutral-300'
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-neutral-500">({product.reviews})</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-neutral-900 price-naira">
                        {product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-neutral-500 line-through price-naira">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Quick Add Button */}
                    <button className="w-8 h-8 bg-rebbie-100 text-rebbie-600 rounded-full flex items-center justify-center hover:bg-rebbie-600 hover:text-white transition-colors">
                      <ShoppingBagIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More / View All */}
        <div className="text-center">
          <Link href="/products">
            <Button
              size="lg"
              variant="outline"
              rightIcon={<ArrowRightIcon className="w-5 h-5" />}
              className="group"
            >
              View All Products
              <span className="ml-2 text-sm text-neutral-500">
                ({products.length} items)
              </span>
            </Button>
          </Link>
        </div>

        {/* Stats Banner */}
        <div className="mt-20 bg-gradient-primary rounded-3xl p-8 lg:p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">500+</div>
              <div className="text-rebbie-100">Premium Products</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">10K+</div>
              <div className="text-rebbie-100">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">36</div>
              <div className="text-rebbie-100">States Delivered</div>
            </div>
            <div>
              <div className="text-3xl lg:text-4xl font-bold mb-2">4.9⭐</div>
              <div className="text-rebbie-100">Customer Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;