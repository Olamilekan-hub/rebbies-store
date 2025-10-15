"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IoStarSharp, 
  // IoQuoteOutline
 } from "react-icons/io5";

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Adunni Adebayo",
      location: "Lagos, Nigeria",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b8c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      review: "Rebbie's Store completely transformed my skincare routine! The products are authentic and perfect for my skin tone. I've been glowing for months now!",
      product: "Vitamin C Serum Set"
    },
    {
      name: "Kemi Olusanya",
      location: "Abuja, Nigeria",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      review: "Finally found a store that understands Nigerian hair! Their hair care products brought my natural hair back to life. Customer service is exceptional too.",
      product: "Natural Hair Care Bundle"
    },
    {
      name: "Funmi Okafor",
      location: "Port Harcourt, Nigeria",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      review: "The jewelry collection is stunning! I get compliments everywhere I go. Quality is top-notch and delivery was super fast. Highly recommend!",
      product: "Gold Plated Jewelry Set"
    },
    {
      name: "Blessing Chukwu",
      location: "Enugu, Nigeria",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80",
      rating: 5,
      review: "Been shopping with Rebbie's for over a year now. Never disappointed! Products arrive exactly as described and customer support is always helpful.",
      product: "Complete Beauty Routine"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-pink-800 dark:from-black dark:via-purple-900 dark:to-purple-800">

      {/* Background Decorations */}
      <div className="absolute inset-0">
        <div className="absolute w-40 h-40 bg-pink-400 rounded-full top-20 left-20 blur-3xl opacity-10"></div>
        <div className="absolute bg-purple-400 rounded-full bottom-20 right-20 w-60 h-60 blur-3xl opacity-10"></div>
      </div>

      <div className="relative px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-white md:text-5xl">
            What Our <span className="text-transparent bg-gradient-to-r from-pink-300 to-purple-300 bg-clip-text">Beautiful</span> Customers Say
          </h2>
          <p className="max-w-3xl mx-auto text-xl text-purple-100">
            Join thousands of satisfied customers who&apos;ve transformed their beauty routine with Rebbie&apos;s Store
          </p>
        </div>

        {/* Main Testimonial Card */}
        <div className="relative max-w-4xl mx-auto">
          <div className="p-8 border shadow-2xl bg-white/10 backdrop-blur-sm rounded-3xl md:p-12 border-white/20">

            {/* Quote Icon */}
            <div className="absolute -top-6 left-8">
              <div className="p-4 rounded-full shadow-lg bg-gradient-to-r from-pink-500 to-purple-600">
                {/* <IoQuoteOutline className="w-8 h-8 text-white" /> */}
              </div>
            </div>

            {/* Testimonial Content */}
            <div className="mt-8 text-center">

              {/* Stars */}
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <IoStarSharp key={i} className="w-6 h-6 mx-1 text-yellow-400" />
                ))}
              </div>

              {/* Review Text */}
              <blockquote className="mb-8 text-xl italic font-light leading-relaxed text-white md:text-2xl">
                &quot;{testimonials[currentTestimonial].review}&quot;
              </blockquote>

              {/* Customer Info */}
              <div className="flex items-center justify-center space-x-4">
                <img
                  src={testimonials[currentTestimonial].image}
                  alt={testimonials[currentTestimonial].name}
                  className="w-16 h-16 border-4 rounded-full shadow-lg border-white/20"
                />
                <div className="text-left">
                  <div className="text-lg font-semibold text-white">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <div className="text-sm text-purple-200">
                    {testimonials[currentTestimonial].location}
                  </div>
                  <div className="text-xs font-medium text-pink-300">
                    Purchased: {testimonials[currentTestimonial].product}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial
                    ? 'bg-white scale-125'
                    : 'bg-white/40 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-8 mt-20 md:grid-cols-4">
          {[
            { number: "10,000+", label: "Happy Customers" },
            { number: "50+", label: "Premium Products" },
            { number: "4.9", label: "Average Rating" },
            { number: "99%", label: "Customer Satisfaction" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="mb-2 text-3xl font-bold text-white md:text-4xl">
                {stat.number}
              </div>
              <div className="text-sm tracking-wide text-purple-200 uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center px-8 py-4 font-semibold text-white transition-all duration-300 shadow-lg bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl hover:shadow-xl hover:scale-105"
          >
            Join Our Happy Customers
            <IoStarSharp className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;