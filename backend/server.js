require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);

// Log NODE_ENV
console.log('🛠️ NODE_ENV:', process.env.NODE_ENV);

// --- CORS Configuration ---
const allowedOrigins = [
  'http://localhost:5173',
  'https://blucollar.vercel.app',
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Handle preflight requests

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

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
  socket.on('joinRoom', ({ job_id }) => {
    socket.join(`job_${job_id}`);
  });
  // You can add more socket events as needed
});

// --- ROUTES ---
const aiRoutes = require('./routes/aiRoutes');
app.use('/api/ai', aiRoutes);

// Health check
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

console.log(process.env.FIREBASE_CREDENTIALS_JSON);
