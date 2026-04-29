import prisma from '../config/db.js';

export const getMessages = async (req, res) => {
  try {
    const userId = req.user.user_id;
    const otherUserId = parseInt(req.params.userId);

    const messages = await prisma.messages.findMany({
      where: {
        OR: [
          { sender_id: userId, receiver_id: otherUserId },
          { sender_id: otherUserId, receiver_id: userId }
        ]
      },
      include: {
        users_messages_sender_idTousers: { select: { username: true } },
        users_messages_receiver_idTousers: { select: { username: true } },
        offers: {
          select: {
            status: true,
            offer_price: true,
            counter_price: true,
            items: {
              select: {
                item_id: true, title: true, price: true, itemimages:
                {
                  orderBy: [{ is_primary: 'desc' }, { display_order: 'asc' }],
                  take: 1, select: { image_url: true }
                }
              }
            }
          }
        }
      },
      orderBy: { sent_at: 'asc' }
    });

    const result = messages.map(m => ({
      ...m,
      sender_name: m.users_messages_sender_idTousers.username,
      receiver_name: m.users_messages_receiver_idTousers.username,
      offer_status: m.offers?.status || null,
      offer_price: m.offers?.offer_price || null,
      counter_price: m.offers?.counter_price || null,
      item_id: m.offers?.items?.item_id || null,
      item_title: m.offers?.items?.title || null,
      item_price: m.offers?.items?.price || null,
      item_image: m.offers?.items?.itemimages?.[0]?.image_url || null,
      users_messages_sender_idTousers: undefined,
      users_messages_receiver_idTousers: undefined,
      offers: undefined
    }));

    res.json({ messages: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const receiver_id = parseInt(req.body.receiver_id);
    const { content } = req.body;
    await prisma.messages.create({
      data: {
        sender_id: req.user.user_id,
        receiver_id,
        content
      }
    });
    res.json({ message: 'Üzenet elküldve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const getConversations = async (req, res) => {
  try {
    const userId = req.user.user_id;

    const allMessages = await prisma.messages.findMany({
      where: {
        OR: [
          { sender_id: userId },
          { receiver_id: userId }
        ]
      },
      include: {
        users_messages_sender_idTousers: { select: { user_id: true, username: true } },
        users_messages_receiver_idTousers: { select: { user_id: true, username: true } }
      },
      orderBy: { sent_at: 'desc' }
    });

    const conversationMap = new Map();
    for (const msg of allMessages) {
      const otherUserId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
      if (!conversationMap.has(otherUserId)) {
        const otherUser = msg.sender_id === userId
          ? msg.users_messages_receiver_idTousers
          : msg.users_messages_sender_idTousers;
        conversationMap.set(otherUserId, {
          other_user_id: otherUserId,
          other_user_name: otherUser.username,
          last_message: msg.content,
          last_message_time: msg.sent_at
        });
      }
    }

    const conversations = Array.from(conversationMap.values());
    res.json({ conversations });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};
