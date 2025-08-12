/**
 * Brand Story Section for Rebbie's Store Landing Page
 * Tells the story behind the brand with engaging visuals
 */

'use client';

import React, { useState } from 'react';
import { clsx } from 'clsx';
import Button from '@/components/ui/Button';
import { 
  PlayIcon, 
  HeartIcon, 
  GlobeAltIcon,
  CheckBadgeIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

interface BrandStoryProps {
  className?: string;
}

const BrandStory: React.FC<BrandStoryProps> = ({ className }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const achievements = [
    {
      icon: <UserGroupIcon className="w-6 h-6" />,
      number: "10,000+",
      label: "Happy Customers",
      description: "Across Nigeria and diaspora"
    },
    {
      icon: <CheckBadgeIcon className="w-6 h-6" />,
      number: "500+",
      label: "Authenticated Items",
      description: "Luxury pieces verified"
    },
    {
      icon: <GlobeAltIcon className="w-6 h-6" />,
      number: "36",
      label: "States Reached",
      description: "Nationwide delivery"
    },
    {
      icon: <HeartIcon className="w-6 h-6" />,
      number: "4.9/5",
      label: "Customer Rating",
      description: "From verified reviews"
    }
  ];

  const values = [
    {
      title: "Authenticity First",
      description: "Every luxury item comes with authenticity certificates. We partner with verified sellers and use expert authentication.",
      icon: "🔐"
    },
    {
      title: "Sustainable Fashion",
      description: "Our thrift collection promotes circular fashion. Give pre-loved luxury items a second life while saving money.",
      icon: "♻️"
    },
    {
      title: "Nigerian Excellence",
      description: "Built for Nigerians, by Nigerians. We understand local preferences, payment methods, and delivery expectations.",
      icon: "🇳🇬"
    },
    {
      title: "Customer Obsession",
      description: "From WhatsApp support to same-day Lagos delivery, every decision is made with our customers in mind.",
      icon: "💝"
    }
  ];

  return (
    <section className={clsx('py-20 bg-white relative overflow-hidden', className)}>
      
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-rebbie-600 rounded-full" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-gold rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
          
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-rebbie-100 text-rebbie-800 text-sm font-medium px-4 py-2 rounded-full mb-6">
                <HeartIcon className="w-4 h-4" />
                Our Story
              </div>
              
              <h2 className="text-display-md font-bold text-neutral-900 mb-6">
                Born from a Passion for 
                <span className="text-rebbie-600"> Authentic Style</span>
              </h2>
              
              <div className="space-y-4 text-lg text-neutral-600 leading-relaxed">
                <p>
                  Rebbie's Store started in 2020 when Rebecca, a fashion enthusiast from Lagos, 
                  noticed the struggle Nigerian women faced finding authentic designer pieces 
                  at accessible prices.
                </p>
                
                <p>
                  What began as a small collection of authenticated thrift luxury bags has grown 
                  into Nigeria's most trusted destination for fashion bags, jewelry, and fragrances.
                </p>
                
                <p>
                  Today, we're proud to serve over 10,000 customers across all 36 states, 
                  offering both carefully curated thrift pieces and brand new designer collections.
                </p>
              </div>
            </div>

            {/* Founder Quote */}
            <div className="bg-rebbie-50 rounded-2xl p-6 border-l-4 border-rebbie-600">
              <blockquote className="text-neutral-700 italic mb-4">
                "Every woman deserves to feel confident and beautiful. Our mission is to make 
                authentic luxury fashion accessible to every Nigerian woman, regardless of budget."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-rebbie-600 rounded-full flex items-center justify-center text-white font-bold">
                  R
                </div>
                <div>
                  <div className="font-semibold text-neutral-900">Rebecca Adebayo</div>
                  <div className="text-sm text-neutral-600">Founder & CEO</div>
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" rightIcon={<HeartIcon className="w-5 h-5" />}>
                Join Our Community
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => setIsVideoPlaying(true)}
                leftIcon={<PlayIcon className="w-5 h-5" />}
              >
                Watch Our Story
              </Button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative">
            {/* Main Image Placeholder */}
            <div className="relative aspect-[4/5] bg-gradient-to-br from-rebbie-100 to-rebbie-200 rounded-3xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center text-rebbie-600">
                <div className="text-center">
                  <div className="text-8xl mb-4">👩🏾‍💼</div>
                  <div className="text-lg font-medium">Rebecca's Journey</div>
                </div>
              </div>
              
              {/* Play Button Overlay */}
              <button
                onClick={() => setIsVideoPlaying(true)}
                className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity group"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <PlayIcon className="w-8 h-8 text-rebbie-600 ml-1" />
                </div>
              </button>
            </div>

            {/* Floating Stats */}
            <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-4 shadow-xl border border-neutral-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-rebbie-600">2020</div>
                <div className="text-sm text-neutral-600">Founded</div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-neutral-100">
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600">♻️</div>
                <div className="text-sm text-neutral-600">Sustainable</div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="bg-gradient-primary rounded-3xl p-8 lg:p-12 mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">
              Our Impact in Numbers
            </h3>
            <p className="text-rebbie-200 text-lg max-w-2xl mx-auto">
              These numbers represent real lives touched, authentic pieces delivered, 
              and trust built across Nigeria
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className="text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 text-white">
                  {achievement.icon}
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                  {achievement.number}
                </div>
                <div className="text-rebbie-100 font-medium mb-1">
                  {achievement.label}
                </div>
                <div className="text-rebbie-200 text-sm">
                  {achievement.description}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h3 className="text-display-sm font-bold text-neutral-900 mb-4">
              What We Stand For
            </h3>
            <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
              Our core values guide every decision we make, from product selection 
              to customer service
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="group hover:bg-neutral-50 rounded-2xl p-6 transition-colors animate-fade-in-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{value.icon}</div>
                  <div>
                    <h4 className="text-xl font-semibold text-neutral-900 mb-3 group-hover:text-rebbie-600 transition-colors">
                      {value.title}
                    </h4>
                    <p className="text-neutral-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Section */}
        <div className="bg-neutral-50 rounded-3xl p-8 lg:p-12">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-neutral-900 mb-4">
              Our Journey So Far
            </h3>
            <p className="text-neutral-600 text-lg">
              Key milestones in building Nigeria's premier fashion destination
            </p>
          </div>

          <div className="space-y-8">
            {[
              {
                year: "2020",
                title: "The Beginning",
                description: "Started with 20 authenticated luxury bags from Rebecca's personal collection"
              },
              {
                year: "2021", 
                title: "First 1,000 Customers",
                description: "Expanded to jewelry and fragrances. Launched same-day Lagos delivery"
              },
              {
                year: "2022",
                title: "Nationwide Expansion", 
                description: "Reached all 36 states. Introduced Paystack payment integration"
              },
              {
                year: "2023",
                title: "10K+ Community",
                description: "Crossed 10,000 happy customers. Launched WhatsApp 24/7 support"
              },
              {
                year: "2024",
                title: "Digital Transformation",
                description: "Complete website redesign. Enhanced authentication process"
              }
            ].map((milestone, index) => (
              <div key={index} className="flex items-start gap-6">
                <div className="w-20 h-20 bg-rebbie-600 rounded-2xl flex items-center justify-center text-white font-bold flex-shrink-0">
                  {milestone.year}
                </div>
                <div className="flex-1 pt-2">
                  <h4 className="text-lg font-semibold text-neutral-900 mb-2">
                    {milestone.title}
                  </h4>
                  <p className="text-neutral-600">
                    {milestone.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Modal Placeholder */}
      {isVideoPlaying && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-2xl mx-4">
            <div className="aspect-video bg-neutral-200 rounded-xl flex items-center justify-center mb-4">
              <div className="text-center text-neutral-500">
                <PlayIcon className="w-16 h-16 mx-auto mb-4" />
                <p>Brand Story Video</p>
                <p className="text-sm">(Video content would be embedded here)</p>
              </div>
            </div>
            <div className="text-center">
              <Button onClick={() => setIsVideoPlaying(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default BrandStory;