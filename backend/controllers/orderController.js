import { getDB } from '../config/db.js';

export const createOrder = async (req, res) => {
  try {
    const db = getDB();
    const { item_id } = req.body;
    const buyer_id = req.user.user_id;

    // Check if item exists and is available
    const [items] = await db.execute(
      'SELECT * FROM items WHERE item_id = ?',
      [item_id]
    );

    if (items.length === 0) {
      return res.status(404).json({ message: 'Termék nem található' });
    }

    const item = items[0];

    if (item.status !== 'available') {
      return res.status(400).json({ message: 'Ez a termék már nem elérhető' });
    }

    if (item.user_id === buyer_id) {
      return res.status(400).json({ message: 'Nem vásárolhatod meg a saját termékedet' });
    }

    // Create order
    const [result] = await db.execute(
      'INSERT INTO orders (buyer_id, seller_id, item_id, status) VALUES (?, ?, ?, ?)',
      [buyer_id, item.user_id, item_id, 'pending']
    );

    // Update item status to sold
    await db.execute(
      'UPDATE items SET status = ? WHERE item_id = ?',
      ['sold', item_id]
    );

    res.json({ 
      message: 'Vásárlás sikeres!',
      order_id: result.insertId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const db = getDB();
    const userId = req.user.user_id;

    const [orders] = await db.execute(`
      SELECT 
        o.order_id,
        o.item_id,
        o.order_date,
        o.status,
        i.title,
        i.price,
        i.description,
        u.username as seller_name,
        u.user_id as seller_id,
        (SELECT image_url FROM itemimages WHERE item_id = i.item_id ORDER BY is_primary DESC, display_order LIMIT 1) as image_url
      FROM orders o
      JOIN items i ON o.item_id = i.item_id
      JOIN users u ON o.seller_id = u.user_id
      WHERE o.buyer_id = ?
      ORDER BY o.order_date DESC
    `, [userId]);

    res.json({ orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const getMySales = async (req, res) => {
  try {
    const db = getDB();
    const userId = req.user.user_id;

    const [sales] = await db.execute(`
      SELECT 
        o.order_id,
        o.item_id,
        o.order_date,
        o.status,
        i.title,
        i.price,
        i.description,
        u.username as buyer_name,
        u.user_id as buyer_id,
        (SELECT image_url FROM itemimages WHERE item_id = i.item_id ORDER BY is_primary DESC, display_order LIMIT 1) as image_url
      FROM orders o
      JOIN items i ON o.item_id = i.item_id
      JOIN users u ON o.buyer_id = u.user_id
      WHERE o.seller_id = ?
      ORDER BY o.order_date DESC
    `, [userId]);

    res.json({ sales });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const db = getDB();
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.user_id;

    // Verify the user is the seller
    const [orders] = await db.execute(
      'SELECT seller_id FROM orders WHERE order_id = ?',
      [id]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: 'Rendelés nem található' });
    }

    if (orders[0].seller_id !== userId) {
      return res.status(403).json({ message: 'Nincs jogosultságod módosítani ezt a rendelést' });
    }

    await db.execute(
      'UPDATE orders SET status = ? WHERE order_id = ?',
      [status, id]
    );

    res.json({ message: 'Rendelés státusz frissítve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};
