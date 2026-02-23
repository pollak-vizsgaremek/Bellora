import { getDB } from '../config/db.js';
import { getIO, getConnectedUsers } from '../server.js';

export const createOffer = async (req, res) => {
  try {
    const db = getDB();
    const io = getIO();
    const connectedUsers = getConnectedUsers();
    const { item_id, offer_price } = req.body;
    
    const [users] = await db.execute(
      'SELECT daily_offers_count, last_offer_reset FROM users WHERE user_id = ?',
      [req.user.user_id]
    );
    
    const user = users[0];
    const today = new Date().toISOString().split('T')[0];
    
    let currentCount = user.daily_offers_count || 0;
    if (user.last_offer_reset !== today) {
      currentCount = 0;
      await db.execute(
        'UPDATE users SET daily_offers_count = 0, last_offer_reset = ? WHERE user_id = ?',
        [today, req.user.user_id]
      );
    }
    
    if (currentCount >= 20) {
      return res.status(429).json({ message: 'Elérted a napi 20 ajánlat limitet!' });
    }
    
    const [items] = await db.execute('SELECT user_id, price, title FROM items WHERE item_id = ?', [item_id]);
    
    if (items.length === 0) {
      return res.status(404).json({ message: 'Hirdetés nem található' });
    }
    
    if (items[0].user_id === req.user.user_id) {
      return res.status(400).json({ message: 'Saját hirdetésre nem küldhetsz ajánlatot' });
    }
    
    const minPrice = items[0].price * 0.7;
    
    await db.execute(
      'UPDATE offers SET status = "cancelled" WHERE item_id = ? AND buyer_id = ? AND status = "pending"',
      [item_id, req.user.user_id]
    );
    
    const [result] = await db.execute(
      'INSERT INTO offers (item_id, buyer_id, seller_id, offer_price) VALUES (?, ?, ?, ?)',
      [item_id, req.user.user_id, items[0].user_id, offer_price]
    );
    
    await db.execute(
      'UPDATE users SET daily_offers_count = daily_offers_count + 1, last_offer_reset = ? WHERE user_id = ?',
      [today, req.user.user_id]
    );
    
    const [messageResult] = await db.execute(
      'INSERT INTO messages (sender_id, receiver_id, content, offer_id) VALUES (?, ?, ?, ?)',
      [
        req.user.user_id, 
        items[0].user_id, 
        '',
        result.insertId
      ]
    );
    
    const [senderInfo] = await db.execute('SELECT username FROM users WHERE user_id = ?', [req.user.user_id]);
    
    const payload = {
      message_id: messageResult.insertId,
      sender_id: req.user.user_id,
      receiver_id: items[0].user_id,
      content: '',
      offer_id: result.insertId,
      offer_status: 'pending',
      offer_price: offer_price,
      item_id: item_id,
      item_title: items[0].title,
      item_price: items[0].price,
      sender_name: senderInfo[0].username,
      sent_at: new Date()
    };

    const receiverSocketId = connectedUsers.get(items[0].user_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_message', payload);
    }

    const senderSocketId = connectedUsers.get(req.user.user_id);
    if (senderSocketId) {
      io.to(senderSocketId).emit('receive_message', payload);
    }
    
    res.json({ 
      message: 'Árajánlat elküldve!', 
      offer_id: result.insertId,
      remaining_offers: 20 - (currentCount + 1)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const getOffersByItem = async (req, res) => {
  try {
    const db = getDB();
    const [offers] = await db.execute(`
      SELECT o.*, 
             u.username as buyer_name,
             u.profile_image as buyer_image
      FROM offers o
      JOIN users u ON o.buyer_id = u.user_id
      WHERE o.item_id = ? AND (o.seller_id = ? OR o.buyer_id = ?)
      ORDER BY o.created_at DESC
    `, [req.params.itemId, req.user.user_id, req.user.user_id]);
    
    res.json({ offers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const getDailyOfferCount = async (req, res) => {
  try {
    const db = getDB();
    const [users] = await db.execute(
      'SELECT daily_offers_count, last_offer_reset FROM users WHERE user_id = ?',
      [req.user.user_id]
    );
    
    const user = users[0];
    const today = new Date().toISOString().split('T')[0];
    
    let currentCount = user.daily_offers_count || 0;
    if (user.last_offer_reset !== today) {
      currentCount = 0;
      await db.execute(
        'UPDATE users SET daily_offers_count = 0, last_offer_reset = ? WHERE user_id = ?',
        [today, req.user.user_id]
      );
    }
    
    res.json({ 
      used: currentCount, 
      remaining: 20 - currentCount,
      limit: 20
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const acceptOffer = async (req, res) => {
  try {
    const db = getDB();
    const io = getIO();
    const connectedUsers = getConnectedUsers();
    
    const [offers] = await db.execute(
      'SELECT * FROM offers WHERE offer_id = ? AND seller_id = ?',
      [req.params.offerId, req.user.user_id]
    );
    
    if (offers.length === 0) {
      return res.status(404).json({ message: 'Ajánlat nem található vagy nincs jogosultságod' });
    }
    
    await db.execute(
      'UPDATE offers SET status = ? WHERE offer_id = ?',
      ['accepted', req.params.offerId]
    );
    
    const receiverSocketId = connectedUsers.get(offers[0].buyer_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('offer_status_changed', {
        offer_id: req.params.offerId,
        status: 'accepted'
      });
    }
    
    res.json({ message: 'Árajánlat elfogadva!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const rejectOffer = async (req, res) => {
  try {
    const db = getDB();
    const io = getIO();
    const connectedUsers = getConnectedUsers();
    
    const [offers] = await db.execute(
      'SELECT * FROM offers WHERE offer_id = ? AND seller_id = ?',
      [req.params.offerId, req.user.user_id]
    );
    
    if (offers.length === 0) {
      return res.status(404).json({ message: 'Ajánlat nem található vagy nincs jogosultságod' });
    }
    
    await db.execute(
      'UPDATE offers SET status = ? WHERE offer_id = ?',
      ['rejected', req.params.offerId]
    );
    
    const receiverSocketId = connectedUsers.get(offers[0].buyer_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('offer_status_changed', {
        offer_id: req.params.offerId,
        status: 'rejected'
      });
    }
    
    res.json({ message: 'Árajánlat elutasítva' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const counterOffer = async (req, res) => {
  try {
    const db = getDB();
    const io = getIO();
    const connectedUsers = getConnectedUsers();
    const { counter_price } = req.body;
    
    const [offers] = await db.execute(
      'SELECT o.*, i.price as original_price FROM offers o JOIN items i ON o.item_id = i.item_id WHERE o.offer_id = ? AND o.seller_id = ?',
      [req.params.offerId, req.user.user_id]
    );
    
    if (offers.length === 0) {
      return res.status(404).json({ message: 'Ajánlat nem található vagy nincs jogosultságod' });
    }
    
    const minPrice = offers[0].original_price * 0.7;
    if (parseFloat(counter_price) < minPrice) {
      return res.status(400).json({ 
        message: `A visszaajánlatod túl alacsony! Minimum ${Math.ceil(minPrice)} Ft lehet (max 30% kedvezmény).`,
        min_price: Math.ceil(minPrice)
      });
    }
    
    await db.execute(
      'UPDATE offers SET status = ?, counter_price = ? WHERE offer_id = ?',
      ['counter_offered', counter_price, req.params.offerId]
    );
    
    const receiverSocketId = connectedUsers.get(offers[0].buyer_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('offer_status_changed', {
        offer_id: req.params.offerId,
        status: 'counter_offered',
        counter_price: counter_price
      });
    }
    
    res.json({ message: 'Visszaájánlat elküldve!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const acceptCounterOffer = async (req, res) => {
  try {
    const db = getDB();
    const [offers] = await db.execute(
      'SELECT * FROM offers WHERE offer_id = ? AND buyer_id = ? AND status = ?',
      [req.params.offerId, req.user.user_id, 'counter_offered']
    );
    
    if (offers.length === 0) {
      return res.status(404).json({ message: 'Ajánlat nem található vagy nincs jogosultságod' });
    }
    
    await db.execute(
      'UPDATE offers SET status = ? WHERE offer_id = ?',
      ['accepted', req.params.offerId]
    );
    
    const [itemInfo] = await db.execute(
      'SELECT i.title FROM items i JOIN offers o ON i.item_id = o.item_id WHERE o.offer_id = ?',
      [req.params.offerId]
    );
    await db.execute(
      'INSERT INTO messages (sender_id, receiver_id, content, offer_id) VALUES (?, ?, ?, ?)',
      [
        req.user.user_id,
        offers[0].seller_id,
        `✅ Visszaájánlatod elfogadva: "${itemInfo[0].title}" - ${offers[0].counter_price.toLocaleString()} Ft`,
        req.params.offerId
      ]
    );
    
    res.json({ message: 'Visszaájánlat elfogadva!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const db = getDB();
    const [offers] = await db.execute(
      'SELECT * FROM offers WHERE offer_id = ? AND buyer_id = ?',
      [req.params.offerId, req.user.user_id]
    );
    
    if (offers.length === 0) {
      return res.status(404).json({ message: 'Ajánlat nem található vagy nincs jogosultságod' });
    }
    
    await db.execute('DELETE FROM offers WHERE offer_id = ?', [req.params.offerId]);
    
    const today = new Date().toISOString().split('T')[0];
    await db.execute(
      'UPDATE users SET daily_offers_count = GREATEST(0, daily_offers_count - 1) WHERE user_id = ? AND last_offer_reset = ?',
      [req.user.user_id, today]
    );
    
    res.json({ message: 'Ajánlat törölve!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const getUnreadOfferCount = async (req, res) => {
  try {
    const db = getDB();
    const [result] = await db.execute(
      'SELECT COUNT(*) as count FROM offers WHERE seller_id = ? AND status = "pending"',
      [req.user.user_id]
    );
    res.json({ count: result[0].count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};
