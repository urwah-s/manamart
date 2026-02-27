import express from 'express';
import Cart from '../models/Cart.js';
import CartItem from '../models/CartItem.js';
import Card from "../models/Card.js";

const router = express.Router();

// POST /api/cart => create new cart if it doesn't exist
router.post('/', async (req, res) => {
    const { cId } = req.body;
    try {
        const existing = await Cart.findOne({ cId });
        if (existing) {
            return res.status(200).json({ message: 'Cart already exists' });
        }
        const newCart = new Cart({ cId });
        const val = await newCart.save();
        res.status(201).json({ message: 'Cart created', cart: val });
    } catch (err) {
        res.status(500).json({ error: 'Failed to create cart' });
    }
});

// GET /api/cart/ids => fetch all cart ids
router.get('/ids', async (req, res) => {
    try {
        const carts = await Cart.find();
        res.json(carts);
    } catch (err) {
        console.error('Error fetching all carts:', err);
        res.status(500).json({ error: 'Failed to fetch carts' });
    }
});


// GET /api/cart/:cId => get cart by ID
router.get('/:cId', async (req, res) => {
    const cId = req.params.cId;
    try {
        const cart = await Cart.findOne({ cId });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        res.json(cart);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch cart' });
    }
});

// GET /api/cart/:cId/items => fetch all items for a cart
router.get('/:cId/items', async (req, res) => {
    try {
        const items = await CartItem.find({ cId: req.params.cId });
        res.json(items);
    } catch {
        res.status(500).json({ error: 'Failed to fetch cart items' });
    }
});

// POST /api/cart/:cId/items => add item to cart (or increment if exists)
router.post('/:cId/items', async (req, res) => {
    const { pId, aId, quantity, name, variantName, imageUrl, price } = req.body;
    const { cId } = req.params;

    if (!pId || !aId || !quantity || !name || !variantName || !imageUrl || !price) {
        return res.status(400).json({ error: 'Missing item fields' });
    }

    try {
        const existing = await CartItem.findOne({ cId, pId, aId });

        if (existing) {
            existing.quantity += quantity;
            await existing.save();
            return res.status(200).json({ message: 'Quantity updated', item: existing });
        }

        const item = new CartItem({
            cId,
            pId,
            aId,
            name,
            variantName,
            imageUrl,
            price,
            quantity
        });

        await item.save();
        res.status(201).json({ message: 'Item added', item });
    } catch {
        res.status(500).json({ error: 'Failed to add item' });
    }
});


// PATCH /api/cart/:cId/items/:pId/:aId/decrease => decrease quantity by 1 or delete if 1
router.patch('/:cId/items/:pId/:aId/decrease', async (req, res) => {
    const { cId, pId, aId } = req.params;

    try {
        const item = await CartItem.findOne({ cId, pId: parseInt(pId), aId: parseInt(aId) });
        if (!item) {
            return res.status(404).json({ error: 'Item not found in cart' });
        }

        if (item.quantity <= 1) {
            // Remove item completely
            await CartItem.deleteOne({ _id: item._id });
            return res.json({ message: 'Item removed from cart' });
        } else {
            // Decrease quantity by 1
            item.quantity -= 1;
            await item.save();
            return res.json({ message: 'Quantity decreased', item });
        }
    } catch (err) {
        console.error('Error decreasing item quantity:', err);
        res.status(500).json({ error: 'Failed to decrease item quantity' });
    }
});



export default router;
