import prisma from '../config/db.js';
import bcrypt from 'bcrypt';

export const getUserById = async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: { user_id: parseInt(req.params.userId) },
      select: {
        user_id: true,
        username: true,
        full_name: true,
        profile_image: true,
        city: true,
        join_date: true
      }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Felhasználó nem található' });
    }
    
    res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const getUserItems = async (req, res) => {
  try {
    const items = await prisma.items.findMany({
      where: {
        user_id: parseInt(req.params.userId),
        status: 'available'
      },
      include: {
        itemimages: {
          orderBy: { display_order: 'asc' },
          take: 1,
          select: { image_url: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });
    
    const result = items.map(item => ({
      ...item,
      image_url: item.itemimages[0]?.image_url || null,
      itemimages: undefined
    }));
    
    res.json({ items: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Nincs kép feltöltve' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    
    await prisma.users.update({
      where: { user_id: req.user.user_id },
      data: { profile_image: imageUrl }
    });
    
    res.json({ message: 'Profilkép feltöltve', image_url: imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { full_name, phone, address, city, postal_code } = req.body;
    
    await prisma.users.update({
      where: { user_id: req.user.user_id },
      data: { full_name, phone, address, city, postal_code }
    });
    
    res.json({ message: 'Profil frissítve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { old_password, new_password } = req.body;
    
    const user = await prisma.users.findUnique({
      where: { user_id: req.user.user_id },
      select: { password_hash: true }
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Felhasználó nem található' });
    }
    
    const valid = await bcrypt.compare(old_password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Hibás jelenlegi jelszó' });
    }
    
    const hashedPassword = await bcrypt.hash(new_password, 10);
    await prisma.users.update({
      where: { user_id: req.user.user_id },
      data: { password_hash: hashedPassword }
    });
    
    res.json({ message: 'Jelszó megváltoztatva' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    // Prisma cascading deletes handle related records
    await prisma.users.delete({
      where: { user_id: req.user.user_id }
    });
    
    res.json({ message: 'Fiók törölve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};
