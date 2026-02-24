import prisma from '../config/db.js';
import { getIO, getConnectedUsers } from '../server.js';

export const createOffer = async (req, res) => {
  try {
    const io = getIO();
    const connectedUsers = getConnectedUsers();
    const item_id = parseInt(req.body.item_id);
    const { offer_price } = req.body;
    
    // Check if user already has a pending offer for this item
    const existingOffer = await prisma.offers.findFirst({
      where: { item_id, buyer_id: req.user.user_id, status: 'pending' }
    });
    
    if (existingOffer) {
      return res.status(400).json({ message: 'Már van érvényes ajánlatod erre a termékre!' });
    }
    
    const item = await prisma.items.findUnique({
      where: { item_id },
      select: { user_id: true, price: true, title: true }
    });
    
    if (!item) {
      return res.status(404).json({ message: 'Hirdetés nem található' });
    }
    
    if (item.user_id === req.user.user_id) {
      return res.status(400).json({ message: 'Saját hirdetésre nem küldhetsz ajánlatot' });
    }
    
    const offer = await prisma.offers.create({
      data: {
        item_id,
        buyer_id: req.user.user_id,
        seller_id: item.user_id,
        offer_price: parseFloat(offer_price)
      }
    });
    
    const message = await prisma.messages.create({
      data: {
        sender_id: req.user.user_id,
        receiver_id: item.user_id,
        content: '',
        offer_id: offer.offer_id
      }
    });
    
    const sender = await prisma.users.findUnique({
      where: { user_id: req.user.user_id },
      select: { username: true }
    });
    
    const payload = {
      message_id: message.message_id,
      sender_id: req.user.user_id,
      receiver_id: item.user_id,
      content: '',
      offer_id: offer.offer_id,
      offer_status: 'pending',
      offer_price: offer_price,
      item_id: item_id,
      item_title: item.title,
      item_price: item.price,
      sender_name: sender.username,
      sent_at: new Date()
    };

    const receiverSocketId = connectedUsers.get(item.user_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_message', payload);
    }

    const senderSocketId = connectedUsers.get(req.user.user_id);
    if (senderSocketId) {
      io.to(senderSocketId).emit('receive_message', payload);
    }
    
    res.json({ 
      message: 'Árajánlat elküldve!', 
      offer_id: offer.offer_id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const getOffersByItem = async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId);
    const offers = await prisma.offers.findMany({
      where: {
        item_id: itemId,
        OR: [
          { seller_id: req.user.user_id },
          { buyer_id: req.user.user_id }
        ]
      },
      include: {
        users_offers_buyer_idTousers: {
          select: { username: true, profile_image: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });
    
    const result = offers.map(o => ({
      ...o,
      buyer_name: o.users_offers_buyer_idTousers.username,
      buyer_image: o.users_offers_buyer_idTousers.profile_image,
      users_offers_buyer_idTousers: undefined
    }));
    
    res.json({ offers: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const acceptOffer = async (req, res) => {
  try {
    const io = getIO();
    const connectedUsers = getConnectedUsers();
    const offerId = parseInt(req.params.offerId);
    
    const offer = await prisma.offers.findFirst({
      where: { offer_id: offerId, seller_id: req.user.user_id }
    });
    
    if (!offer) {
      return res.status(404).json({ message: 'Ajánlat nem található vagy nincs jogosultságod' });
    }
    
    await prisma.offers.update({
      where: { offer_id: offerId },
      data: { status: 'accepted' }
    });
    
    const receiverSocketId = connectedUsers.get(offer.buyer_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('offer_status_changed', {
        offer_id: offerId,
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
    const io = getIO();
    const connectedUsers = getConnectedUsers();
    const offerId = parseInt(req.params.offerId);
    
    const offer = await prisma.offers.findFirst({
      where: { offer_id: offerId, seller_id: req.user.user_id }
    });
    
    if (!offer) {
      return res.status(404).json({ message: 'Ajánlat nem található vagy nincs jogosultságod' });
    }
    
    await prisma.offers.update({
      where: { offer_id: offerId },
      data: { status: 'rejected' }
    });
    
    const receiverSocketId = connectedUsers.get(offer.buyer_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('offer_status_changed', {
        offer_id: offerId,
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
    const io = getIO();
    const connectedUsers = getConnectedUsers();
    const { counter_price } = req.body;
    const offerId = parseInt(req.params.offerId);
    
    const offer = await prisma.offers.findFirst({
      where: { offer_id: offerId, seller_id: req.user.user_id },
      include: {
        items: { select: { price: true } }
      }
    });
    
    if (!offer) {
      return res.status(404).json({ message: 'Ajánlat nem található vagy nincs jogosultságod' });
    }
    
    const minPrice = Number(offer.items.price) * 0.7;
    if (parseFloat(counter_price) < minPrice) {
      return res.status(400).json({ 
        message: `A visszaajánlatod túl alacsony! Minimum ${Math.ceil(minPrice)} Ft lehet (max 30% kedvezmény).`,
        min_price: Math.ceil(minPrice)
      });
    }
    
    await prisma.offers.update({
      where: { offer_id: offerId },
      data: { status: 'counter_offered', counter_price: parseFloat(counter_price) }
    });
    
    const receiverSocketId = connectedUsers.get(offer.buyer_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('offer_status_changed', {
        offer_id: offerId,
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
    const offerId = parseInt(req.params.offerId);
    
    const offer = await prisma.offers.findFirst({
      where: { offer_id: offerId, buyer_id: req.user.user_id, status: 'counter_offered' },
      include: {
        items: { select: { title: true } }
      }
    });
    
    if (!offer) {
      return res.status(404).json({ message: 'Ajánlat nem található vagy nincs jogosultságod' });
    }
    
    await prisma.offers.update({
      where: { offer_id: offerId },
      data: { status: 'accepted' }
    });
    
    await prisma.messages.create({
      data: {
        sender_id: req.user.user_id,
        receiver_id: offer.seller_id,
        content: `✅ Visszaájánlatod elfogadva: "${offer.items.title}" - ${Number(offer.counter_price).toLocaleString()} Ft`,
        offer_id: offerId
      }
    });
    
    res.json({ message: 'Visszaájánlat elfogadva!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const deleteOffer = async (req, res) => {
  try {
    const offerId = parseInt(req.params.offerId);
    
    const offer = await prisma.offers.findFirst({
      where: { offer_id: offerId, buyer_id: req.user.user_id }
    });
    
    if (!offer) {
      return res.status(404).json({ message: 'Ajánlat nem található vagy nincs jogosultságod' });
    }
    
    await prisma.offers.delete({ where: { offer_id: offerId } });
    
    const today = new Date().toISOString().split('T')[0];
    await prisma.users.updateMany({
      where: {
        user_id: req.user.user_id,
        last_offer_reset: new Date(today)
      },
      data: {
        daily_offers_count: { decrement: 1 }
      }
    });
    
    res.json({ message: 'Ajánlat törölve!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const getUnreadOfferCount = async (req, res) => {
  try {
    const count = await prisma.offers.count({
      where: { seller_id: req.user.user_id, status: 'pending' }
    });
    res.json({ count });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};
