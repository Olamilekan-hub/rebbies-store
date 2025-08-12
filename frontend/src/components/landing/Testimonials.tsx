'use client';

import React, { useState, useEffect } from 'react';
import { clsx } from 'clsx';
import { StarIcon, QuoteIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { HeartIcon } from '@heroicons/react/24/outline';

interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  review: string;
  product: string;
  category: string;
  verified: boolean;
  date: string;
  images?: string[];
}

interface TestimonialsProps {
  className?: string;
}

const Testimonials: React.FC<TestimonialsProps> = ({ className }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  // Sample testimonials data - in production, this would come from API
  const testimonials: Testimonial[] = [
    {
      id: '1',
      name: 'Adunni Olatunji',
      location: 'Lagos, Nigeria',
      avatar: '/avatar-1.jpg',
      rating: 5,
      review: 'I was skeptical about buying a thrift Chanel bag online, but Rebbie\'s Store exceeded my expectations! The authentication certificate gave me confidence, and the bag arrived in perfect condition. Same-day delivery in Lagos is a game changer!',
      product: 'Vintage Chanel Quilted Handbag',
      category: 'Thrift Fashion Bags',
      verified: true,
      date: '2024-01-15',
      images: ['/review-1.jpg', '/review-2.jpg']
    },
    {
      id: '2',
      name: 'Kemi Adebayo',
      location: 'Abuja, FCT',
      avatar: '/avatar-2.jpg',
      rating: 5,
      review: 'The African jewelry collection is stunning! I bought a gold necklace set for my traditional wedding and received so many compliments. The quality is exceptional and the customer service team helped me choose the perfect piece via WhatsApp.',
      product: 'African Gold Necklace Set',
      category: 'Jewelry',
      verified: true,
      date: '2024-01-10'
    },
    {
      id: '3',
      name: 'Funmi Williams',
      location: 'Port Harcourt, Rivers',
      avatar: '/avatar-3.jpg',
      rating: 5,
      review: 'My Dior Sauvage perfume arrived quickly and was exactly as described. The packaging was secure and the fragrance is 100% authentic. Rebbie\'s Store has become my go-to for luxury fragrances. Thank you for making luxury accessible!',
      product: 'Dior Sauvage Eau de Toilette',
      category: 'Fragrances',
      verified: true,
      date: '2024-01-08'
    },
    {
      id: '4',
      name: 'Chioma Okoro',
      location: 'Enugu, Enugu',
      avatar: '/avatar-4.jpg',
      rating: 4,
      review: 'Great selection of contemporary bags! I love that they offer both thrift and new options. The payment process was smooth with Paystack, and delivery to Enugu was faster than expected. Will definitely shop again.',
      product: 'Contemporary Leather Tote Bag',
      category: 'Fashion Bags',
      verified: true,
      date: '2024-01-05'
    },
    {
      id: '5',
      name: 'Blessing Eze',
      location: 'Kano, Kano',
      avatar: '/avatar-5.jpg',
      rating: 5,
      review: 'I\'ve been buying from Rebbie\'s Store for over a year now. The consistency in quality and service is impressive. From Lagos to Kano, every delivery has been perfect. Their WhatsApp support makes shopping so easy!',
      product: 'Multiple purchases',
      category: 'Loyal Customer',
      verified: true,
      date: '2024-01-01'
    },
    {
      id: '6',
      name: 'Amara Nwankwo',
      location: 'Owerri, Imo',
      avatar: '/avatar-6.jpg',
      rating: 5,
      review: 'The emerald earrings I bought exceeded my expectations! Beautiful craftsmanship and arrived well-packaged. I appreciate the detailed photos and authenticity guarantee. Rebbie\'s Store has earned a customer for life.',
      product: 'Emerald Crystal Earrings',
      category: 'Jewelry',
      verified: true,
      date: '2023-12-28'
    }
  ];

  // Auto-play testimonials
  useEffect(() => {
    if (!autoPlay) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoPlay, testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const currentTestimonial = testimonials[currentSlide];

  return (
    <section className={clsx('py-20 bg-gradient-to-br from-rebbie-50 to-neutral-50', className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-white text-rebbie-800 text-sm font-medium px-4 py-2 rounded-full mb-4 shadow-sm">
            <HeartIcon className="w-4 h-4" />
            Customer Love
          </div>
          
          <h2 className="text-display-md font-bold text-neutral-900 mb-4">
            What Our <span className="text-rebbie-600">Customers Say</span>
          </h2>
          
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Over 10,000 satisfied customers across Nigeria trust us for authentic luxury fashion. 
            Here's what they have to say about their experience.
          </p>
        </div>

        {/* Main Testimonial Carousel */}
        <div className="relative mb-16">
          <div 
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
            onMouseEnter={() => setAutoPlay(false)}
            onMouseLeave={() => setAutoPlay(true)}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
              
              {/* Testimonial Content */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                
                {/* Quote Icon */}
                {/* <div className="text-rebbie-600 mb-6">
                  <QuoteIcon className="w-12 h-12" />
                </div> */}

                {/* Rating */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={clsx(
                        'w-5 h-5',
                        i < currentTestimonial.rating ? 'text-yellow-400' : 'text-neutral-300'
                      )}
                    />
                  ))}
                  <span className="ml-2 text-sm text-neutral-600">
                    {currentTestimonial.rating}/5
                  </span>
                </div>

                {/* Review Text */}
                <blockquote className="text-lg lg:text-xl text-neutral-700 leading-relaxed mb-8 italic">
                  "{currentTestimonial.review}"
                </blockquote>

                {/* Product Info */}
                <div className="bg-rebbie-50 rounded-xl p-4 mb-6">
                  <div className="text-sm text-rebbie-800 font-medium">
                    Purchased: {currentTestimonial.product}
                  </div>
                  <div className="text-xs text-rebbie-600">
                    Category: {currentTestimonial.category}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-rebbie-600 rounded-full flex items-center justify-center text-white font-bold">
                    {currentTestimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-900">
                        {currentTestimonial.name}
                      </span>
                      {currentTestimonial.verified && (
                        <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-medium px-2 py-0.5 rounded-full">
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-neutral-600">
                      {currentTestimonial.location} • {new Date(currentTestimonial.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>

              {/* Visual Section */}
              <div className="bg-gradient-to-br from-rebbie-100 to-rebbie-200 flex items-center justify-center p-8">
                <div className="text-center">
                  <div className="text-8xl mb-4">
                    {currentTestimonial.category === 'Fashion Bags' ? '👜' :
                     currentTestimonial.category === 'Jewelry' ? '💎' :
                     currentTestimonial.category === 'Fragrances' ? '🌸' : '💜'}
                  </div>
                  <div className="text-rebbie-800 font-medium">
                    {currentTestimonial.category}
                  </div>
                  <div className="text-rebbie-600 text-sm mt-2">
                    Authentic • Verified • Trusted
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-neutral-50 transition-colors"
          >
            <ChevronLeftIcon className="w-6 h-6 text-neutral-600" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-neutral-50 transition-colors"
          >
            <ChevronRightIcon className="w-6 h-6 text-neutral-600" />
          </button>
        </div>

        {/* Testimonial Indicators */}
        <div className="flex justify-center gap-2 mb-16">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={clsx(
                'w-3 h-3 rounded-full transition-all duration-300',
                index === currentSlide
                  ? 'bg-rebbie-600 w-8'
                  : 'bg-neutral-300 hover:bg-neutral-400'
              )}
            />
          ))}
        </div>

        {/* Customer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow animate-fade-in-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              {/* Mini Rating */}
              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={clsx(
                      'w-4 h-4',
                      i < testimonial.rating ? 'text-yellow-400' : 'text-neutral-300'
                    )}
                  />
                ))}
              </div>

              {/* Mini Review */}
              <p className="text-neutral-700 text-sm leading-relaxed mb-4 line-clamp-4">
                "{testimonial.review}"
              </p>

              {/* Mini Customer Info */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-rebbie-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-neutral-900 text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-xs text-neutral-600">
                    {testimonial.location}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Badges */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">
              Trusted by Thousands
            </h3>
            <p className="text-neutral-600">
              Join our growing community of satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-rebbie-600 mb-2">4.9/5</div>
              <div className="text-sm text-neutral-600">Average Rating</div>
              <div className="flex justify-center mt-2">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} className="w-4 h-4 text-yellow-400" />
                ))}
              </div>
            </div>

            <div>
              <div className="text-3xl font-bold text-rebbie-600 mb-2">10K+</div>
              <div className="text-sm text-neutral-600">Happy Customers</div>
              <div className="text-xs text-rebbie-600 mt-1">Across Nigeria</div>
            </div>

            <div>
              <div className="text-3xl font-bold text-rebbie-600 mb-2">2.5K+</div>
              <div className="text-sm text-neutral-600">Reviews</div>
              <div className="text-xs text-rebbie-600 mt-1">Verified purchases</div>
            </div>

            <div>
              <div className="text-3xl font-bold text-rebbie-600 mb-2">99%</div>
              <div className="text-sm text-neutral-600">Satisfaction</div>
              <div className="text-xs text-rebbie-600 mt-1">Would recommend</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <h3 className="text-2xl font-bold text-neutral-900 mb-4">
            Ready to Join Our Happy Customers?
          </h3>
          <p className="text-neutral-600 mb-8 max-w-2xl mx-auto">
            Experience the same quality, authenticity, and service that our customers rave about. 
            Your perfect luxury piece is just a click away.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/products" className="btn btn-primary btn-lg">
              Start Shopping
            </a>
            <a 
              href="https://wa.me/2348065776378?text=Hi%20Rebbie's%20Store!%20I%20have%20questions%20about%20your%20products"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-lg"
            >
              Ask Questions
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;