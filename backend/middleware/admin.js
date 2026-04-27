import prisma from '../config/db.js';

export const requireAdmin = async (req, res, next) => {
  try {
    const user = await prisma.users.findUnique({
      where: { user_id: req.user.user_id },
      select: { role: true }
    });

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin jogosultság szükséges' });
    }

    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};
