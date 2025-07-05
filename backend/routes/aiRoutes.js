const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');
const axios = require('axios');
const { findMatchingWorkers, simulateEmergencyResponse } = require('../services/aiService');
const authMiddleware = require('./authMiddleware');
const clientAuthenticateToken = require('./clientAuthMiddleware');
const db = require('../firebase'); // Firestore

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Configure multer for AI image upload (original 'upload' in aiRoutes.js)
const aiImageStorage = multer.memoryStorage();
const aiImageUpload = multer({
  storage: aiImageStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed for AI upload'));
    }
  },
});

// Configure multer for Job Request file uploads (disk storage)
const jobRequestStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/'; // Relative to backend root (servlyn1/signup1/backend/uploads)
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const jobRequestUpload = multer({ storage: jobRequestStorage });

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Email sending function (copied from jobRequest.js)
const sendJobAcceptedEmail = async (jobDetails) => {
  try {
    await transporter.sendMail({
      from: '"Servlyn" <' + process.env.EMAIL_USER + '>',
      to: jobDetails.email,
      subject: 'Your Service Request Has Been Accepted!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #123459;">Service Request Accepted!</h1>
          <p>Dear ${jobDetails.name},</p>
          <p>Great news! Your service request has been accepted.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            <h3 style="color: #123459; margin-top: 0;">Service Details:</h3>
            <p>Service Type: ${jobDetails.serviceType}</p>
            <p>Date: ${new Date(jobDetails.date).toLocaleDateString()}</p>
            <p>Time: ${jobDetails.timeSlot}</p>
            <p>Address: ${jobDetails.address}</p>
            ${jobDetails.service_frequency ? `<p>Service Frequency: ${jobDetails.service_frequency}</p>` : ''}
          </div>
          <p>Your service provider will contact you shortly at ${jobDetails.phone_number}.</p>
          <p>Thank you for choosing Servlyn!</p>
        </div>
      `
    });
    console.log("✅ Email sent successfully to", jobDetails.email);
    return true;
  } catch (err) {
    console.error("❌ Email sending failed:", err);
    return false;
  }
};

// Geocoding helper function (copied from jobRequest.js)
const geocode = async (address) => {
  try {
    const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
      params: {
        q: address,
        key: process.env.OPENCAGE_API_KEY,
        limit: 1
      }
    });

    const result = response.data.results[0];
    if (!result) return null;

    console.log('Geocoding address:', address);
    console.log('Geocoding result:', result);

    return {
      lat: result.geometry.lat,
      lng: result.geometry.lng
    };
  } catch (error) {
    console.error('OpenCage error:', error.message);
    return null;
  }
};

// Route for worker matching (uses aiImageUpload)
router.post('/match-workers', aiImageUpload.single('image'), async (req, res) => {
  try {
    const { service } = req.body;
    if (!service) return res.status(400).json({ error: 'Service type is required' });
    const matchingWorkers = await findMatchingWorkers(db, service);
    if (!matchingWorkers.length) return res.status(404).json({ error: 'No matching workers found' });
    res.json({
      workers: matchingWorkers.map(worker => ({
        id: worker.id,
        name: worker.name,
        image: worker.profile_photo,
        rating: worker.rating,
        reviewCount: worker.reviewCount,
        experience: worker.experience,
        successRate: worker.successRate,
        skills: worker.specializations,
        isAvailable: worker.isAvailable,
        matchScore: worker.matchScore
      }))
    });
  } catch (error) {
    console.error('Error in match-workers route (aiRoutes):', error);
    res.status(500).json({ error: 'Failed to find matching workers' });
  }
});

// Route for emergency trigger
router.post('/emergency/trigger', async (req, res) => {
  try {
    const { location, userId } = req.body;
    const result = await simulateEmergencyResponse(userId, location);
    
    if (result.success) {
      res.json({ success: true, message: result.message });
    } else {
      res.status(500).json({ success: false, message: result.message });
    }
  } catch (error) {
    console.error('Error in emergency trigger route (aiRoutes):', error);
    res.status(500).json({ success: false, message: 'Failed to trigger emergency response.' });
  }
});

// NEW: GET bookings for the logged-in client
router.get('/my-bookings', clientAuthenticateToken, async (req, res) => {
  try {
    const clientId = req.user.id;
    const snapshot = await db.collection('job_requests').where('client_id', '==', clientId).get();
    const bookings = [];
    snapshot.forEach(doc => bookings.push({ id: doc.id, ...doc.data() }));
    res.json(bookings);
  } catch (err) {
    console.error('Error fetching client bookings:', err);
    res.status(500).json({ message: 'Failed to retrieve bookings.' });
  }
});

// NEW: POST: Create new job request (copied from jobRequest.js)
router.post('/job-request', clientAuthenticateToken, jobRequestUpload.array('documents', 5), async (req, res) => {
  const jobData = req.body;
  try {
    await db.collection('job_requests').add({
      ...jobData,
      service_type: jobData.serviceType || jobData.service_type,
      status: 'pending',
      createdAt: new Date()
    });
    res.status(201).json({ message: 'Job request submitted!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// NEW: Cancel job request endpoint
router.post('/job-request/:id/cancel', clientAuthenticateToken, async (req, res) => {
  try {
    const jobId = req.params.id;
    const clientId = req.user.id;
    const jobRef = db.collection('job_requests').doc(jobId);
    const jobDoc = await jobRef.get();
    if (!jobDoc.exists || jobDoc.data().client_id !== clientId) {
      return res.status(404).json({ message: 'Job not found or cannot be cancelled.' });
    }
    await jobRef.update({ status: 'cancelled' });
    res.json({ message: 'Job request cancelled.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel job request.' });
  }
});

// Geocode API endpoint for address lookup
router.get('/geocode', async (req, res) => {
  const address = req.query.address;
  if (!address) return res.status(400).json({ error: 'Address is required' });
  try {
    const coords = await geocode(address);
    if (!coords) {
      return res.status(404).json({ error: 'No location found' });
    }
    res.json(coords);
  } catch (err) {
    console.error('Geocode route error:', err);
    res.status(500).json({ error: 'Geocoding failed' });
  }
});

// In your signup route file
router.post('/signup', async (req, res) => {
  const { name, email, phone, address, password } = req.body;
  try {
    // Hash password as before!
    await db.collection('signup').add({
      name, email, phone, address, password, createdAt: new Date()
    });
    res.status(201).json({ message: 'Signup successful!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/users', async (req, res) => {
  const { name, email, phone, location, password } = req.body;
  try {
    await db.collection('users').add({
      name, email, phone, location, password, createdAt: new Date()
    });
    res.status(201).json({ message: 'User created!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/worker/signup', async (req, res) => {
  const { name, email, phone, address, password, profession, skills, experience, description, certifications } = req.body;
  try {
    await db.collection('workers').add({
      name, email, phone, address, password, profession, skills, experience, description, certifications, createdAt: new Date()
    });
    res.status(201).json({ message: 'Worker registered!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/worker/portfolio', async (req, res) => {
  const { worker_id, skills, experience, description, files, profile_photo } = req.body;
  try {
    await db.collection('worker_portfolios').add({
      worker_id, skills, experience, description, files, profile_photo, createdAt: new Date()
    });
    res.status(201).json({ message: 'Portfolio created!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/services', async (req, res) => {
  const { name, category, description, keywords, averagePrice, imageUrl, isActive } = req.body;
  try {
    await db.collection('services').add({
      name, category, description, keywords, averagePrice, imageUrl, isActive, createdAt: new Date()
    });
    res.status(201).json({ message: 'Service added!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 