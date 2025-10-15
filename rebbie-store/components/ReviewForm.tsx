"use client";

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { FaStar } from 'react-icons/fa';
import toast from 'react-hot-toast';
import apiClient from '@/lib/api';

interface ReviewFormProps {
  productId: string;
  productTitle: string;
  onReviewSubmitted?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ 
  productId, 
  productTitle,
  onReviewSubmitted 
}) => {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user) {
      toast.error('Please log in to submit a review');
      return;
    }

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (comment.trim().length < 10) {
      toast.error('Review must be at least 10 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiClient.post('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          userName: session.user.name || 'Anonymous',
          userEmail: session.user.email,
          rating,
          comment: comment.trim()
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || 'Failed to submit review');
      }

      toast.success('Review submitted successfully!');
      setRating(0);
      setComment('');
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error: any) {
      console.error('Error submitting review:', error);
      toast.error(error.message || 'Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session?.user) {
    return (
      <div className="p-6 text-center border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800">
        <p className="mb-3 text-gray-600 dark:text-gray-400">
          Please log in to leave a review
        </p>
        <a 
          href="/login"
          className="inline-block px-6 py-2 font-semibold text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg"
        >
          Log In
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800">
      <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
        Write a Review for {productTitle}
      </h3>

      {/* Rating Stars */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Your Rating *
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="transition-transform duration-200 hover:scale-110"
            >
              <FaStar
                className={`w-8 h-8 ${
                  star <= (hoverRating || rating)
                    ? 'text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
            {rating > 0 ? `${rating} out of 5 stars` : 'Select a rating'}
          </span>
        </div>
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
          Your Review *
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          minLength={10}
          maxLength={1000}
          placeholder="Share your thoughts about this product..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          required
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          {comment.length}/1000 characters (minimum 10)
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
        className="w-full px-6 py-3 font-semibold text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Review'}
      </button>

      <p className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400">
        Your review will be verified if you've purchased this product
      </p>
    </form>
  );
};

export default ReviewForm;
