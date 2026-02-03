import { getDB } from '../config/db.js';
import bcrypt from 'bcrypt';

export const getUserById = async (req, res) => {
  try {
    const db = getDB();
    const [users] = await db.execute(
      'SELECT user_id, username, full_name, profile_image, city, join_date FROM users WHERE user_id = ?',
      [req.params.userId]
    );
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Felhasználó nem található' });
    }
    
    res.json({ user: users[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const getUserItems = async (req, res) => {
  try {
    const db = getDB();
    const [items] = await db.execute(`
      SELECT i.*, 
             (SELECT image_url FROM itemimages WHERE item_id = i.item_id ORDER BY display_order ASC LIMIT 1) as image_url
      FROM items i
      WHERE i.user_id = ? AND i.status = 'available'
      ORDER BY i.created_at DESC
    `, [req.params.userId]);
    
    res.json({ items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const uploadProfileImage = async (req, res) => {
  try {
    const db = getDB();
    if (!req.file) {
      return res.status(400).json({ message: 'Nincs kép feltöltve' });
    }
    
    const imageUrl = `/uploads/${req.file.filename}`;
    
    await db.execute(
      'UPDATE users SET profile_image = ? WHERE user_id = ?',
      [imageUrl, req.user.user_id]
    );
    
    res.json({ message: 'Profilkép feltöltve', image_url: imageUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const db = getDB();
    const { full_name, phone, address, city, postal_code } = req.body;
    
    await db.execute(
      'UPDATE users SET full_name = ?, phone = ?, address = ?, city = ?, postal_code = ? WHERE user_id = ?',
      [full_name, phone, address, city, postal_code, req.user.user_id]
    );
    
    res.json({ message: 'Profil frissítve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const changePassword = async (req, res) => {
  try {
    const db = getDB();
    const { old_password, new_password } = req.body;
    
    const [users] = await db.execute('SELECT password_hash FROM users WHERE user_id = ?', [req.user.user_id]);
    
    if (users.length === 0) {
      return res.status(404).json({ message: 'Felhasználó nem található' });
    }
    
    const valid = await bcrypt.compare(old_password, users[0].password_hash);
    if (!valid) {
      return res.status(401).json({ message: 'Hibás jelenlegi jelszó' });
    }
    
    const hashedPassword = await bcrypt.hash(new_password, 10);
    await db.execute('UPDATE users SET password_hash = ? WHERE user_id = ?', [hashedPassword, req.user.user_id]);
    
    res.json({ message: 'Jelszó megváltoztatva' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const db = getDB();
    await db.execute('DELETE FROM favorites WHERE user_id = ?', [req.user.user_id]);
    await db.execute('DELETE FROM messages WHERE sender_id = ? OR receiver_id = ?', [req.user.user_id, req.user.user_id]);
    await db.execute('DELETE FROM itemimages WHERE item_id IN (SELECT item_id FROM items WHERE user_id = ?)', [req.user.user_id]);
    await db.execute('DELETE FROM items WHERE user_id = ?', [req.user.user_id]);
    await db.execute('DELETE FROM users WHERE user_id = ?', [req.user.user_id]);
    
    res.json({ message: 'Fiók törölve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};
