import fs from 'fs';
import path from 'path';
import CardAttributePrice from '../src/models/CardAttributePrice.js';

export default async function importCardAttributePrices() {
    try {
        const fpath = path.resolve('data', 'cardAttributePrices.json');
        const prices = JSON.parse(fs.readFileSync(fpath, 'utf-8'));

        await CardAttributePrice.deleteMany();
        await CardAttributePrice.insertMany(prices);
        console.log(`✅ Imported ${prices.length} card attribute prices.`);
    } catch (err) {
        console.error('❌ Failed to import card Attribute Prices:', err);
        throw err;
    }
}
