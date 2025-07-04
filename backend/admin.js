const express = require('express');
const router = express.Router();
const db = require('./firebase'); // Firestore

// Get all job requests
router.get('/admin/job-requests', async (req, res) => {
  try {
    const snapshot = await db.collection('job_requests').get();
    const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching job requests' });
  }
});

// Get all users
router.get('/admin/users', async (req, res) => {
  try {
    const snapshot = await db.collection('signup').get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Get all workers
router.get('/admin/workers', async (req, res) => {
  try {
    const snapshot = await db.collection('workers').get();
    const workers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(workers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching workers' });
  }
});

module.exports = router;
