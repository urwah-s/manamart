import fs from 'fs';
import path from 'path';
import Category from '../src/models/Category.js';

export default async function importCategories() {
    try {
        const fpath = path.resolve('data', 'categories.json');
        const categories = JSON.parse(fs.readFileSync(fpath, 'utf-8'));

        await Category.deleteMany();
        await Category.insertMany(categories);
        console.log(`✅ Imported ${categories.length} categories.`);
    } catch (err) {
        console.error('❌ Failed to import categories:', err);
        throw err;
    }
}
