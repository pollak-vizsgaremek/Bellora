import prisma from '../config/db.js';

export const getAllCategories = async (req, res) => {
    try {
        const categories = await prisma.categories.findMany({
            where: { parent_id: null }
        });
        res.json({ categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Szerver hiba' });
    }
};
