import prisma from '../config/db.js';

export const getAllItems = async (req, res) => {
  try {
    const items = await prisma.items.findMany({
      where: { status: 'available' },
      include: {
        users: { select: { username: true } },
        itemimages: {
          orderBy: [{ is_primary: 'desc' }, { display_order: 'asc' }],
          take: 1,
          select: { image_url: true }
        },
        _count: { select: { favorites: true } }
      },
      orderBy: { created_at: 'desc' }
    });

    const result = items.map(item => ({
      ...item,
      seller_name: item.users.username,
      image_url: item.itemimages[0]?.image_url || null,
      favorites_count: item._count.favorites,
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

export const getItemById = async (req, res) => {
  try {
    const item = await prisma.items.findUnique({
      where: { item_id: parseInt(req.params.id) },
      include: {
        users: { select: { username: true, user_id: true } },
        itemimages: { orderBy: { display_order: 'asc' } },
        _count: { select: { favorites: true } }
      }
    });

    if (!item) {
      return res.status(404).json({ message: 'Hirdetés nem található' });
    }

    const result = {
      ...item,
      seller_name: item.users.username,
      seller_id: item.users.user_id,
      favorites_count: item._count.favorites,
      images: item.itemimages,
      users: undefined,
      itemimages: undefined,
      _count: undefined
    };

    res.json({ item: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const createItem = async (req, res) => {
  try {
    const { title, description, price, category_id } = req.body;
    
    if (!price || parseFloat(price) <= 0) {
      return res.status(400).json({ message: 'Az árnak nullánál nagyobbnak kell lennie' });
    }
    
    const item = await prisma.items.create({
      data: {
        user_id: req.user.user_id,
        category_id: category_id ? parseInt(category_id) : 1,
        title,
        description,
        price: parseFloat(price)
      }
    });
    res.json({ message: 'Hirdetés létrehozva', item_id: item.item_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const updateItem = async (req, res) => {
  try {
    const { title, description, price, category_id, status } = req.body;
    const id = parseInt(req.params.id);
    
    if (!price || parseFloat(price) <= 0) {
      return res.status(400).json({ message: 'Az árnak nullánál nagyobbnak kell lennie' });
    }
    
    const item = await prisma.items.findUnique({
      where: { item_id: id },
      select: { user_id: true }
    });
    
    if (!item) {
      return res.status(404).json({ message: 'Hirdetés nem található' });
    }
    
    if (item.user_id !== req.user.user_id) {
      return res.status(403).json({ message: 'Nincs jogosultságod szerkeszteni ezt a hirdetést' });
    }
    
    await prisma.items.update({
      where: { item_id: id },
      data: {
        title,
        description,
        price: parseFloat(price),
        category_id: parseInt(category_id),
        status
      }
    });
    
    res.json({ message: 'Hirdetés frissítve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    
    const item = await prisma.items.findUnique({
      where: { item_id: id },
      select: { user_id: true }
    });
    
    if (!item) {
      return res.status(404).json({ message: 'Hirdetés nem található' });
    }
    
    if (item.user_id !== req.user.user_id) {
      return res.status(403).json({ message: 'Nincs jogosultságod törölni ezt a hirdetést' });
    }
    
    // Prisma cascades handle itemimages and favorites deletion
    await prisma.items.delete({ where: { item_id: id } });
    
    res.json({ message: 'Hirdetés törölve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const getMyItems = async (req, res) => {
  try {
    const items = await prisma.items.findMany({
      where: { user_id: req.user.user_id },
      include: {
        itemimages: {
          orderBy: { display_order: 'asc' },
          take: 1,
          select: { image_url: true }
        },
        _count: { select: { favorites: true } }
      },
      orderBy: { created_at: 'desc' }
    });

    const result = items.map(item => ({
      ...item,
      image_url: item.itemimages[0]?.image_url || null,
      favorites_count: item._count.favorites,
      itemimages: undefined,
      _count: undefined
    }));

    res.json({ items: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const getItemImages = async (req, res) => {
  try {
    const images = await prisma.itemimages.findMany({
      where: { item_id: parseInt(req.params.id) },
      orderBy: [{ is_primary: 'desc' }, { display_order: 'asc' }]
    });
    res.json({ images });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const uploadItemImages = async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    const item = await prisma.items.findUnique({
      where: { item_id: itemId },
      select: { user_id: true }
    });
    if (!item || item.user_id !== req.user.user_id) {
      return res.status(403).json({ message: 'Nincs jogosultságod' });
    }

    const uploadedImages = [];
    for (const file of req.files) {
      const image_url = '/uploads/' + file.filename;
      const image = await prisma.itemimages.create({
        data: {
          item_id: itemId,
          image_url,
          is_primary: false
        }
      });
      uploadedImages.push({ image_id: image.image_id, image_url });
    }
    
    res.json({ message: 'Képek feltöltve', images: uploadedImages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const deleteItemImage = async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    const item = await prisma.items.findUnique({
      where: { item_id: itemId },
      select: { user_id: true }
    });
    if (!item || item.user_id !== req.user.user_id) {
      return res.status(403).json({ message: 'Nincs jogosultságod' });
    }

    await prisma.itemimages.deleteMany({
      where: {
        image_id: parseInt(req.params.imageId),
        item_id: itemId
      }
    });
    
    res.json({ message: 'Kép törölve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const setPrimaryImage = async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    const item = await prisma.items.findUnique({
      where: { item_id: itemId },
      select: { user_id: true }
    });
    if (!item || item.user_id !== req.user.user_id) {
      return res.status(403).json({ message: 'Nincs jogosultságod' });
    }

    // Reset all images for this item, then set the selected one as primary
    await prisma.$transaction([
      prisma.itemimages.updateMany({
        where: { item_id: itemId },
        data: { is_primary: false }
      }),
      prisma.itemimages.updateMany({
        where: {
          image_id: parseInt(req.params.imageId),
          item_id: itemId
        },
        data: { is_primary: true }
      })
    ]);
    
    res.json({ message: 'Elsődleges kép beállítva' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};

export const reorderImages = async (req, res) => {
  try {
    const itemId = parseInt(req.params.id);
    const item = await prisma.items.findUnique({
      where: { item_id: itemId },
      select: { user_id: true }
    });
    if (!item || item.user_id !== req.user.user_id) {
      return res.status(403).json({ message: 'Nincs jogosultságod' });
    }

    const { images } = req.body;
    
    await prisma.$transaction(
      images.map(img =>
        prisma.itemimages.updateMany({
          where: { image_id: img.image_id, item_id: itemId },
          data: { display_order: img.display_order }
        })
      )
    );
    
    res.json({ message: 'Sorrend frissítve' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};
