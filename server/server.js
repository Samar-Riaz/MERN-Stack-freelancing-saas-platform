import { EventEmitter } from 'events';
EventEmitter.defaultMaxListeners = 20;

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';


// 1. Environment Setup
dotenv.config();

console.log('Environment Variables:', {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL ? 'Found' : 'MISSING',
  JWT_SECRET: process.env.JWT_SECRET ? 'Found' : 'MISSING'
});

// 2. Directory Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, 'uploads', 'certificates');
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });

// 3. Route Imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import bidRoutes from './routes/bidRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import freelancerRoutes from './routes/freelancer.js';
// 4. Express Setup
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

// 5. Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/bids', bidRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/freelancer', freelancerRoutes);

// 6. Health Check
app.get('/', (req, res) => res.send('API is running'));
app.get('/api', (req, res) => res.send('API is running'));

// 7. Error Handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Server Error' });
});

// 8. Database Connection
const connectDB = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    process.exit(1);
  }
};

// 9. Start Server with Socket.io
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';

const PORT = process.env.PORT || 5000;
const startServer = async () => {
  await connectDB();
  const server = http.createServer(app);
  const io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST']
    }
  });

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // Join a room for user-to-user messaging
    socket.on('join', (room) => {
      socket.join(room);
    });

    // Handle sending a message
    socket.on('send_message', (data) => {
      // data: { room, message, sender, receiver }
      io.to(data.room).emit('receive_message', data);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
    });
  });

  server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🔗 http://localhost:${PORT}`);
    console.log('🟢 Socket.io enabled');
  });
};

startServer();