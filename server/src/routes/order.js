import express from 'express';
import Order from '../models/Order.js';
import CartItem from '../models/CartItem.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// GET /api/order - Get all orders
router.get('/', async (req, res) => {
    try {
        const orders = await Order.find();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ message: 'Error retrieving orders', error: err.message });
    }
});

// POST /api/order => create a new order from cart
router.post('/', async (req, res) => {
    const { cId, name, items } = req.body;

    if (!cId || !name || !items || !Array.isArray(items)) {
        return res.status(400).json({ message: 'Missing required fields or items is not an array' });
    }

    const oId = uuidv4();

    const newOrder = new Order({
        cId,
        oId,
        name,
        items
    });

    try {
        const savedOrder = await newOrder.save();
        res.status(201).json(savedOrder);
    } catch (err) {
        res.status(500).json({ message: 'Error saving order', error: err.message });
    }
});

export default router;