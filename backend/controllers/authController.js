import prisma from '../config/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    const existing = await prisma.users.findFirst({
      where: {
        OR: [{ email }, { username }]
      }
    });
    if (existing) {
      return res.status(400).json({ message: 'A felhasználó már létezik' });
    }
    
    const password_hash = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: { username, email, password_hash }
    });
    
    const token = jwt.sign({ user_id: user.user_id, username, email, role: user.role }, process.env.JWT_SECRET);
    
    res.json({ 
      message: 'Sikeres regisztráció',
      token,
      user: { user_id: user.user_id, username, email, role: user.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Hibás email vagy jelszó' });
    }
    
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Hibás email vagy jelszó' });
    }
    
    const token = jwt.sign({ user_id: user.user_id, username: user.username, email: user.email, role: user.role }, process.env.JWT_SECRET);
    
    res.json({
      message: 'Sikeres bejelentkezés',
      token,
      user: { user_id: user.user_id, username: user.username, email: user.email, profile_image: user.profile_image, role: user.role }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { user_id: req.user.user_id },
      select: {
        user_id: true,
        username: true,
        email: true,
        full_name: true,
        phone: true,
        address: true,
        city: true,
        postal_code: true,
        profile_image: true,
        join_date: true,
        role: true
      }
    });
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};