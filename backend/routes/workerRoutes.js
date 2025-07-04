const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const multer = require('multer'); // Import multer
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const authenticateToken = require('./authMiddleware'); // Adjust path if needed
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';
const db = require("../firebase"); // Firestore

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
const { sendJobAcceptedEmail } = require('../utils/emailService'); // <-- Add this import

// Middleware to protect routes


// Worker signup route
router.post('/signup', upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'facePhoto', maxCount: 1 },
  { name: 'portfolioFiles', maxCount: 5 }
]), async (req, res) => {
  console.log('📥 Received worker signup request:', req.body);
  console.log('📁 Received files:', req.files);

  const {
    name, email, phone, address, password,
    profession, skills, experience, description, certifications
  } = req.body;

  function toSafeJsonArray(input) {
    if (typeof input !== 'string' || input.trim() === '') return [];
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      return input.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  }

  const skillsArr = toSafeJsonArray(skills);
  const certificationsArr = toSafeJsonArray(certifications);

  const profilePhotoPath = req.files?.profilePhoto?.[0]?.path || null;
  const facePhotoPath = req.files?.facePhoto?.[0]?.path || null;
  const portfolioFilePaths = req.files?.portfolioFiles?.map(f => f.path) || [];

  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, async (err, hash) => {
    if (err) {
      console.error('❌ Error hashing password:', err);
      return res.status(500).json({ message: 'Error encrypting password' });
    }
    try {
      const workersRef = db.collection('workers');
      const existing = await workersRef.where('email', '==', email).get();
      if (!existing.empty) {
        return res.status(409).json({ message: 'Worker already exists with this email.' });
      }
      await workersRef.add({
        name,
        email,
        phone,
        address,
        password: hash,
        profession,
        skills: skillsArr,
        experience,
        description,
        certifications: certificationsArr,
        profile_photo: profilePhotoPath,
        face_photo: facePhotoPath,
        portfolio_files: portfolioFilePaths
      });
      res.json({ message: '✅ Worker registered successfully!' });
    } catch (err) {
      console.error('❌ Error inserting worker:', err);
      return res.status(500).json({ message: 'Worker signup failed' });
    }
  });
});

// Worker Login Route
router.post('/login', async (req, res) => {
  const { emailOrPhone, password } = req.body;
  try {
    // Try to find worker by email or phone
    const workersRef = db.collection('workers');
    const snapshot = await workersRef
      .where('email', '==', emailOrPhone)
      .get();
    let workerDoc = snapshot.empty ? null : snapshot.docs[0];
    if (!workerDoc) {
      // Try phone if not found by email
      const phoneSnap = await workersRef.where('phone', '==', emailOrPhone).get();
      workerDoc = phoneSnap.empty ? null : phoneSnap.docs[0];
    }
    if (!workerDoc) {
      return res.status(401).json({ message: 'Worker not found' });
    }
    const worker = workerDoc.data();
    const isMatch = await bcrypt.compare(password, worker.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }
    // Create JWT Payload
    const payload = {
      id: workerDoc.id,
      email: worker.email,
      profession: worker.profession
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
    res.json({ message: 'Login successful', token, worker: { id: workerDoc.id, ...worker } });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
});

// Get Worker Profile Route (Protected)
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const worker = await getWorkerProfile(db, req.worker.id);
    res.json(worker);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Worker Dashboard Stats Route (Protected)
router.get('/dashboard-stats', authenticateToken, async (req, res) => {
  try {
    const stats = await getWorkerDashboardStats(db, req.worker.id);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get ongoing jobs for worker
router.get('/jobs/ongoing', authenticateToken, async (req, res) => {
  const workerId = req.worker.id;
  try {
    const snapshot = await db.collection('job_requests')
      .where('assignedWorkerId', '==', workerId)
      .where('status', 'in', ['accepted', 'ongoing'])
      .get();
    const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch ongoing jobs' });
  }
});

// Get past job history for worker
router.get('/jobs/history', authenticateToken, async (req, res) => {
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
const professionToServiceTypes = {
  plumber: ['plumber', 'plumbing'],
  maid: ['maid'],
  electrician: ['electrician', 'electrical'],
  'deep-cleaner': ['deep-cleaner', 'deep-cleaning'],
  // Add more mappings as needed
};

// Get pending jobs for worker's profession
router.get('/jobs/pending', authenticateToken, async (req, res) => {
  const profession = req.worker.profession.toLowerCase();
  const serviceTypes = professionToServiceTypes[profession] || [profession];
  try {
    const snapshot = await db.collection('job_requests')
      .where('service_type', 'in', serviceTypes)
      .where('status', '==', 'pending')
      .get();
    const jobs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch pending jobs' });
  }
});

// GET /api/worker/search - public endpoint to search workers
router.get('/search', async (req, res) => {
  let { service, location, gender, sort } = req.query;
  let orderBy = 'name ASC';
  if (sort === 'rating_desc') orderBy = 'rating DESC';
  if (sort === 'rating_asc') orderBy = 'rating ASC';

  // Build WHERE clause dynamically
  let whereClauses = [];
  let params = [];

  if (service) {
    // Match either profession or skills (skills is a JSON string)
    whereClauses.push('(LOWER(profession) LIKE ? OR LOWER(skills) LIKE ?)');
    params.push(`%${service.toLowerCase()}%`);
    params.push(`%${service.toLowerCase()}%`);
  }
  if (location) {
    whereClauses.push('LOWER(address) LIKE ?');
    params.push(`%${location.toLowerCase()}%`);
  }
  if (gender) {
    whereClauses.push('LOWER(gender) = ?');
    params.push(gender.toLowerCase());
  }

  let where = whereClauses.length ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const query = `
    SELECT id, name, email, phone, address, profession, rating, reviewCount, successRate, isAvailable, profile_photo
    FROM workers
    ${where}
    ORDER BY ${orderBy}
  `;

  db.query(query, params, (err, results) => {
    if (err) {
      console.error('Error fetching workers:', err);
      return res.status(500).json({ message: 'Failed to fetch workers' });
    }
    res.json(results);
  });
});

// Accept a job (Firestore)
router.post('/worker/accept', authenticateToken, async (req, res) => {
  const { jobId, workerId } = req.body;
  try {
    const jobRef = db.collection('job_requests').doc(jobId);
    const jobDoc = await jobRef.get();
    if (!jobDoc.exists || jobDoc.data().status !== 'pending') {
      return res.status(400).json({ message: 'Job not available' });
    }
    await jobRef.update({ status: 'accepted', assignedWorkerId: workerId });
    res.json({ message: 'Job accepted!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to accept job' });
  }
});

// Fetch a job by ID (Firestore)
router.get('/job/:id', authenticateToken, async (req, res) => {
  const jobId = req.params.id;
  try {
    const jobDoc = await db.collection('job_requests').doc(jobId).get();
    if (!jobDoc.exists) return res.status(404).json({ message: 'Job not found' });
    res.json({ id: jobDoc.id, ...jobDoc.data() });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch job' });
  }
});

// Complete a job (Firestore)
router.post('/jobs/complete', authenticateToken, async (req, res) => {
  const { jobId } = req.body;
  try {
    const jobRef = db.collection('job_requests').doc(jobId);
    await jobRef.update({ status: 'completed' });
    res.json({ message: 'Job marked as completed!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to complete job' });
  }
});

// Cancel a job (Firestore)
router.post('/jobs/cancel', authenticateToken, async (req, res) => {
  const { jobId, reason } = req.body;
  try {
    const jobRef = db.collection('job_requests').doc(jobId);
    await jobRef.update({ status: 'cancelled', cancelReason: reason });
    res.json({ message: 'Job cancelled!' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel job' });
  }
});

// Get worker by ID (Firestore)
router.get('/worker/:id', authenticateToken, async (req, res) => {
  const workerId = req.params.id;
  try {
    const workerDoc = await db.collection('workers').doc(workerId).get();
    if (!workerDoc.exists) return res.status(404).json({ message: 'Worker not found' });
    res.json({ id: workerDoc.id, ...workerDoc.data() });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch worker' });
  }
});

// Add this endpoint for direct notification from Find Workers page
router.post('/notify', async (req, res) => {
  const { workerId } = req.body;
  if (!workerId) return res.status(400).json({ message: 'workerId required' });

  db.query('SELECT * FROM workers WHERE id = ?', [workerId], (err, results) => {
    if (err) {
      console.error('Error finding worker:', err);
      return res.status(500).json({ message: 'Database error' });
    }
    if (!results || results.length === 0) {
      return res.status(404).json({ message: 'Worker not found' });
    }
    const worker = results[0];
    // Emit notification via Socket.IO
    const io = req.app.get('io');
    io.to(`worker_${workerId}`).emit('direct-booking', {
      workerId,
      message: `You have a new booking request!`
    });
    return res.json({ message: 'Notification sent to worker.' });
  });
});

module.exports = router;