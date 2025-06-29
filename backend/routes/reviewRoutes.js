const express = require('express');
const router = express.Router();
const db = require('../database');
const authenticateToken = require('./authMiddleware');

// POST /api/reviews - Submit a review
router.post('/', authenticateToken, async (req, res) => {
  try {
    const reviewer_id = req.worker.id;
    const { reviewee_id, job_id, rating, comment } = req.body;
    if (!reviewee_id || !rating) {
      return res.status(400).json({ error: 'Missing required fields.' });
    }
    // Validate rating
    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({ error: 'Rating must be a number between 1 and 5.' });
    }
    // Validate comment length
    if (comment && comment.length > 1000) {
      return res.status(400).json({ error: 'Comment is too long (max 1000 characters).' });
    }
    if (parseInt(reviewer_id) === parseInt(reviewee_id)) {
      return res.status(403).json({ error: 'You cannot review yourself.' });
    }
    await db.query(
      'INSERT INTO reviews (reviewer_id, reviewee_id, job_id, rating, comment) VALUES (?, ?, ?, ?, ?)',
      [reviewer_id, reviewee_id, job_id || null, ratingNum, comment || null]
    );
    res.status(201).json({ message: 'Review submitted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit review.' });
  }
});

// GET /api/reviews/:userId - Fetch all reviews for a user
router.get('/:userId', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const [reviews] = await db.query(
      'SELECT * FROM reviews WHERE reviewee_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reviews.' });
  }
});

// GET /api/reviews/:userId/summary - Get average rating and review count for a user
router.get('/:userId/summary', authenticateToken, async (req, res) => {
  try {
    const { userId } = req.params;
    const [rows] = await db.query(
      'SELECT AVG(rating) AS averageRating, COUNT(*) AS reviewCount FROM reviews WHERE reviewee_id = ?',
      [userId]
    );
    const summary = rows[0] || { averageRating: null, reviewCount: 0 };
    res.json({
      averageRating: summary.averageRating ? Number(summary.averageRating).toFixed(2) : null,
      reviewCount: summary.reviewCount || 0
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch review summary.' });
  }
});

module.exports = router; 