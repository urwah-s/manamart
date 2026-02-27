import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import cardRoutes from './routes/cards.js';
import categoryRoutes from './routes/categories.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/order.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true
}));

// Middlewares
app.use(express.json());

app.use('/api/cards', cardRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/order', orderRoutes);

// Connect to MongoDB
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Connected to MongoDB');

        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Server is running on http://0.0.0.0:${PORT}`);
        });

    } catch (err) {
        console.error('❌ DB connection error:', err);
        process.exit(1);
    }
};

startServer();