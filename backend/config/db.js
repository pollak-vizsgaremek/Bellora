import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let db;

export const connectDB = async () => {
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME 
    });
    console.log('Adatbázis kapcsolódva');
    return db;
  } catch (error) {
    console.error('Adatbázis kapcsolódási hiba:', error);
    process.exit(1);
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error('Adatbázis nincs inicializálva');
  }
  return db;
};

export default { connectDB, getDB };