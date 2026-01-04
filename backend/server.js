import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();

await connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`A szerver fut a ${PORT} porton`);
});