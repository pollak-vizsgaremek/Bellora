import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import userRoutes from './routes/userRoutes.js';
import { authenticateToken } from './middleware/auth.js';
import { getMyItems } from './controllers/itemController.js';
import { getConversations } from './controllers/messageController.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

await connectDB();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/users', userRoutes);

app.get('/api/my-items', authenticateToken, getMyItems);
app.get('/api/conversations', authenticateToken, getConversations);

const connectedUsers = new Map();

io.on('connection', (socket) => {
  console.log('Felhasználó csatlakozott:', socket.id);
  
  socket.on('user_connected', (userId) => {
    connectedUsers.set(userId, socket.id);
  });
  
  socket.on('send_message', (data) => {
    const receiverSocketId = connectedUsers.get(data.receiver_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_message', data);
    }
  });
  
  socket.on('disconnect', () => {
    for (const [userId, socketId] of connectedUsers.entries()) {
      if (socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }
  });
});

export const getIO = () => io;
export const getConnectedUsers = () => connectedUsers;

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Szerver fut a ${PORT} porton`);
});
