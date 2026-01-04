import { getDB } from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const db = getDB();
    const { username, email, password } = req.body;
    
    const [existing] = await db.execute('SELECT * FROM users WHERE email = ? OR username = ?', [email, username]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'A felhasználó már létezik' });
    }
    
    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, password_hash]
    );
    
    const token = jwt.sign({ user_id: result.insertId, username, email }, process.env.JWT_SECRET);
    
    res.json({ 
      message: 'Sikeres regisztráció',
      token,
      user: { user_id: result.insertId, username, email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const login = async (req, res) => {
  try {
    const db = getDB();
    const { email, password } = req.body;
    
    const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(401).json({ message: 'Hibás email vagy jelszó' });
    }
    
    const user = users[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Hibás email vagy jelszó' });
    }
    
    const token = jwt.sign({ user_id: user.user_id, username: user.username, email: user.email }, process.env.JWT_SECRET);
    
    res.json({
      message: 'Sikeres bejelentkezés',
      token,
      user: { user_id: user.user_id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const db = getDB();
    const [users] = await db.execute(
      'SELECT user_id, username, email, full_name, phone, address, city, postal_code, profile_image, join_date FROM users WHERE user_id = ?', 
      [req.user.user_id]
    );
    res.json({ user: users[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};