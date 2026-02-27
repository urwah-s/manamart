import fs from 'fs';
import path from 'path';
import CategoryCard from '../src/models/CategoryCard.js';

export default async function importCategoryCards() {
    try {
        const fpath = path.resolve('data', 'categoryCards.json');
        const catProducts = JSON.parse(fs.readFileSync(fpath, 'utf-8'));

        await CategoryCard.deleteMany();
        await CategoryCard.insertMany(catProducts);
        console.log(`✅ Imported ${catProducts.length} category-card links.`);
    } catch (err) {
        console.error('❌ Failed to import category-product links:', err);
        throw err;
    }
}
