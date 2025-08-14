'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { clsx } from 'clsx';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { useProduct, useProductRecommendations } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { toast } from '@/components/ui/Toast';
import { formatPrice } from '@/lib/medusa';
import { RebbieProductVariant } from '@/lib/types';
import {
  HeartIcon,
  ShareIcon,
  StarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassPlusIcon,
  TruckIcon,
  ShieldCheckIcon,
  CheckIcon,
  ClockIcon,
  PhoneIcon,
  CreditCardIcon,
  ArrowLeftIcon,
  PlusIcon,
  MinusIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

// ===============================
// PRODUCT IMAGE GALLERY
// ===============================

interface ProductGalleryProps {
  images: Array<{ url: string; alt?: string }>;
  productTitle: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, productTitle }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const nextImage = () => {
    setSelectedImage((prev) => (prev + 1) % images.length);
    setImageLoading(true);
  };

  const prevImage = () => {
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    setImageLoading(true);
  };

  if (!images || images.length === 0) {
    return (
      <div className="aspect-square bg-neutral-100 rounded-2xl flex items-center justify-center">
        <div className="text-center text-neutral-400">
          <div className="text-8xl mb-4">📦</div>
          <p className="text-lg">No Images Available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative">
        <div className="aspect-square bg-neutral-100 rounded-2xl overflow-hidden group relative">
          <Image
            src={images[selectedImage].url}
            alt={images[selectedImage].alt || productTitle}
            fill
            className={clsx(
              'object-cover transition-all duration-500',
              imageLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100',
              'hover:scale-110 cursor-zoom-in'
            )}
            onLoad={() => setImageLoading(false)}
            onClick={() => setIsZoomed(true)}
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
          />

          {/* Loading overlay */}
          {imageLoading && (
            <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
          )}

          {/* Navigation arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-lg"
              >
                <ChevronLeftIcon className="w-6 h-6 text-neutral-700" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white shadow-lg"
              >
                <ChevronRightIcon className="w-6 h-6 text-neutral-700" />
              </button>
            </>
          )}

          {/* Zoom indicator */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 text-sm text-neutral-700">
              <MagnifyingGlassPlusIcon className="w-4 h-4" />
              Click to zoom
            </div>
          </div>
        </div>
      </div>

      {/* Thumbnail Images */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-3">
          {images.slice(0, 4).map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setSelectedImage(index);
                setImageLoading(true);
              }}
              className={clsx(
                'aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105',
                index === selectedImage ? 'border-rebbie-600' : 'border-neutral-200'
              )}
            >
              <Image
                src={image.url}
                alt={`${productTitle} - view ${index + 1}`}
                width={100}
                height={100}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Image Modal */}
      {isZoomed && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <Image
              src={images[selectedImage].url}
              alt={images[selectedImage].alt || productTitle}
              width={800}
              height={800}
              className="max-w-full max-h-full object-contain"
            />
            <button
              onClick={() => setIsZoomed(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-neutral-100"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ===============================
// VARIANT SELECTOR
// ===============================

interface VariantSelectorProps {
  variants: RebbieProductVariant[];
  selectedVariant: RebbieProductVariant | null;
  onVariantChange: (variant: RebbieProductVariant) => void;
  currency: string;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  selectedVariant,
  onVariantChange,
  currency,
}) => {
  if (!variants || variants.length <= 1) return null;

  // Group variants by option types
  const variantOptions = variants.reduce((acc, variant) => {
    if (variant.options) {
      Object.entries(variant.options).forEach(([key, value]) => {
        if (!acc[key]) acc[key] = new Set();
        acc[key].add(value);
      });
    }
    return acc;
  }, {} as Record<string, Set<string>>);

  const handleOptionChange = (optionType: string, optionValue: string) => {
    const newVariant = variants.find(variant => 
      variant.options?.[optionType] === optionValue
    );
    if (newVariant) {
      onVariantChange(newVariant);
    }
  };

  return (
    <div className="space-y-6">
      {Object.entries(variantOptions).map(([optionType, values]) => (
        <div key={optionType}>
          <h4 className="font-medium text-neutral-900 mb-3 capitalize">
            {optionType}: <span className="text-rebbie-600">{selectedVariant?.options?.[optionType]}</span>
          </h4>
          <div className="flex flex-wrap gap-3">
            {Array.from(values).map((value) => {
              const isSelected = selectedVariant?.options?.[optionType] === value;
              const variant = variants.find(v => v.options?.[optionType] === value);
              const isAvailable = variant?.inventory_quantity > 0;
              
              return (
                <button
                  key={value}
                  onClick={() => isAvailable && handleOptionChange(optionType, value)}
                  disabled={!isAvailable}
                  className={clsx(
                    'px-4 py-3 border-2 rounded-xl text-sm font-medium transition-all hover:scale-105',
                    isSelected
                      ? 'border-rebbie-600 bg-rebbie-600 text-white shadow-rebbie-sm'
                      : isAvailable
                        ? 'border-neutral-300 bg-white text-neutral-700 hover:border-rebbie-600'
                        : 'border-neutral-200 bg-neutral-100 text-neutral-400 cursor-not-allowed',
                    !isAvailable && 'opacity-60'
                  )}
                >
                  {value}
                  {!isAvailable && (
                    <span className="block text-xs mt-1">Out of stock</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

// ===============================
// PRODUCT REVIEWS SECTION
// ===============================

const ProductReviews: React.FC<{ productId: string }> = ({ productId }) => {
  const reviews = [
    {
      id: '1',
      author: 'Adunni O.',
      rating: 5,
      date: '2024-01-15',
      comment: 'Absolutely love this bag! The quality is exceptional and it arrived exactly as described. Same-day delivery in Lagos was perfect.',
      verified: true,
      helpful: 12
    },
    {
      id: '2',
      author: 'Kemi A.',
      rating: 5,
      date: '2024-01-10',
      comment: 'Beautiful piece! The authentication certificate gave me confidence. Will definitely shop again.',
      verified: true,
      helpful: 8
    },
    {
      id: '3',
      author: 'Funmi W.',
      rating: 4,
      date: '2024-01-05',
      comment: 'Great quality and fast shipping to Port Harcourt. Only minor issue was packaging could be better.',
      verified: true,
      helpful: 5
    }
  ];

  const averageRating = 4.8;
  const totalReviews = 24;

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="flex items-center gap-8">
        <div className="text-center">
          <div className="text-4xl font-bold text-neutral-900 mb-1">{averageRating}</div>
          <div className="flex items-center justify-center mb-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
          </div>
          <div className="text-sm text-neutral-600">{totalReviews} reviews</div>
        </div>

        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map(stars => (
            <div key={stars} className="flex items-center gap-3">
              <span className="text-sm w-8">{stars}★</span>
              <div className="flex-1 bg-neutral-200 rounded-full h-2">
                <div 
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : 5}%` }}
                />
              </div>
              <span className="text-sm text-neutral-600 w-8">
                {stars === 5 ? 17 : stars === 4 ? 5 : 2}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-6">
        {reviews.map(review => (
          <div key={review.id} className="border-b border-neutral-200 pb-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-rebbie-600 rounded-full flex items-center justify-center text-white font-bold">
                  {review.author.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{review.author}</span>
                    {review.verified && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                        ✓ Verified
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon 
                          key={i} 
                          className={clsx(
                            'w-4 h-4',
                            i < review.rating ? 'text-yellow-400 fill-current' : 'text-neutral-300'
                          )} 
                        />
                      ))}
                    </div>
                    <span>•</span>
                    <span>{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-neutral-700 mb-3">{review.comment}</p>
            
            <div className="flex items-center gap-4 text-sm text-neutral-600">
              <button className="hover:text-rebbie-600">👍 Helpful ({review.helpful})</button>
              <button className="hover:text-rebbie-600">Reply</button>
            </div>
          </div>
        ))}
      </div>

      <Button variant="outline" fullWidth>
        View All Reviews ({totalReviews})
      </Button>
    </div>
  );
};

// ===============================
// MAIN PRODUCT DETAILS PAGE
// ===============================

export default function ProductDetailsPage() {
  const params = useParams();
  const handle = params.handle as string;
  
  const [selectedVariant, setSelectedVariant] = useState<RebbieProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [currency, setCurrency] = useState('NGN');
  const [activeTab, setActiveTab] = useState('description');

  const { product, loading, error } = useProduct(handle, currency);
  const { recommendations } = useProductRecommendations(product?.id || '', 4, currency);
  const { addItem, loading: addingToCart } = useCart();

  // Set default variant when product loads
  useEffect(() => {
    if (product?.variants && product.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(product.variants[0] as RebbieProductVariant);
    }
  }, [product, selectedVariant]);

  // Handle add to cart
  const handleAddToCart = async () => {
    if (!selectedVariant) {
      toast.warning('Please select a variant');
      return;
    }

    try {
      await addItem(selectedVariant, quantity);
      toast.cartAdded(product?.title || 'Product');
    } catch (error) {
      toast.error('Failed to add to cart', 'Please try again');
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = () => {
    setIsWishlisted(!isWishlisted);
    toast.info(
      isWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
      product?.title
    );
  };

  // Handle share
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product?.title,
          text: product?.description,
          url: window.location.href,
        });
      } catch (error) {
        navigator.clipboard.writeText(window.location.href);
        toast.success('Link copied to clipboard');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard');
    }
  };

  // Get current price
  const getCurrentPrice = () => {
    if (!selectedVariant?.prices) return 0;
    const price = selectedVariant.prices.find(p => 
      p.currency_code?.toLowerCase() === currency.toLowerCase()
    );
    return price?.amount || 0;
  };

  const currentPrice = getCurrentPrice();
  const formattedPrice = formatPrice(currentPrice, currency);

  if (loading) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-rebbie-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-neutral-600">Loading product...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !product) {
    return (
      <>
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-8xl mb-6">😞</div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-4">Product Not Found</h1>
            <p className="text-neutral-600 mb-8 max-w-md">
              The product you're looking for doesn't exist or may have been removed.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/products">
                <Button>Browse Products</Button>
              </Link>
              <Button variant="outline" onClick={() => window.history.back()}>
                <ArrowLeftIcon className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const productImages = product.images?.map(img => ({ url: img.url, alt: img.alt })) || [];

  return (
    <>
      <Header />
      
      <main className="min-h-screen bg-white">
        {/* Breadcrumb */}
        <div className="bg-neutral-50 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="text-sm text-neutral-500 flex items-center gap-2">
              <Link href="/" className="hover:text-rebbie-600">Home</Link>
              <span>/</span>
              <Link href="/products" className="hover:text-rebbie-600">Products</Link>
              {product.category_names && product.category_names.length > 0 && (
                <>
                  <span>/</span>
                  <Link href={`/products?category=${product.category_names[0]}`} className="hover:text-rebbie-600">
                    {product.category_names[0]}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="text-neutral-900 font-medium line-clamp-1">{product.title}</span>
            </nav>
          </div>
        </div>

        {/* Product Detail */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            
            {/* Product Images */}
            <div>
              <ProductGallery images={productImages} productTitle={product.title || ''} />
            </div>

            {/* Product Info */}
            <div className="space-y-8">
              {/* Category */}
              {product.category_names && product.category_names.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.category_names.map(category => (
                    <span key={category} className="bg-rebbie-100 text-rebbie-800 text-sm font-medium px-3 py-1 rounded-full">
                      {category}
                    </span>
                  ))}
                </div>
              )}

              {/* Title */}
              <div>
                <h1 className="text-4xl font-bold text-neutral-900 mb-4">{product.title}</h1>
                
                {/* Rating */}
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                    <span className="text-neutral-600 ml-2">(24 reviews)</span>
                  </div>
                  <span className="text-neutral-300">•</span>
                  <span className="text-sm text-green-600 font-medium">✓ In Stock</span>
                </div>
              </div>

              {/* Price */}
              <div className="py-6 border-y border-neutral-200">
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold text-neutral-900">
                    {formattedPrice}
                  </span>
                  {/* Original price if on sale */}
                  <span className="text-xl text-neutral-500 line-through">
                    ₦580,000
                  </span>
                  <span className="bg-red-500 text-white text-sm font-medium px-2 py-1 rounded-full">
                    Save 22%
                  </span>
                </div>
                
                {product.variants && product.variants.length > 1 && (
                  <p className="text-neutral-600 mt-2">
                    Price varies by selected options
                  </p>
                )}
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-3">
                {product.is_thrift && (
                  <span className="bg-green-100 text-green-800 text-sm px-4 py-2 rounded-full font-medium flex items-center gap-2">
                    ♻️ Sustainable Choice
                  </span>
                )}
                {product.condition && (
                  <span className="bg-blue-100 text-blue-800 text-sm px-4 py-2 rounded-full font-medium">
                    Condition: {product.condition}
                  </span>
                )}
                <span className="bg-rebbie-100 text-rebbie-800 text-sm px-4 py-2 rounded-full font-medium">
                  🏆 Authenticity Guaranteed
                </span>
              </div>

              {/* Description */}
              {product.description && (
                <div className="prose prose-neutral">
                  <p className="text-lg text-neutral-700 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Variant Selector */}
              {product.variants && (
                <VariantSelector
                  variants={product.variants as RebbieProductVariant[]}
                  selectedVariant={selectedVariant}
                  onVariantChange={setSelectedVariant}
                  currency={currency}
                />
              )}

              {/* Quantity Selector */}
              <div>
                <label className="block text-lg font-medium text-neutral-900 mb-3">
                  Quantity
                </label>
                <div className="flex items-center">
                  <div className="flex items-center border-2 border-neutral-300 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-3 hover:bg-neutral-50 transition-colors"
                    >
                      <MinusIcon className="w-5 h-5" />
                    </button>
                    <span className="px-6 py-3 border-l border-r border-neutral-300 font-medium min-w-[4rem] text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-3 hover:bg-neutral-50 transition-colors"
                    >
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <span className="ml-4 text-neutral-600">
                    {selectedVariant?.inventory_quantity || 0} available
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedVariant || addingToCart}
                  size="xl"
                  fullWidth
                  rightIcon={!addingToCart && <ShoppingBagIcon className="w-6 h-6" />}
                >
                  {addingToCart ? (
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Adding to Cart...
                    </div>
                  ) : (
                    <>Add to Cart • {formattedPrice}</>
                  )}
                </Button>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleWishlistToggle}
                    leftIcon={
                      isWishlisted ? (
                        <HeartSolidIcon className="w-5 h-5 text-red-500" />
                      ) : (
                        <HeartIcon className="w-5 h-5" />
                      )
                    }
                  >
                    {isWishlisted ? 'Wishlisted' : 'Save'}
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={handleShare}
                    leftIcon={<ShareIcon className="w-5 h-5" />}
                  >
                    Share
                  </Button>
                </div>
              </div>

              {/* Features */}
              <div className="bg-neutral-50 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-4 text-neutral-700">
                  <TruckIcon className="w-6 h-6 text-green-600" />
                  <div>
                    <div className="font-medium">Same-day delivery in Lagos</div>
                    <div className="text-sm text-neutral-600">Order before 3PM</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-neutral-700">
                  <ShieldCheckIcon className="w-6 h-6 text-blue-600" />
                  <div>
                    <div className="font-medium">100% authentic guarantee</div>
                    <div className="text-sm text-neutral-600">With authenticity certificate</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-neutral-700">
                  <CreditCardIcon className="w-6 h-6 text-rebbie-600" />
                  <div>
                    <div className="font-medium">Flexible payment options</div>
                    <div className="text-sm text-neutral-600">Paystack, bank transfer, or cash on delivery</div>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-neutral-700">
                  <PhoneIcon className="w-6 h-6 text-nigeria-whatsapp" />
                  <div>
                    <div className="font-medium">24/7 WhatsApp support</div>
                    <div className="text-sm text-neutral-600">Get instant help via WhatsApp</div>
                  </div>
                </div>
              </div>

              {/* WhatsApp Quick Contact */}
              <div className="bg-gradient-to-r from-nigeria-whatsapp to-green-600 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <PhoneIcon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold mb-1">Have questions about this product?</h3>
                    <p className="text-white/90 text-sm">Chat with our style consultants on WhatsApp</p>
                  </div>
                  <a
                    href={`https://wa.me/2349023821968?text=Hi! I'm interested in ${product.title}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="secondary" size="lg">
                      Chat Now
                    </Button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-neutral-50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tab Navigation */}
            <div className="flex justify-center mb-12">
              <div className="bg-white rounded-2xl p-2 shadow-sm">
                {[
                  { id: 'description', label: 'Description' },
                  { id: 'reviews', label: 'Reviews (24)' },
                  { id: 'shipping', label: 'Shipping & Returns' },
                  { id: 'authenticity', label: 'Authenticity' }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={clsx(
                      'px-6 py-3 rounded-xl font-medium transition-all',
                      activeTab === tab.id
                        ? 'bg-rebbie-600 text-white shadow-rebbie-sm'
                        : 'text-neutral-600 hover:text-rebbie-600'
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <Card className="p-8 lg:p-12">
              {activeTab === 'description' && (
                <div className="prose prose-lg max-w-none">
                  <h3 className="text-2xl font-bold mb-6">Product Details</h3>
                  <p className="text-neutral-700 leading-relaxed mb-6">
                    {product.description || 'Detailed product description would be shown here.'}
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
                    <div>
                      <h4 className="font-semibold mb-4">Specifications</h4>
                      <ul className="space-y-2 text-neutral-700">
                        <li>• Material: Premium leather</li>
                        <li>• Dimensions: 25cm x 15cm x 8cm</li>
                        <li>• Weight: 0.8kg</li>
                        <li>• Closure: Magnetic snap</li>
                        <li>• Interior: Fabric lining with pockets</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-4">Care Instructions</h4>
                      <ul className="space-y-2 text-neutral-700">
                        <li>• Clean with soft, dry cloth</li>
                        <li>• Avoid exposure to water</li>
                        <li>• Store in dust bag when not in use</li>
                        <li>• Professional cleaning recommended</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div>
                  <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>
                  <ProductReviews productId={product.id} />
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="prose prose-lg max-w-none">
                  <h3 className="text-2xl font-bold mb-6">Shipping & Returns</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-4">Shipping Options</h4>
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <ClockIcon className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="font-medium">Same-day (Lagos)</div>
                            <div className="text-sm text-neutral-600">₦2,500 • Order before 3PM</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <TruckIcon className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-medium">Standard (Nigeria)</div>
                            <div className="text-sm text-neutral-600">₦1,500 • 2-5 business days</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <TruckIcon className="w-5 h-5 text-purple-600" />
                          <div>
                            <div className="font-medium">International</div>
                            <div className="text-sm text-neutral-600">$25 • 7-14 business days</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-4">Return Policy</h4>
                      <ul className="space-y-2 text-neutral-700">
                        <li>• 30-day return window</li>
                        <li>• Items must be in original condition</li>
                        <li>• Include authenticity certificate</li>
                        <li>• Return shipping cost covered by us</li>
                        <li>• Refund processed within 5-7 days</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'authenticity' && (
                <div className="prose prose-lg max-w-none">
                  <h3 className="text-2xl font-bold mb-6">Authenticity Guarantee</h3>
                  
                  <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                      <ShieldCheckIcon className="w-8 h-8 text-green-600" />
                      <div>
                        <h4 className="font-semibold text-green-900">100% Authentic Guarantee</h4>
                        <p className="text-green-700">Every item comes with authenticity verification</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-semibold mb-4">Our Authentication Process</h4>
                      <ol className="space-y-3 text-neutral-700">
                        <li>1. Expert inspection by certified authenticators</li>
                        <li>2. Serial number and date code verification</li>
                        <li>3. Material and craftsmanship analysis</li>
                        <li>4. Comparison with brand standards</li>
                        <li>5. Digital certificate generation</li>
                      </ol>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-4">What You Get</h4>
                      <ul className="space-y-2 text-neutral-700">
                        <li>• Official authenticity certificate</li>
                        <li>• Digital verification code</li>
                        <li>• Expert authentication report</li>
                        <li>• Money-back guarantee if not authentic</li>
                        <li>• Lifetime authenticity support</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Related Products */}
        {recommendations.length > 0 && (
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">
                You Might Also Like
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendations.map(product => (
                  <Card key={product.id} className="group overflow-hidden hover:shadow-xl transition-all duration-300">
                    <div className="aspect-square bg-neutral-100 relative">
                      <div className="w-full h-full flex items-center justify-center text-neutral-400">
                        <div className="text-center">
                          <div className="text-4xl mb-2">📦</div>
                          <div className="text-sm">{product.title}</div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium line-clamp-2 mb-2">{product.title}</h3>
                      <div className="text-lg font-bold">
                        {formatPrice(product.variants?.[0]?.prices?.[0]?.amount || 0, 'NGN')}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}