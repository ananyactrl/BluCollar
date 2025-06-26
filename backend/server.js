const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const mysql = require('mysql2');
const http = require('http');
const { Server } = require('socket.io');
const db = require('./database'); // adjust path if needed

// Import routes
const authRoutes = require('./routes/authRoutes');
const workerRoutes = require('./routes/workerRoutes');
const aiRoutes = require('./routes/aiRoutes');

// Load environment variables
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

app.set('io', io);

io.on('connection', (socket) => {
  console.log('🔌 Client connected via Socket.IO');

  socket.on('join-room', (profession) => {
    socket.join(profession);
    console.log(`👷 Joined room: ${profession}`);
  });

  socket.on('disconnect', () => {
    console.log('❌ Client disconnected');
  });

  // Join a job room
  socket.on('joinRoom', ({ job_id }) => {
    socket.join(`job_${job_id}`);
  });

  // Handle sending a message
  socket.on('sendMessage', async (data) => {
    const { job_id, sender_id, sender_role, message } = data;
    // Save to DB
    try {
      await db.query(
        'INSERT INTO messages (job_id, sender_id, sender_role, message) VALUES (?, ?, ?, ?)',
        [job_id, sender_id, sender_role, message]
      );
      // Broadcast to room
      io.to(`job_${job_id}`).emit('receiveMessage', {
        job_id,
        sender_id,
        sender_role,
        message,
        created_at: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error saving message:', err);
    }
  });
});

// Middleware

app.use((req, res, next) => {
  console.log('Request Origin:', req.headers.origin);
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

console.log('🧪 Render ENV:', {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  database: process.env.DB_NAME
});

// --- CORS Configuration ---
const devOrigins = ['http://localhost:5173'];
const prodOrigins = [
  'http://localhost:5173',
  'https://blucollar-cu373rm91-ananya-singhs-projects-2388bc61.vercel.app',
  'https://blucollar.vercel.app'
  // Add more production domains as needed
];

const allowedOrigins = process.env.NODE_ENV === 'production' ? prodOrigins : devOrigins;

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true
}));

// ✅ Create MySQL Connection
const dbConnection = mysql.createConnection({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// ✅ Only start server AFTER DB connects
dbConnection.connect((err) => {
  if (err) {
    console.error('❌ Central MySQL DB connection error:', err.message);
    process.exit(1);
  } else {
    console.log('✅ Central MySQL DB connected successfully!');

    // Make DB available to routes
    app.locals.db = dbConnection;

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/worker', workerRoutes);
    app.use('/api', aiRoutes);

    // Add a REST endpoint to fetch messages for a job
    app.get('/api/messages/:job_id', async (req, res) => {
      const { job_id } = req.params;
      try {
        const [rows] = await db.query(
          'SELECT * FROM messages WHERE job_id = ? ORDER BY created_at ASC',
          [job_id]
        );
        res.json(rows);
      } catch (err) {
        res.status(500).json({ error: 'Failed to fetch messages' });
      }
    });

    // Root route
    app.get('/', (req, res) => {
      res.send('Backend is live 🚀');
    });

    // Error handler
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    });

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
      console.log(`🚀 Server is live on port ${PORT}`);
    });

    // --- Keep-alive ping for Render.com ---
    if (process.env.NODE_ENV === 'production') {
      const axios = require('axios');
      setInterval(() => {
        axios.get('https://blucollar-fku9.onrender.com/')
          .then(() => {
            console.log('✅ Keep-alive ping successful');
          })
          .catch((err) => {
            console.error('❌ Keep-alive ping failed:', err.message);
          });
      }, 10 * 60 * 1000); // every 10 minutes
    }
  }
});
