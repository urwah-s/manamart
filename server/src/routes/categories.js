import express from 'express';
import Category from '../models/Category.js';
import CategoryCard from '../models/CategoryCard.js';
import Card from '../models/Card.js';

const router = express.Router();

// GET all categories
router.get('/', async (req, res) => {
    try {
        const categories = await Category.find().select('category -_id');
        const categoryNames = categories.map(c => c.category);
        res.json(categoryNames);
    } catch (err) {
        console.error('❌ Failed to fetch categories:', err);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// GET all cards in a specific category by category name (case-insensitive)
router.get('/:category/cards', async (req, res) => {
    try {
        const catName = req.params.category;

        if (!catName || typeof catName !== 'string') {
            return res.status(400).json({ error: 'Invalid category name' });
        }

        const categoryEntries = await CategoryCard.find({
            cat: { $regex: new RegExp(`^${catName}$`, 'i') }
        });

        if (categoryEntries.length === 0) {
            return res.status(404).json({ error: 'No cards found for this category' });
        }

        const pIds = categoryEntries.map(entry => entry.pId);
        const cards = await Card.find({ id: { $in: pIds } });

        const result = cards.map(card => {
            const match = categoryEntries.find(entry => entry.pId === card.id);
            return {
                ...card.toObject(),
                aId: match ? match.aId : null
            };
        });

        res.json(result);
    } catch (err) {
        console.error('❌ Failed to fetch cards for category:', err);
        res.status(500).json({ error: 'Failed to fetch cards for this category' });
    }
});


export default router;
