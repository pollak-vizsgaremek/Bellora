import { getDB } from '../config/db.js';

export const getAllItems = async (req, res) => {
  try {
    const db = getDB();
    const [items] = await db.execute(`
      SELECT i.*, u.username as seller_name, 
             (SELECT image_url FROM itemimages WHERE item_id = i.item_id AND is_primary = 1 LIMIT 1) as image_url,
             (SELECT COUNT(*) FROM favorites WHERE item_id = i.item_id) as favorites_count
      FROM items i
      JOIN users u ON i.user_id = u.user_id
      WHERE i.status = 'available'
      ORDER BY i.created_at DESC
    `);
    res.json({ items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const getItemById = async (req, res) => {
  try {
    const db = getDB();
    const [items] = await db.execute(`
      SELECT i.*, u.username as seller_name, u.user_id as seller_id,
             (SELECT COUNT(*) FROM favorites WHERE item_id = i.item_id) as favorites_count
      FROM items i
      JOIN users u ON i.user_id = u.user_id
      WHERE i.item_id = ?
    `, [req.params.id]);
    
    const [images] = await db.execute('SELECT * FROM itemimages WHERE item_id = ? ORDER BY display_order', [req.params.id]);
    
    res.json({ item: { ...items[0], images } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const createItem = async (req, res) => {
  try {
    const db = getDB();
    const { title, description, price, category_id } = req.body;
    const [result] = await db.execute(
      'INSERT INTO items (user_id, category_id, title, description, price) VALUES (?, ?, ?, ?, ?)',
      [req.user.user_id, category_id || 1, title, description, price]
    );
    res.json({ message: 'Hirdetés létrehozva', item_id: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const updateItem = async (req, res) => {
  try {
    const db = getDB();
    const { title, description, price, category_id, status } = req.body;
    const { id } = req.params;
    
    const [items] = await db.execute('SELECT user_id FROM items WHERE item_id = ?', [id]);
    
    if (items.length === 0) {
      return res.status(404).json({ message: 'Hirdetés nem található' });
    }
    
    if (items[0].user_id !== req.user.user_id) {
      return res.status(403).json({ message: 'Nincs jogosultságod szerkeszteni ezt a hirdetést' });
    }
    
    await db.execute(
      'UPDATE items SET title = ?, description = ?, price = ?, category_id = ?, status = ? WHERE item_id = ?',
      [title, description, price, category_id, status, id]
    );
    
    res.json({ message: 'Hirdetés frissítve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    
    const [items] = await db.execute('SELECT user_id FROM items WHERE item_id = ?', [id]);
    
    if (items.length === 0) {
      return res.status(404).json({ message: 'Hirdetés nem található' });
    }
    
    if (items[0].user_id !== req.user.user_id) {
      return res.status(403).json({ message: 'Nincs jogosultságod törölni ezt a hirdetést' });
    }
    
    await db.execute('DELETE FROM itemimages WHERE item_id = ?', [id]);
    await db.execute('DELETE FROM favorites WHERE item_id = ?', [id]);
    await db.execute('DELETE FROM items WHERE item_id = ?', [id]);
    
    res.json({ message: 'Hirdetés törölve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const getMyItems = async (req, res) => {
  try {
    const db = getDB();
    const [items] = await db.execute(`
      SELECT i.*, 
             (SELECT image_url FROM itemimages WHERE item_id = i.item_id ORDER BY display_order ASC LIMIT 1) as image_url,
             (SELECT COUNT(*) FROM favorites WHERE item_id = i.item_id) as favorites_count
      FROM items i
      WHERE i.user_id = ?
      ORDER BY i.created_at DESC
    `, [req.user.user_id]);
    res.json({ items });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const getItemImages = async (req, res) => {
  try {
    const db = getDB();
    const [images] = await db.execute(
      'SELECT * FROM itemimages WHERE item_id = ? ORDER BY is_primary DESC, display_order',
      [req.params.id]
    );
    res.json({ images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const uploadItemImages = async (req, res) => {
  try {
    const db = getDB();
    const [items] = await db.execute('SELECT user_id FROM items WHERE item_id = ?', [req.params.id]);
    if (items.length === 0 || items[0].user_id !== req.user.user_id) {
      return res.status(403).json({ message: 'Nincs jogosultságod' });
    }

    const uploadedImages = [];
    for (const file of req.files) {
      const image_url = '/uploads/' + file.filename;
      const [result] = await db.execute(
        'INSERT INTO itemimages (item_id, image_url, is_primary) VALUES (?, ?, ?)',
        [req.params.id, image_url, 0]
      );
      uploadedImages.push({ image_id: result.insertId, image_url });
    }
    
    res.json({ message: 'Képek feltöltve', images: uploadedImages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const deleteItemImage = async (req, res) => {
  try {
    const db = getDB();
    const [items] = await db.execute('SELECT user_id FROM items WHERE item_id = ?', [req.params.id]);
    if (items.length === 0 || items[0].user_id !== req.user.user_id) {
      return res.status(403).json({ message: 'Nincs jogosultságod' });
    }

    await db.execute('DELETE FROM itemimages WHERE image_id = ? AND item_id = ?', 
      [req.params.imageId, req.params.id]
    );
    
    res.json({ message: 'Kép törölve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const setPrimaryImage = async (req, res) => {
  try {
    const db = getDB();
    const [items] = await db.execute('SELECT user_id FROM items WHERE item_id = ?', [req.params.id]);
    if (items.length === 0 || items[0].user_id !== req.user.user_id) {
      return res.status(403).json({ message: 'Nincs jogosultságod' });
    }

    await db.execute('UPDATE itemimages SET is_primary = 0 WHERE item_id = ?', [req.params.id]);
    await db.execute('UPDATE itemimages SET is_primary = 1 WHERE image_id = ? AND item_id = ?', 
      [req.params.imageId, req.params.id]
    );
    
    res.json({ message: 'Elsődleges kép beállítva' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const reorderImages = async (req, res) => {
  try {
    const db = getDB();
    const [items] = await db.execute('SELECT user_id FROM items WHERE item_id = ?', [req.params.id]);
    if (items.length === 0 || items[0].user_id !== req.user.user_id) {
      return res.status(403).json({ message: 'Nincs jogosultságod' });
    }

    const { images } = req.body;
    
    for (const img of images) {
      await db.execute(
        'UPDATE itemimages SET display_order = ? WHERE image_id = ? AND item_id = ?',
        [img.display_order, img.image_id, req.params.id]
      );
    }
    
    res.json({ message: 'Sorrend frissítve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};
