import express from 'express';
import Card from '../models/Card.js';
import CardAttribute from "../models/CardAttribute.js";
import CardAttributePrice from "../models/CardAttributePrice.js";
import CategoryCard from "../models/CategoryCard.js";

const router = express.Router();

// GET all cards
router.get("/", async (req, res) => {
    try {
        const cards = await Card.find();
        res.json(cards);
    } catch (err) {
        console.error('Error fetching all cards:', err);
        res.status(500).json({ error: 'Failed to fetch cards' });
    }
});

router.get('/search', async (req, res) => {
    const query = req.query.q;

    if (!query || typeof query !== 'string') {
        return res.status(400).json({ error: 'Invalid search query' });
    }

    const terms = query.trim().toLowerCase().split(/\s+/);

    try {
        const allCards = await Card.find();
        const allAttributes = await CardAttribute.find();
        const allCategoryLinks = await CategoryCard.find();

        const matchedCards = allCards.filter(card => {
            const cardAttributes = allAttributes.filter(attr => attr.pId === card.id);
            const categoryMatches = allCategoryLinks.filter(cat => cat.pId === card.id);

            const searchableTokens = new Set(
                [
                    card.name,
                    card.description,
                    ...(card.color || []),
                    ...cardAttributes.map(a => a.name),
                    ...categoryMatches.map(c => c.cat)
                ]
                    .join(' ')
                    .toLowerCase()
                    .split(/\W+/)
            );

            return terms.every(term => searchableTokens.has(term));
        });

        if (matchedCards.length === 0) {
            return res.json([]); // no products found
        }

        res.json(matchedCards);
    } catch (err) {
        console.error('❌ Search error:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// GET single card by ID
router.get("/:id", async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({ error: 'Invalid card ID' });
        }

        const card = await Card.findOne({ id: id });
        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        // Get variants for this card
        const variants = await CardAttribute.find({ pId: id });
        const variantData = await Promise.all(
            variants.map(async (variant) => {
                const price = await CardAttributePrice.findOne({ aId: variant.aId });
                return {
                    aId: variant.aId,
                    name: variant.name,
                    price: price?.price,
                    imageUrl: price?.imageUrl
                };
            })
        );

        res.json({ ...card.toObject(), variants: variantData });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;