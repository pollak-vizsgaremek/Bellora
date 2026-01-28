import { getDB } from '../config/db.js';

export const getFavorites = async (req, res) => {
  try {
    const db = getDB();
    const [items] = await db.execute(`
      SELECT i.*, u.username as seller_name, u.profile_image as seller_image,
             (SELECT image_url FROM itemimages WHERE item_id = i.item_id ORDER BY display_order ASC LIMIT 1) as image_url
      FROM favorites f
      JOIN items i ON f.item_id = i.item_id
      JOIN users u ON i.user_id = u.user_id
      WHERE f.user_id = ?
    `, [req.user.user_id]);
    res.json({ favorites: items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const db = getDB();
    const { item_id } = req.body;
    await db.execute('INSERT IGNORE INTO favorites (user_id, item_id) VALUES (?, ?)', [req.user.user_id, item_id]);
    res.json({ message: 'Hozzáadva a kedvencekhez' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    const db = getDB();
    await db.execute('DELETE FROM favorites WHERE user_id = ? AND item_id = ?', [req.user.user_id, req.params.itemId]);
    res.json({ message: 'Eltávolítva a kedvencekből' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};
