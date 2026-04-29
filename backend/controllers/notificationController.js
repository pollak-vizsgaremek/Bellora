import prisma from '../config/db.js';

export const getNotifications = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const favoritesRaw = await prisma.favorites.findMany({
      where: {
        items: { user_id: userId }
      },
      include: {
        users: { select: { username: true, profile_image: true } },
        items: { select: { item_id: true, title: true } }
      },
      take: 20,
      orderBy: { item_id: 'desc' }
    });

    const favorites = favoritesRaw.map(f => ({
      favoriter_id: f.user_id,
      favoriter_name: f.users.username,
      favoriter_image: f.users.profile_image,
      item_id: f.items.item_id,
      item_title: f.items.title,
      created_at: new Date(),
      type: 'favorite'
    }));

    const ordersRaw = await prisma.orders.findMany({
      where: { seller_id: userId },
      include: {
        users_orders_buyer_idTousers: { select: { username: true, profile_image: true } },
        items: { select: { item_id: true, title: true } }
      },
      orderBy: { order_date: 'desc' },
      take: 20
    });

    const orders = ordersRaw.map(o => ({
      order_id: o.order_id,
      buyer_id: o.buyer_id,
      buyer_name: o.users_orders_buyer_idTousers.username,
      buyer_image: o.users_orders_buyer_idTousers.profile_image,
      item_id: o.items.item_id,
      item_title: o.items.title,
      created_at: o.order_date,
      order_status: o.status,
      type: 'order'
    }));

    const offersRaw = await prisma.offers.findMany({
      where: { seller_id: userId, status: 'pending' },
      include: {
        users_offers_buyer_idTousers: { select: { username: true, profile_image: true } },
        items: { select: { item_id: true, title: true } }
      },
      orderBy: { created_at: 'desc' },
      take: 20
    });

    const offers = offersRaw.map(o => ({
      offer_id: o.offer_id,
      buyer_id: o.buyer_id,
      buyer_name: o.users_offers_buyer_idTousers.username,
      buyer_image: o.users_offers_buyer_idTousers.profile_image,
      item_id: o.items.item_id,
      item_title: o.items.title,
      offer_price: o.offer_price,
      offer_status: o.status,
      created_at: o.created_at,
      type: 'offer'
    }));

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
    const userId = req.user.user_id;

    const favoriteCount = await prisma.favorites.count({
      where: {
        items: { user_id: userId }
      }
    });

    const orderCount = await prisma.orders.count({
      where: { seller_id: userId, status: 'pending' }
    });

    const offerCount = await prisma.offers.count({
      where: { seller_id: userId, status: 'pending' }
    });

    res.json({ count: favoriteCount + orderCount + offerCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};
