import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

import importCards from './importCards.js';
import importCardAttributes from './importCardAttributes.js';
import importCardAttributePrices from './importCardAttributePrices.js';
import importCategories from './importCategories.js';
import importCategoryCards from './importCategoryCards.js';

async function importAllData() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    console.log('📦 Importing Cards...');
    await importCards();

    console.log('📦 Importing Card Attributes...');
    await importCardAttributes();

    console.log('📦 Importing Card Attributes Prices...');
    await importCardAttributePrices();

    console.log('📦 Importing Card Categories...');
    await importCategories();

    console.log('📦 Importing Category Cards...');
    await importCategoryCards();

    mongoose.disconnect();
}

importAllData().catch(console.error);
