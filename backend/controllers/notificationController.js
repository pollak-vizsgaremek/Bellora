import { getDB } from '../config/db.js';

export const getNotifications = async (req, res) => {
  try {
    const db = getDB();
    const userId = req.user.user_id;

    // Get recent favorites on user's items (last 30 days)
    const [favorites] = await db.execute(`
      SELECT 
        f.user_id as favoriter_id,
        u.username as favoriter_name,
        u.profile_image as favoriter_image,
        i.item_id,
        i.title as item_title,
        NOW() as created_at,
        'favorite' as type
      FROM favorites f
      JOIN items i ON f.item_id = i.item_id
      JOIN users u ON f.user_id = u.user_id
      WHERE i.user_id = ? 
      ORDER BY i.item_id DESC
      LIMIT 20
    `, [userId]);

    // Get recent orders for user's items (last 30 days)
    const [orders] = await db.execute(`
      SELECT 
        o.order_id,
        o.buyer_id,
        u.username as buyer_name,
        u.profile_image as buyer_image,
        i.item_id,
        i.title as item_title,
        o.order_date as created_at,
        o.status as order_status,
        'order' as type
      FROM orders o
      JOIN items i ON o.item_id = i.item_id
      JOIN users u ON o.buyer_id = u.user_id
      WHERE o.seller_id = ?
      ORDER BY o.order_date DESC
      LIMIT 20
    `, [userId]);

    // Get recent offers on user's items
    const [offers] = await db.execute(`
      SELECT 
        off.offer_id,
        off.buyer_id,
        u.username as buyer_name,
        u.profile_image as buyer_image,
        i.item_id,
        i.title as item_title,
        off.offer_price,
        off.status as offer_status,
        off.created_at,
        'offer' as type
      FROM offers off
      JOIN items i ON off.item_id = i.item_id
      JOIN users u ON off.buyer_id = u.user_id
      WHERE off.seller_id = ? AND off.status = 'pending'
      ORDER BY off.created_at DESC
      LIMIT 20
    `, [userId]);

    // Combine and sort all notifications
    const allNotifications = [...favorites, ...orders, ...offers].sort((a, b) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });

    res.json({ 
      notifications: allNotifications.slice(0, 20),
      count: allNotifications.length
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const getNotificationCount = async (req, res) => {
  try {
    const db = getDB();
    const userId = req.user.user_id;

    // Count favorites (approximate - based on items the user owns)
    const [favoriteCount] = await db.execute(`
      SELECT COUNT(*) as count
      FROM favorites f
      JOIN items i ON f.item_id = i.item_id
      WHERE i.user_id = ?
    `, [userId]);

    // Count pending orders
    const [orderCount] = await db.execute(`
      SELECT COUNT(*) as count
      FROM orders o
      WHERE o.seller_id = ? AND o.status = 'pending'
    `, [userId]);

    // Count pending offers
    const [offerCount] = await db.execute(`
      SELECT COUNT(*) as count
      FROM offers
      WHERE seller_id = ? AND status = 'pending'
    `, [userId]);

    const totalCount = 
      favoriteCount[0].count + 
      orderCount[0].count + 
      offerCount[0].count;

    res.json({ count: totalCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};
