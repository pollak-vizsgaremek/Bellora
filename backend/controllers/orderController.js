import prisma from '../config/db.js';

export const createOrder = async (req, res) => {
  try {
    const item_id = parseInt(req.body.item_id);
    const buyer_id = req.user.user_id;

    const item = await prisma.items.findUnique({
      where: { item_id }
    });

    if (!item) {
      return res.status(404).json({ message: 'Termék nem található' });
    }

    if (item.status !== 'available') {
      return res.status(400).json({ message: 'Ez a termék már nem elérhető' });
    }

    if (item.user_id === buyer_id) {
      return res.status(400).json({ message: 'Nem vásárolhatod meg a saját termékedet' });
    }

    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.orders.create({
        data: {
          buyer_id,
          seller_id: item.user_id,
          item_id,
          status: 'pending'
        }
      });

      await tx.items.update({
        where: { item_id },
        data: { status: 'sold' }
      });

      return newOrder;
    });

    res.json({
      message: 'Vásárlás sikeres!',
      order_id: order.order_id
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const orders = await prisma.orders.findMany({
      where: { buyer_id: userId },
      include: {
        items: {
          include: {
            itemimages: {
              orderBy: [{ is_primary: 'desc' }, { display_order: 'asc' }],
              take: 1,
              select: { image_url: true }
            }
          }
        },
        users_orders_seller_idTousers: {
          select: { username: true, user_id: true }
        }
      },
      orderBy: { order_date: 'desc' }
    });

    const result = orders.map(o => ({
      order_id: o.order_id,
      item_id: o.item_id,
      order_date: o.order_date,
      status: o.status,
      title: o.items.title,
      price: o.items.price,
      description: o.items.description,
      seller_name: o.users_orders_seller_idTousers.username,
      seller_id: o.users_orders_seller_idTousers.user_id,
      image_url: o.items.itemimages[0]?.image_url || null
    }));

    res.json({ orders: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const getMySales = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const sales = await prisma.orders.findMany({
      where: { seller_id: userId },
      include: {
        items: {
          include: {
            itemimages: {
              orderBy: [{ is_primary: 'desc' }, { display_order: 'asc' }],
              take: 1,
              select: { image_url: true }
            }
          }
        },
        users_orders_buyer_idTousers: {
          select: { username: true, user_id: true }
        }
      },
      orderBy: { order_date: 'desc' }
    });

    const result = sales.map(o => ({
      order_id: o.order_id,
      item_id: o.item_id,
      order_date: o.order_date,
      status: o.status,
      title: o.items.title,
      price: o.items.price,
      description: o.items.description,
      buyer_name: o.users_orders_buyer_idTousers.username,
      buyer_id: o.users_orders_buyer_idTousers.user_id,
      image_url: o.items.itemimages[0]?.image_url || null
    }));

    res.json({ sales: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const userId = req.user.user_id;

    const order = await prisma.orders.findUnique({
      where: { order_id: id },
      select: { seller_id: true }
    });

    if (!order) {
      return res.status(404).json({ message: 'Rendelés nem található' });
    }

    if (order.seller_id !== userId) {
      return res.status(403).json({ message: 'Nincs jogosultságod módosítani ezt a rendelést' });
    }

    await prisma.orders.update({
      where: { order_id: id },
      data: { status }
    });

    res.json({ message: 'Rendelés státusz frissítve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};
