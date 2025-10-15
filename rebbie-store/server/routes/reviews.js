const express = require("express");
const router = express.Router();
const {
  getProductReviews,
  createReview,
  markReviewHelpful,
  deleteReview
} = require("../controllers/reviews");

// Get all reviews for a product
router.get("/product/:productId", getProductReviews);

// Create a new review
router.post("/", createReview);

// Mark review as helpful
router.patch("/:id/helpful", markReviewHelpful);

// Delete review (admin only)
router.delete("/:id", deleteReview);

module.exports = router;
