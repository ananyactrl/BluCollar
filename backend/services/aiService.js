// No longer importing TensorFlow.js node as it's being removed
// No longer importing Worker and Service models directly here, as we'll use a passed 'db' connection.

// Removed loadModel function and serviceCategories

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Secret key for JWT
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey'; 

// Worker matching algorithm
// 'db' connection will be passed as an argument
async function findMatchingWorkers(db, serviceType) {
  // Fetch all workers from Firestore
  const snapshot = await db.collection('workers').get();
  const workers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Score and filter workers
  const scoredWorkers = workers.map(worker => {
    const score = calculateMatchScore(worker, serviceType);
    return { ...worker, matchScore: score };
  });

  const topMatches = scoredWorkers
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 5);

  return topMatches;
}

// Calculate match score for a worker
function calculateMatchScore(worker, serviceType) {
  let score = 0;
  
  // Base score from rating (use worker.rating directly as it's float in DB)
  score += (worker.rating || 0) * 20;
  
  // Experience bonus (worker.experience is already number here)
  score += Math.min((worker.experience || 0) * 5, 25);
  
  // Service type match - use worker.specializations which is now parsed
  if (worker.specializations && Array.isArray(worker.specializations) && worker.specializations.includes(serviceType)) {
    score += 30;
  }
  
  // Success rate bonus (worker.successRate is float in DB)
  score += (worker.successRate || 0) * 0.2;
  
  // Review count bonus (worker.reviewCount is int in DB)
  score += Math.min((worker.reviewCount || 0) * 0.1, 10);
  
  // Availability bonus (worker.isAvailable is tinyint(1) in DB, treated as boolean)
  if (worker.isAvailable) {
    score += 15;
  }
  
  return score;
}

// Authenticate worker for login
async function authenticateWorker(db, emailOrPhone, password) {
  // Try to find by email
  let snapshot = await db.collection('workers')
    .where('email', '==', emailOrPhone)
    .get();
  let workerDoc = snapshot.empty ? null : snapshot.docs[0];

  // If not found by email, try by phone
  if (!workerDoc) {
    const phoneSnap = await db.collection('workers')
      .where('phone', '==', emailOrPhone)
      .get();
    workerDoc = phoneSnap.empty ? null : phoneSnap.docs[0];
  }

  if (!workerDoc) throw new Error('Worker not found');
  const worker = workerDoc.data();

  const isMatch = await bcrypt.compare(password, worker.password);

  if (!isMatch) {
    throw new Error('Invalid credentials.');
  }

  // Return the worker data (or whatever you need)
  return worker;
}

// Get worker profile by ID
async function getWorkerProfile(db, workerId) {
  const doc = await db.collection('workers').doc(workerId).get();
  if (!doc.exists) throw new Error('Worker not found');
  return { id: doc.id, ...doc.data() };
}

// Get worker dashboard statistics
async function getWorkerDashboardStats(db, workerId) {
  // Count total jobs (accepted, completed, in_progress)
  const jobsSnap = await db.collection('job_requests')
    .where('assignedWorkerId', '==', workerId)
    .where('status', 'in', ['accepted', 'completed', 'in_progress'])
    .get();
  const totalJobs = jobsSnap.size;

  // Count pending jobs (accepted only)
  const pendingSnap = await db.collection('job_requests')
    .where('assignedWorkerId', '==', workerId)
    .where('status', '==', 'accepted')
    .get();
  const pendingJobs = pendingSnap.size;

  // Sum total earnings for completed jobs
  const completedSnap = await db.collection('job_requests')
    .where('assignedWorkerId', '==', workerId)
    .where('status', '==', 'completed')
    .get();
  let totalEarnings = 0;
  completedSnap.forEach(doc => {
    const data = doc.data();
    totalEarnings += data.total_amount || 0;
  });

  return {
    totalJobs,
    pendingJobs,
    totalEarnings
  };
}

// Get ongoing jobs for a worker
async function getOngoingWorkerJobs(db, workerId) {
  const snapshot = await db.collection('job_requests')
    .where('assignedWorkerId', '==', workerId)
    .where('status', 'in', ['accepted', 'in_progress'])
    .orderBy('date', 'asc')
    .orderBy('time', 'asc')
    .get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Get past jobs for a worker
async function getPastWorkerJobs(db, workerId, { status, sortBy, order }) {
  let query = db.collection('job_requests')
    .where('assignedWorkerId', '==', workerId)
    .where('status', 'in', ['completed', 'cancelled']);

  if (status && (status === 'completed' || status === 'cancelled')) {
    query = query.where('status', '==', status);
  }

  // Firestore requires orderBy fields to be indexed and present in the documents
  const validSortBy = ['date', 'total_amount', 'status'];
  const validOrder = ['asc', 'desc'];
  let finalSortBy = 'date';
  if (sortBy && validSortBy.includes(sortBy)) {
    finalSortBy = sortBy;
  }
  let finalOrder = 'desc';
  if (order && validOrder.includes(order.toLowerCase())) {
    finalOrder = order.toLowerCase();
  }
  query = query.orderBy(finalSortBy, finalOrder);

  const snapshot = await query.get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Example: Get worker by email or phone (Firestore)
async function getWorkerByEmailOrPhone(db, emailOrPhone) {
  let snapshot = await db.collection('workers').where('email', '==', emailOrPhone).get();
  let workerDoc = snapshot.empty ? null : snapshot.docs[0];
  if (!workerDoc) {
    snapshot = await db.collection('workers').where('phone', '==', emailOrPhone).get();
    workerDoc = snapshot.empty ? null : snapshot.docs[0];
  }
  if (!workerDoc) throw new Error('Worker not found');
  return workerDoc.data();
}

// Example: Add a new worker (Firestore)
async function addWorker(db, workerData) {
  await db.collection('workers').add(workerData);
}

// Example: Get all workers (Firestore)
async function getAllWorkers(db) {
  const snapshot = await db.collection('workers').get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

module.exports = {
  findMatchingWorkers,
  simulateFaceVerification: async (facePhotoPath) => {
    console.log(`Simulating facial verification for: ${facePhotoPath}`);
    // Simulate a successful verification for now
    // In a real application, you would integrate with a biometric API here.
    return { success: true, message: "Facial verification successful." };
    // To simulate failure, you could return: return { success: false, message: "Face not recognized or verification failed." };
  },
  simulateEmergencyResponse: async (userId, location) => {
    console.log(`Emergency triggered by user ${userId} at location:`, location);
    // In a real application, this would send alerts to emergency services,
    // notify administrators, log the incident, etc.
    return { success: true, message: "Emergency signal processed." };
  },
  authenticateWorker,
  getWorkerProfile,
  getWorkerDashboardStats,
  getOngoingWorkerJobs,
  getPastWorkerJobs,
  getWorkerByEmailOrPhone,
  addWorker,
  getAllWorkers
}; 