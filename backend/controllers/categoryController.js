import { getDB } from '../config/db.js';

export const getAllCategories = async (req, res) => {
    try {
        const db = getDB();
        const [categories] = await db.execute('SELECT * FROM categories WHERE parent_id IS NULL');
        res.json({ categories });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Szerver hiba' });
    }
};
