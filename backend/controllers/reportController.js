import prisma from '../config/db.js';

export const createReport = async (req, res) => {
  try {
    const { item_id, reason } = req.body;
    const reporter_id = req.user.user_id;

    if (!item_id || !reason) {
      return res.status(400).json({ message: 'Hiányzó adatok (item_id, reason)' });
    }

    const item = await prisma.items.findUnique({
      where: { item_id: parseInt(item_id) }
    });

    if (!item) {
      return res.status(404).json({ message: 'Termék nem található' });
    }

    if (item.user_id === reporter_id) {
      return res.status(400).json({ message: 'Nem jelentheted be a saját termékedet' });
    }

    const existing = await prisma.reports.findFirst({
      where: {
        item_id: parseInt(item_id),
        reporter_id
      }
    });

    if (existing) {
      return res.status(400).json({ message: 'Már bejelenteted ezt a terméket' });
    }

    const report = await prisma.reports.create({
      data: {
        item_id: parseInt(item_id),
        reporter_id,
        reason
      }
    });

    res.json({ message: 'Bejelentés elküldve', report_id: report.report_id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Szerver hiba' });
  }
};
