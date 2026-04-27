import prisma from '../config/db.js';

// === FELHASZNÁLÓK KEZELÉSE ===

export const getAllUsers = async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      select: {
        user_id: true,
        username: true,
        email: true,
        full_name: true,
        phone: true,
        city: true,
        join_date: true,
        profile_image: true,
        role: true,
        _count: {
          select: {
            items: true,
            orders_orders_buyer_idTousers: true,
            orders_orders_seller_idTousers: true
          }
        }
      },
      orderBy: { join_date: 'desc' }
    });

    const result = users.map(u => ({
      ...u,
      items_count: u._count.items,
      orders_as_buyer: u._count.orders_orders_buyer_idTousers,
      orders_as_seller: u._count.orders_orders_seller_idTousers,
      _count: undefined
    }));

    res.json({ users: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);

    if (userId === req.user.user_id) {
      return res.status(400).json({ message: 'Nem törölheted saját magadat' });
    }

    const user = await prisma.users.findUnique({
      where: { user_id: userId }
    });

    if (!user) {
      return res.status(404).json({ message: 'Felhasználó nem található' });
    }

    await prisma.users.delete({ where: { user_id: userId } });

    res.json({ message: 'Felhasználó törölve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const userId = parseInt(req.params.userId);
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Érvénytelen role' });
    }

    if (userId === req.user.user_id) {
      return res.status(400).json({ message: 'Nem változtathatod meg a saját szerepedet' });
    }

    await prisma.users.update({
      where: { user_id: userId },
      data: { role }
    });

    res.json({ message: 'Felhasználó szerepe frissítve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

// === HIRDETÉSEK KEZELÉSE ===

export const getAllItemsAdmin = async (req, res) => {
  try {
    const items = await prisma.items.findMany({
      include: {
        users: { select: { username: true, user_id: true } },
        itemimages: {
          where: { is_primary: true },
          take: 1,
          select: { image_url: true }
        },
        _count: { select: { favorites: true, reports: true } }
      },
      orderBy: { created_at: 'desc' }
    });

    const result = items.map(item => ({
      ...item,
      seller_name: item.users.username,
      seller_id: item.users.user_id,
      image_url: item.itemimages[0]?.image_url || null,
      favorites_count: item._count.favorites,
      reports_count: item._count.reports,
      users: undefined,
      itemimages: undefined,
      _count: undefined
    }));

    res.json({ items: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const deleteItemAdmin = async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId);

    const item = await prisma.items.findUnique({
      where: { item_id: itemId }
    });

    if (!item) {
      return res.status(404).json({ message: 'Hirdetés nem található' });
    }

    await prisma.items.delete({ where: { item_id: itemId } });

    res.json({ message: 'Hirdetés törölve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const updateItemStatusAdmin = async (req, res) => {
  try {
    const itemId = parseInt(req.params.itemId);
    const { status } = req.body;

    if (!['available', 'sold', 'reserved'].includes(status)) {
      return res.status(400).json({ message: 'Érvénytelen státusz' });
    }

    await prisma.items.update({
      where: { item_id: itemId },
      data: { status }
    });

    res.json({ message: 'Hirdetés státusza frissítve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

// === BEJELENTÉSEK KEZELÉSE ===

export const getAllReports = async (req, res) => {
  try {
    const reports = await prisma.reports.findMany({
      include: {
        items: {
          select: {
            item_id: true,
            title: true,
            price: true,
            status: true,
            itemimages: {
              where: { is_primary: true },
              take: 1,
              select: { image_url: true }
            }
          }
        },
        users: {
          select: { user_id: true, username: true }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    const result = reports.map(r => ({
      report_id: r.report_id,
      reason: r.reason,
      status: r.status,
      created_at: r.created_at,
      item_id: r.items.item_id,
      item_title: r.items.title,
      item_price: r.items.price,
      item_status: r.items.status,
      item_image: r.items.itemimages[0]?.image_url || null,
      reporter_id: r.users.user_id,
      reporter_name: r.users.username
    }));

    res.json({ reports: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const updateReportStatus = async (req, res) => {
  try {
    const reportId = parseInt(req.params.reportId);
    const { status } = req.body;

    if (!['pending', 'reviewed', 'dismissed'].includes(status)) {
      return res.status(400).json({ message: 'Érvénytelen státusz' });
    }

    const report = await prisma.reports.findUnique({
      where: { report_id: reportId },
      select: { item_id: true }
    });

    if (!report) {
      return res.status(404).json({ message: 'Bejelentés nem található' });
    }

    await prisma.reports.update({
      where: { report_id: reportId },
      data: { status }
    });

    // Ha "reviewed" (jogos bejelentés) -> törli a hirdetést
    if (status === 'reviewed') {
      await prisma.items.delete({
        where: { item_id: report.item_id }
      }).catch(() => {
        // Ha a hirdetés már törölve van, nem baj
      });
    }

    const messages = {
      reviewed: 'Bejelentés elfogadva, hirdetés törölve',
      dismissed: 'Bejelentés elutasítva, hirdetés megtartva',
      pending: 'Bejelentés visszaállítva függőbe'
    };

    res.json({ message: messages[status] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

// === RENDELÉSEK KEZELÉSE ===

export const getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await prisma.orders.findMany({
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
        },
        users_orders_seller_idTousers: {
          select: { username: true, user_id: true }
        },
        payments: true,
        shipping: true
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
      image_url: o.items.itemimages[0]?.image_url || null,
      buyer_id: o.users_orders_buyer_idTousers.user_id,
      buyer_name: o.users_orders_buyer_idTousers.username,
      seller_id: o.users_orders_seller_idTousers.user_id,
      seller_name: o.users_orders_seller_idTousers.username,
      payment: o.payments || null,
      shipping: o.shipping || null
    }));

    res.json({ orders: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const updateOrderStatusAdmin = async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId);
    const { status } = req.body;

    if (!['pending', 'completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Érvénytelen státusz' });
    }

    const order = await prisma.orders.findUnique({
      where: { order_id: orderId }
    });

    if (!order) {
      return res.status(404).json({ message: 'Rendelés nem található' });
    }

    await prisma.orders.update({
      where: { order_id: orderId },
      data: { status }
    });

    // Ha cancelled, tegyük vissza a terméket available-re
    if (status === 'cancelled') {
      await prisma.items.update({
        where: { item_id: order.item_id },
        data: { status: 'available' }
      });
    }

    res.json({ message: 'Rendelés státusza frissítve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const deleteOrderAdmin = async (req, res) => {
  try {
    const orderId = parseInt(req.params.orderId);

    const order = await prisma.orders.findUnique({
      where: { order_id: orderId }
    });

    if (!order) {
      return res.status(404).json({ message: 'Rendelés nem található' });
    }

    // Tegyük vissza a terméket available-re
    await prisma.items.update({
      where: { item_id: order.item_id },
      data: { status: 'available' }
    });

    await prisma.orders.delete({ where: { order_id: orderId } });

    res.json({ message: 'Rendelés törölve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

// === DASHBOARD STATISZTIKÁK ===

export const getDashboardStats = async (req, res) => {
  try {
    const [usersCount, itemsCount, ordersCount, reportsCount, pendingReportsCount, pendingOrdersCount] = await Promise.all([
      prisma.users.count(),
      prisma.items.count(),
      prisma.orders.count(),
      prisma.reports.count(),
      prisma.reports.count({ where: { status: 'pending' } }),
      prisma.orders.count({ where: { status: 'pending' } })
    ]);

    res.json({
      stats: {
        usersCount,
        itemsCount,
        ordersCount,
        reportsCount,
        pendingReportsCount,
        pendingOrdersCount
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};
