import prisma from '../config/db.js';

export const getFavorites = async (req, res) => {
  try {
    const favoriteRecords = await prisma.favorites.findMany({
      where: { user_id: req.user.user_id },
      include: {
        items: {
          include: {
            users: {
              select: { username: true, profile_image: true }
            },
            itemimages: {
              orderBy: { display_order: 'asc' },
              take: 1,
              select: { image_url: true }
            }
          }
        }
      }
    });

    const favorites = favoriteRecords.map(f => ({
      ...f.items,
      seller_name: f.items.users.username,
      seller_image: f.items.users.profile_image,
      image_url: f.items.itemimages[0]?.image_url || null,
      users: undefined,
      itemimages: undefined
    }));

    res.json({ favorites });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const addFavorite = async (req, res) => {
  try {
    const item_id = parseInt(req.body.item_id);
    await prisma.favorites.upsert({
      where: {
        user_id_item_id: { user_id: req.user.user_id, item_id }
      },
      update: {},
      create: { user_id: req.user.user_id, item_id }
    });
    res.json({ message: 'Hozzáadva a kedvencekhez' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const removeFavorite = async (req, res) => {
  try {
    await prisma.favorites.delete({
      where: {
        user_id_item_id: {
          user_id: req.user.user_id,
          item_id: parseInt(req.params.itemId)
        }
      }
    });
    res.json({ message: 'Eltávolítva a kedvencekből' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};
