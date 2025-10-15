"use client";

import React, { useState, useEffect } from 'react';
import { FaStar, FaThumbsUp, FaCheckCircle } from 'react-icons/fa';
import apiClient from '@/lib/api';
import toast from 'react-hot-toast';

interface Review {
  id: string;
  userName: string;
  userEmail: string;
  rating: number;
  comment: string;
  verified: boolean;
  helpful: number;
  createdAt: string;
}

interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

interface ReviewsListProps {
  productId: string;
  refreshTrigger?: number;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ productId, refreshTrigger }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [helpfulClicks, setHelpfulClicks] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchReviews();
  }, [productId, refreshTrigger]);

  const fetchReviews = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get(`/api/reviews/product/${productId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch reviews');
      }

      const data = await response.json();
      setReviews(data.reviews || []);
      setStats(data.stats || null);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load reviews');
    } finally {
      setIsLoading(false);
    }
  };
  const handleHelpful = async (reviewId: string) => {
    if (helpfulClicks.has(reviewId)) {
      toast('You already marked this review as helpful');
      return;
    }

    try {
      const response = await apiClient.patch(`/api/reviews/${reviewId}/helpful`);

      if (!response.ok) {
        throw new Error('Failed to mark as helpful');
      }

      setHelpfulClicks(prev => new Set(prev).add(reviewId));
      toast.success('Thank you for your feedback!');
      fetchReviews();
    } catch (error) {
      console.error('Error marking review as helpful:', error);
      toast.error('Failed to mark as helpful');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="inline-block w-8 h-8 border-4 border-purple-600 rounded-full border-t-transparent animate-spin"></div>
        <p className="mt-2 text-gray-600 dark:text-gray-400">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Review Statistics */}
      {stats && stats.totalReviews > 0 && (
        <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Average Rating */}
            <div className="text-center">
              <div className="mb-2 text-5xl font-bold text-gray-900 dark:text-white">
                {stats.averageRating.toFixed(1)}
              </div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <FaStar
                    key={star}
                    className={`w-6 h-6 ${
                      star <= Math.round(stats.averageRating)
                        ? 'text-yellow-400'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution];
                const percentage = stats.totalReviews > 0 ? (count / stats.totalReviews) * 100 : 0;
                
                return (
                  <div key={rating} className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12">
                      {rating} <FaStar className="inline w-3 h-3 text-yellow-400" />
                    </span>
                    <div className="flex-1 h-3 overflow-hidden bg-gray-200 rounded-full dark:bg-gray-700">
                      <div
                        className="h-full transition-all duration-300 bg-yellow-400"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg text-gray-600 dark:text-gray-400">
            No reviews yet. Be the first to review this product!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Customer Reviews
          </h3>
          
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-6 transition-shadow duration-300 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-lg"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {review.userName}
                    </span>
                    {review.verified && (
                      <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-100 rounded-full dark:bg-green-900 dark:text-green-300">
                        <FaCheckCircle className="w-3 h-3" />
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          className={`w-4 h-4 ${
                            star <= review.rating
                              ? 'text-yellow-400'
                              : 'text-gray-300 dark:text-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Review Comment */}
              <p className="mb-4 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                {review.comment}
              </p>

              {/* Helpful Button */}
              <button
                onClick={() => handleHelpful(review.id)}
                disabled={helpfulClicks.has(review.id)}
                className="flex items-center gap-2 text-sm text-gray-600 transition-colors dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaThumbsUp className="w-4 h-4" />
                Helpful ({review.helpful})
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewsList;
