import fs from 'fs';
import path from 'path';
import Card from '../src/models/Card.js';

export default async function importCards() {
    try {
        const fpath = path.resolve('data', 'cards.json');
        const cards = JSON.parse(fs.readFileSync(fpath, 'utf-8'));

        await Card.deleteMany();
        await Card.insertMany(cards);
        console.log(`✅ Imported ${cards.length} cards.`);
    } catch (err) {
        console.error('❌ Failed to import Card data:', err);
        throw err;
    }
}
