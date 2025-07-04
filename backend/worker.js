// worker.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const app = express();
const PORT = 5003;
const db = require('./firebase'); // Firestore

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// ✅ Geocoding helper using OpenStreetMap
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

    return {
      lat: result.geometry.lat,
      lng: result.geometry.lng
    };
  } catch (error) {
    console.error('OpenCage error:', error.message);
    return null;
  }
};

// ✅ GET: Geocode API endpoint
app.get('/geocode', async (req, res) => {
  const { address } = req.query;

  if (!address) {
    return res.status(400).json({ message: 'Address is required' });
  }

  const coordinates = await geocode(address);
  if (!coordinates) {
    return res.status(404).json({ message: 'No location found' });
  }

  res.json(coordinates);
});

// ✅ POST: Worker accepts a job
app.post('/worker/accept', (req, res) => {
  const { jobId, workerId } = req.body;

  if (!jobId || !workerId) {
    return res.status(400).json({ message: 'Job ID and Worker ID are required' });
  }

  const updateQuery = `
    UPDATE job_requests
    SET status = 'accepted', assignedWorkerId = ?
    WHERE id = ?;
  `;

  db.query(updateQuery, [workerId, jobId], (err, result) => {
    if (err) {
      console.error('❌ Error updating job:', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    // Fetch job and customer details
    const fetchJobQuery = `SELECT name, email, address, date, timeSlot FROM job_requests WHERE id = ?`;
    db.query(fetchJobQuery, [jobId], async (err2, jobResults) => {
      if (err2 || jobResults.length === 0) {
        return res.status(200).json({ message: 'Job accepted (email not sent)' });
      }

      const job = jobResults[0];
      const jobDetails = `
        Address: ${job.address}<br>
        Date: ${job.date}<br>
        Time Slot: ${job.timeSlot}
      `;

      // Send email notification
      await sendJobAcceptedEmail({
        toEmail: job.email,
        customerName: job.name,
        workerName: "Your Assigned Professional",
        jobDetails
      });

      res.status(200).json({ message: 'Job accepted and notification sent' });
    });
  });
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendJobAcceptedEmail = async ({ toEmail, customerName, workerName, jobDetails }) => {
  try {
    await transporter.sendMail({
      from: '"Servlyn" <ananyasingh172006@gmail.com>',
      to: toEmail,
      subject: `Your Service Request Has Been Accepted! - Servlyn`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #123459;">Service Request Accepted!</h1>
          <p>Dear ${customerName},</p>
          <p>Great news! Your service request has been accepted by <strong>${workerName}</strong>.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #123459; margin-top: 0;">Service Details:</h3>
            ${jobDetails}
          </div>
          <p>Your service provider will contact you shortly.</p>
          <p>Thank you for choosing Servlyn!</p>
        </div>
      `
    });
  } catch (error) {
    console.error('❌ Error sending email:', error.message);
  }
};

// Accept a job
async function acceptJob(jobId, workerId) {
  const jobRef = db.collection('job_requests').doc(jobId);
  const jobDoc = await jobRef.get();
  if (!jobDoc.exists || jobDoc.data().status !== 'pending') {
    throw new Error('Job not available');
  }
  await jobRef.update({ status: 'accepted', assignedWorkerId: workerId });
  return { message: 'Job accepted!' };
}

// Fetch a job by ID
async function fetchJob(jobId) {
  const jobDoc = await db.collection('job_requests').doc(jobId).get();
  if (!jobDoc.exists) throw new Error('Job not found');
  return jobDoc.data();
}

// Complete a job
async function completeJob(jobId) {
  const jobRef = db.collection('job_requests').doc(jobId);
  await jobRef.update({ status: 'completed' });
  return { message: 'Job marked as completed!' };
}

// Cancel a job
async function cancelJob(jobId, reason) {
  const jobRef = db.collection('job_requests').doc(jobId);
  await jobRef.update({ status: 'cancelled', cancelReason: reason });
  return { message: 'Job cancelled!' };
}

// Get worker by ID
async function getWorkerById(workerId) {
  const workerDoc = await db.collection('workers').doc(workerId).get();
  if (!workerDoc.exists) throw new Error('Worker not found');
  return { id: workerDoc.id, ...workerDoc.data() };
}

module.exports = { acceptJob, fetchJob, completeJob, cancelJob, getWorkerById };