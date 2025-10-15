const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get all reviews for a product
async function getProductReviews(request, response) {
  try {
    const { productId } = request.params;

    if (!productId) {
      return response.status(400).json({
        error: "Product ID is required"
      });
    }

    const reviews = await prisma.review.findMany({
      where: {
        productId: productId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate average rating
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

    return response.status(200).json({
      reviews,
      stats: {
        totalReviews: reviews.length,
        averageRating: Math.round(averageRating * 10) / 10,
        ratingDistribution: {
          5: reviews.filter(r => r.rating === 5).length,
          4: reviews.filter(r => r.rating === 4).length,
          3: reviews.filter(r => r.rating === 3).length,
          2: reviews.filter(r => r.rating === 2).length,
          1: reviews.filter(r => r.rating === 1).length,
        }
      }
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return response.status(500).json({
      error: "Internal server error",
      details: "Failed to fetch reviews"
    });
  }
}

// Create a new review
async function createReview(request, response) {
  try {
    const { productId, userName, userEmail, rating, comment } = request.body;

    // Validation
    if (!productId || !userName || !userEmail || !rating || !comment) {
      return response.status(400).json({
        error: "Validation failed",
        details: "All fields are required: productId, userName, userEmail, rating, comment"
      });
    }

    if (rating < 1 || rating > 5) {
      return response.status(400).json({
        error: "Validation failed",
        details: "Rating must be between 1 and 5"
      });
    }

    if (comment.trim().length < 10) {
      return response.status(400).json({
        error: "Validation failed",
        details: "Review comment must be at least 10 characters"
      });
    }

    // Check if product exists
    const product = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return response.status(404).json({
        error: "Product not found"
      });
    }

    // Check if user already reviewed this product
    const existingReview = await prisma.review.findFirst({
      where: {
        productId: productId,
        userEmail: userEmail
      }
    });

    if (existingReview) {
      return response.status(409).json({
        error: "Duplicate review",
        details: "You have already reviewed this product"
      });
    }

    // Check if user has purchased this product (mark as verified)
    const hasPurchased = await prisma.customer_order_product.findFirst({
      where: {
        productId: productId,
        customerOrder: {
          email: userEmail,
          status: {
            in: ['completed', 'delivered', 'processing']
          }
        }
      }
    });

    // Create review
    const review = await prisma.review.create({
      data: {
        productId,
        userName,
        userEmail,
        rating: parseInt(rating),
        comment: comment.trim(),
        verified: !!hasPurchased
      }
    });

    // Update product average rating
    const allReviews = await prisma.review.findMany({
      where: { productId }
    });
    
    const newAverageRating = Math.round(
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length
    );

    await prisma.product.update({
      where: { id: productId },
      data: { rating: newAverageRating }
    });

    console.log(`Review created successfully: Product ${productId}, User ${userEmail}`);

    return response.status(201).json({
      success: true,
      review,
      message: "Review submitted successfully"
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return response.status(500).json({
      error: "Internal server error",
      details: "Failed to create review"
    });
  }
}

// Mark review as helpful
async function markReviewHelpful(request, response) {
  try {
    const { id } = request.params;

    if (!id) {
      return response.status(400).json({
        error: "Review ID is required"
      });
    }

    const review = await prisma.review.findUnique({
      where: { id }
    });

    if (!review) {
      return response.status(404).json({
        error: "Review not found"
      });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: {
        helpful: review.helpful + 1
      }
    });

    return response.status(200).json(updatedReview);
  } catch (error) {
    console.error("Error marking review as helpful:", error);
    return response.status(500).json({
      error: "Internal server error"
    });
  }
}

// Delete review (admin only)
async function deleteReview(request, response) {
  try {
    const { id } = request.params;

    if (!id) {
      return response.status(400).json({
        error: "Review ID is required"
      });
    }

    const review = await prisma.review.findUnique({
      where: { id }
    });

    if (!review) {
      return response.status(404).json({
        error: "Review not found"
      });
    }

    await prisma.review.delete({
      where: { id }
    });

    // Recalculate product rating
    const remainingReviews = await prisma.review.findMany({
      where: { productId: review.productId }
    });

    const newRating = remainingReviews.length > 0
      ? Math.round(remainingReviews.reduce((sum, r) => sum + r.rating, 0) / remainingReviews.length)
      : 0;

    await prisma.product.update({
      where: { id: review.productId },
      data: { rating: newRating }
    });

    return response.status(204).send();
  } catch (error) {
    console.error("Error deleting review:", error);
    return response.status(500).json({
      error: "Internal server error"
    });
  }
}

module.exports = {
  getProductReviews,
  createReview,
  markReviewHelpful,
  deleteReview
};
