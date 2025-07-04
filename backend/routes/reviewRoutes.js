const express = require('express');
const router = express.Router();
const db = require('../firebase');
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
    await db.collection('reviews').add({
      reviewer_id, reviewee_id, job_id, rating, comment, created_at: new Date()
    });
    res.status(201).json({ message: 'Review submitted successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit review.' });
  }
});

// GET /api/reviews/:userId - Fetch all reviews for a user
router.get('/:userId', authenticateToken, async (req, res) => {
  const userId = req.params.userId;
  try {
    const snapshot = await db.collection('reviews')
      .where('reviewee_id', '==', userId)
      .orderBy('created_at', 'desc')
      .get();
    const reviews = snapshot.docs.map(doc => doc.data());
    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch reviews.' });
  }
});

// GET /api/reviews/:userId/summary - Get average rating and review count for a user
router.get('/:userId/summary', authenticateToken, async (req, res) => {
  const userId = req.params.userId;
  try {
    const snapshot = await db.collection('reviews')
      .where('reviewee_id', '==', userId)
      .get();
    const ratings = snapshot.docs.map(doc => doc.data().rating);
    const averageRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length) : 0;
    res.json({
      averageRating: Number(averageRating.toFixed(2)),
      reviewCount: ratings.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch review summary.' });
  }
});

// Add a review
router.post('/add', async (req, res) => {
  const { reviewer_id, reviewee_id, job_id, rating, comment } = req.body;
  try {
    await db.collection('reviews').add({
      reviewer_id, reviewee_id, job_id, rating, comment, created_at: new Date()
    });
    res.json({ message: 'Review added!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add review' });
  }
});

// Get reviews for a user
router.get('/user/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    const snapshot = await db.collection('reviews')
      .where('reviewee_id', '==', userId)
      .orderBy('created_at', 'desc')
      .get();
    const reviews = snapshot.docs.map(doc => doc.data());
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
});

// Get average rating for a user
router.get('/user/:id/average', async (req, res) => {
  const userId = req.params.id;
  try {
    const snapshot = await db.collection('reviews')
      .where('reviewee_id', '==', userId)
      .get();
    const ratings = snapshot.docs.map(doc => doc.data().rating);
    const averageRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length) : 0;
    res.json({ averageRating, reviewCount: ratings.length });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch average rating' });
  }
});

module.exports = router; 