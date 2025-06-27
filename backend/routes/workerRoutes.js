const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const multer = require('multer'); // Import multer
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const authenticateToken = require('./authMiddleware'); // Adjust path if needed
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

// Test endpoint to verify backend is working
router.get('/test', (req, res) => {
  res.json({ message: 'Worker route is working!' });
});

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Create a 'uploads' directory if it doesn't exist
    const uploadDir = './uploads/worker_media';
    const fs = require('fs'); // Import fs to check/create directory
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only image and PDF files are allowed'));
    }
  },
});

// Import aiService for face verification and login logic
const { simulateFaceVerification, authenticateWorker, getWorkerProfile, getWorkerDashboardStats, getOngoingWorkerJobs, getPastWorkerJobs } = require('../services/aiService');

// Middleware to protect routes


// Worker signup route
router.post('/signup', upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'facePhoto', maxCount: 1 },
  { name: 'portfolioFiles', maxCount: 5 }
]), async (req, res) => {
  console.log('📥 Received worker signup request:', req.body);
  console.log('📁 Received files:', req.files);
  const db = req.app.locals.db;

  const {
    name, email, phone, address, password,
    profession, skills, experience, description, certifications
  } = req.body;

  // ✅ Safely convert to valid JSON arrays or fallback to []
  function toSafeJsonArray(input) {
    if (typeof input !== 'string' || input.trim() === '') return '[]';
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return JSON.stringify(parsed);
    } catch (e) {
      // Not valid JSON → treat as comma-separated string
      return JSON.stringify(
        input.split(',').map(s => s.trim()).filter(Boolean)
      );
    }
  }

  const skillsJson = toSafeJsonArray(skills);
  const certificationsJson = toSafeJsonArray(certifications);

  console.log('✅ skillsJson:', skillsJson);
  console.log('✅ certificationsJson:', certificationsJson);

  const profilePhotoPath = req.files?.profilePhoto?.[0]?.path || null;
  const facePhotoPath = req.files?.facePhoto?.[0]?.path || null;
  const portfolioFilePaths = req.files?.portfolioFiles?.map(f => f.path) || [];

  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, (err, hash) => {
    if (err) {
      console.error('❌ Error hashing password:', err);
      return res.status(500).json({ message: 'Error encrypting password' });
    }

    const query = `
      INSERT INTO workers (
        name, email, phone, address, password,
        profession, skills, experience, description, certifications,
        profile_photo, face_photo, portfolio_files
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [
      name,
      email,
      phone,
      address,
      hash,
      profession,
      skillsJson,
      experience,
      description,
      certificationsJson,
      profilePhotoPath,
      facePhotoPath,
      JSON.stringify(portfolioFilePaths)
    ], (err, result) => {
      if (err) {
        console.error('❌ Error inserting worker:', err);
        return res.status(500).json({ message: 'Worker signup failed' });
      }

      res.json({ message: '✅ Worker registered successfully!' });
    });
  });
});

// Worker Login Route
router.post('/login', async (req, res) => {
  const db = req.app.locals.db;
  const { emailOrPhone, password } = req.body;

  try {
    const { worker, token } = await authenticateWorker(db, emailOrPhone, password);
    res.json({ message: 'Login successful', token, worker });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// Get Worker Profile Route (Protected)
router.get('/profile', authenticateToken, async (req, res) => {
  const db = req.app.locals.db;
  try {
    const worker = await getWorkerProfile(db, req.worker.id);
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Worker Dashboard Stats Route (Protected)
router.get('/dashboard-stats', authenticateToken, async (req, res) => {
  const db = req.app.locals.db;
  try {
    const stats = await getWorkerDashboardStats(db, req.worker.id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Ongoing Jobs for Worker (Protected)
router.get('/jobs/ongoing', authenticateToken, async (req, res) => {
  const db = req.app.locals.db;
  const workerId = req.worker.id;
  const query = 'SELECT * FROM job_requests WHERE assignedWorkerId = ? AND (status = ? OR status = ?)';
  db.query(query, [workerId, 'accepted', 'ongoing'], (err, results) => {
    if (err) {
      console.error('Error fetching ongoing jobs:', err);
      return res.status(500).json({ message: 'Failed to fetch ongoing jobs' });
    }
    res.json(results);
  });
});

// Get Past Job History for Worker (Protected)
router.get('/jobs/history', authenticateToken, async (req, res) => {
  const db = req.app.locals.db;
  const { status, sortBy, order } = req.query; // For filtering and sorting
  try {
    const pastJobs = await getPastWorkerJobs(db, req.worker.id, { status, sortBy, order });
    res.json(pastJobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Customer creates maid request
router.post('/maid-request', (req, res) => {
  const { address, workType, date, time, description } = req.body;
  const db = req.app.locals.db; // Access the shared DB connection
  const query = 'INSERT INTO job_requests (address, service_type, date, time, description, status) VALUES (?, ?, ?, ?, ?, "pending")';
  db.query(query, [address, workType, date, time, description], (err, result) => {
    if (err) {
      console.error('Error creating request:', err);
      return res.status(500).json({ message: 'Failed to create maid request' });
    }
    res.json({ message: 'Maid request submitted!' });
  });
});

// Get all pending jobs for the worker's profession
router.get('/jobs/pending', authenticateToken, async (req, res) => {
  const db = req.app.locals.db;
  const profession = req.worker.profession;
  const query = 'SELECT * FROM job_requests WHERE service_type = ? AND status = ?';
  db.query(query, [profession, 'pending'], (err, results) => {
    if (err) {
      console.error('Error fetching pending jobs:', err);
      return res.status(500).json({ message: 'Failed to fetch pending jobs' });
    }
    res.json(results);
  });
});

// GET /api/worker/search - public endpoint to search workers
router.get('/search', async (req, res) => {
  const db = req.app.locals.db;
  let sort = req.query.sort || 'name_asc';
  let orderBy = 'name ASC';
  if (sort === 'rating_desc') orderBy = 'rating DESC';
  if (sort === 'rating_asc') orderBy = 'rating ASC';

  const query = `SELECT id, name, email, phone, address, profession, rating, reviewCount, successRate, isAvailable, profile_photo FROM workers ORDER BY ${orderBy}`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching workers:', err);
      return res.status(500).json({ message: 'Failed to fetch workers' });
    }
    res.json(results);
  });
});

router.post('/accept', authenticateToken, (req, res) => {
  const db = req.app.locals.db;
  const workerId = req.worker.id;
  const { jobId } = req.body;

  // Check profession match
  const query = `
    SELECT j.service_type, w.profession
    FROM job_requests j
    JOIN workers w ON w.id = ?
    WHERE j.id = ?
  `;

  db.query(query, [workerId, jobId], (err, results) => {
    if (err || results.length === 0) {
      console.error('Fetch error:', err);
      return res.status(500).json({ message: 'Job or worker not found' });
    }

    const { service_type, profession } = results[0];

    if (service_type.toLowerCase() !== profession.toLowerCase()) {
      return res.status(403).json({
        message: `Profession mismatch: You are a ${profession}, but this is a ${service_type} job.`
      });
    }

    // Update the job to assign the worker and set status to 'accepted'
    const updateQuery = 'UPDATE job_requests SET assignedWorkerId = ?, status = ? WHERE id = ?';
    db.query(updateQuery, [workerId, 'accepted', jobId], (updateErr, updateResult) => {
      if (updateErr) {
        console.error('Error updating job:', updateErr);
        return res.status(500).json({ message: 'Failed to accept job' });
      }
      res.json({ message: 'Job accepted successfully!' });
    });
  });
});

module.exports = router;