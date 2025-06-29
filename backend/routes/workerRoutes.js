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
const professionToServiceTypes = {
  plumber: ['plumber', 'plumbing'],
  maid: ['maid'],
  electrician: ['electrician', 'electrical'],
  'deep-cleaner': ['deep-cleaner', 'deep-cleaning'],
  // Add more mappings as needed
};

router.get('/jobs/pending', authenticateToken, async (req, res) => {
  const db = req.app.locals.db;
  const profession = req.worker.profession.toLowerCase();
  const serviceTypes = professionToServiceTypes[profession] || [profession];

  // Use SQL IN clause for multiple service types
  const placeholders = serviceTypes.map(() => '?').join(',');
  const query = `SELECT * FROM job_requests WHERE service_type IN (${placeholders}) AND status = ?`;

  db.query(query, [...serviceTypes, 'pending'], (err, results) => {
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

router.post('/accept', authenticateToken, (req, res) => {
  const db = req.app.locals.db;
  const workerId = req.worker.id;
  const profession = req.worker.profession.toLowerCase();
  const allowedServiceTypes = professionToServiceTypes[profession] || [profession];
  const { jobId } = req.body;

  // Fetch the job's service_type
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

    // Use mapping for profession-service_type match
    if (!allowedServiceTypes.includes(service_type.toLowerCase())) {
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
      // Notify the client (customer) via Socket.IO
      const io = req.app.get('io');
      // Get client_id and worker name for notification
      db.query('SELECT client_id FROM job_requests WHERE id = ?', [jobId], (clientErr, clientResult) => {
        if (!clientErr && clientResult.length > 0) {
          const clientId = clientResult[0].client_id;
          // Get worker name
          db.query('SELECT name FROM workers WHERE id = ?', [workerId], (workerErr, workerResult) => {
            const workerName = (!workerErr && workerResult.length > 0) ? workerResult[0].name : 'A worker';
            io.to(`client_${clientId}`).emit('job-accepted', {
              jobId,
              workerName,
              message: `Your job has been accepted by ${workerName} and they are on their way!`
            });
          });
        }
      });
      res.json({ message: 'Job accepted successfully!' });
    });
  });
});

router.post('/jobs/complete', authenticateToken, (req, res) => {
  const db = req.app.locals.db;
  const workerId = req.worker.id;
  const { jobId } = req.body;

  // Only allow the assigned worker to complete the job
  const query = 'UPDATE job_requests SET status = ? WHERE id = ? AND assignedWorkerId = ?';
  db.query(query, ['completed', jobId, workerId], (err, result) => {
    if (err) {
      console.error('Error marking job as completed:', err);
      return res.status(500).json({ message: 'Failed to mark job as completed' });
    }
    if (result.affectedRows === 0) {
      return res.status(403).json({ message: 'Not authorized or job not found' });
    }
    // Fetch job and customer details for email
    db.query('SELECT j.*, c.email AS customerEmail, c.name AS customerName, w.name AS workerName FROM job_requests j JOIN clients c ON j.client_id = c.id JOIN workers w ON j.assignedWorkerId = w.id WHERE j.id = ?', [jobId], async (fetchErr, jobResults) => {
      if (!fetchErr && jobResults.length > 0) {
        const job = jobResults[0];
        // Generate invoice/summary details (placeholder)
        const summaryHtml = `
          <div>
            <strong>Service:</strong> ${job.service_type}<br>
            <strong>Date:</strong> ${job.date}<br>
            <strong>Worker:</strong> ${job.workerName}<br>
            <strong>Address:</strong> ${job.address}<br>
            <strong>Total:</strong> ₹${job.total_amount || 'N/A'}<br>
            <strong>Tax:</strong> ₹${job.tax_amount || 'N/A'}<br>
          </div>
        `;
        await sendJobAcceptedEmail({
          toEmail: job.customerEmail,
          customerName: job.customerName,
          workerName: job.workerName,
          jobDetails: summaryHtml
        });
      }
    });
    // Notify the client (customer) via Socket.IO
    const io = req.app.get('io');
    db.query('SELECT client_id FROM job_requests WHERE id = ?', [jobId], (clientErr, clientResult) => {
      if (!clientErr && clientResult.length > 0) {
        const clientId = clientResult[0].client_id;
        io.to(`client_${clientId}`).emit('job-completed', {
          jobId,
          message: 'Your job has been marked as completed by the worker. Please confirm and leave a review.'
        });
      }
    });
    res.json({ message: 'Job marked as completed!' });
  });
});

// Cancel job route - allows workers to cancel jobs they've accepted
router.post('/jobs/cancel', authenticateToken, (req, res) => {
  const db = req.app.locals.db;
  const workerId = req.worker.id;
  const { jobId, reason } = req.body;

  // Only allow the assigned worker to cancel the job
  const query = 'UPDATE job_requests SET status = ?, assignedWorkerId = NULL WHERE id = ? AND assignedWorkerId = ?';
  db.query(query, ['pending', jobId, workerId], (err, result) => {
    if (err) {
      console.error('Error cancelling job:', err);
      return res.status(500).json({ message: 'Failed to cancel job' });
    }
    if (result.affectedRows === 0) {
      return res.status(403).json({ message: 'Not authorized or job not found' });
    }
    
    // Notify the client (customer) via Socket.IO
    const io = req.app.get('io');
    db.query('SELECT client_id FROM job_requests WHERE id = ?', [jobId], (clientErr, clientResult) => {
      if (!clientErr && clientResult.length > 0) {
        const clientId = clientResult[0].client_id;
        // Get worker name for notification
        db.query('SELECT name FROM workers WHERE id = ?', [workerId], (workerErr, workerResult) => {
          const workerName = (!workerErr && workerResult.length > 0) ? workerResult[0].name : 'A worker';
          io.to(`client_${clientId}`).emit('job-cancelled', {
            jobId,
            workerName,
            reason: reason || 'No reason provided',
            message: `Your job has been cancelled by ${workerName}. The job is now available for other workers.`
          });
        });
      }
    });
    res.json({ message: 'Job cancelled successfully!' });
  });
});

// Add this endpoint for direct notification from Find Workers page
router.post('/notify', async (req, res) => {
  const db = req.app.locals.db;
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