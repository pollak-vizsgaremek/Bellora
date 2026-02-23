import { getDB } from '../config/db.js';

export const getMessages = async (req, res) => {
  try {
    const db = getDB();
    const [messages] = await db.execute(`
      SELECT m.*, 
             u1.username as sender_name, 
             u2.username as receiver_name, 
             o.status as offer_status,
             o.offer_price,
             o.counter_price,
             i.item_id,
             i.title as item_title,
             i.price as item_price,
             (SELECT image_url FROM itemimages WHERE item_id = i.item_id ORDER BY is_primary DESC, display_order LIMIT 1) as item_image
      FROM messages m
      JOIN users u1 ON m.sender_id = u1.user_id
      JOIN users u2 ON m.receiver_id = u2.user_id
      LEFT JOIN offers o ON m.offer_id = o.offer_id
      LEFT JOIN items i ON o.item_id = i.item_id
      WHERE (m.sender_id = ? AND m.receiver_id = ?)
         OR (m.sender_id = ? AND m.receiver_id = ?)
      ORDER BY m.sent_at ASC
    `, [req.user.user_id, req.params.userId, req.params.userId, req.user.user_id]);
    res.json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const db = getDB();
    const { receiver_id, content } = req.body;
    await db.execute(
      'INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)',
      [req.user.user_id, receiver_id, content]
    );
    res.json({ message: 'Üzenet elküldve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const getConversations = async (req, res) => {
  try {
    const db = getDB();
    const [conversations] = await db.execute(`
      SELECT DISTINCT
        CASE 
          WHEN m.sender_id = ? THEN m.receiver_id
          ELSE m.sender_id
        END as other_user_id,
        u.username as other_user_name,
        (SELECT content FROM messages 
         WHERE (sender_id = ? AND receiver_id = other_user_id) 
            OR (sender_id = other_user_id AND receiver_id = ?)
         ORDER BY sent_at DESC LIMIT 1) as last_message,
        (SELECT sent_at FROM messages 
         WHERE (sender_id = ? AND receiver_id = other_user_id) 
            OR (sender_id = other_user_id AND receiver_id = ?)
         ORDER BY sent_at DESC LIMIT 1) as last_message_time
      FROM messages m
      JOIN users u ON u.user_id = CASE 
        WHEN m.sender_id = ? THEN m.receiver_id
        ELSE m.sender_id
      END
      WHERE m.sender_id = ? OR m.receiver_id = ?
      ORDER BY last_message_time DESC
    `, [req.user.user_id, req.user.user_id, req.user.user_id, req.user.user_id, req.user.user_id, req.user.user_id, req.user.user_id, req.user.user_id]);
    res.json({ conversations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};
