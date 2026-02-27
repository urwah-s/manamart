import fs from 'fs';
import path from 'path';
import CardAttribute from '../src/models/CardAttribute.js';

export default async function importCardAttributes() {
    try {
        const fpath = path.resolve('data', 'cardAttributes.json');
        const attributes = JSON.parse(fs.readFileSync(fpath, 'utf-8'));

        await CardAttribute.deleteMany();
        await CardAttribute.insertMany(attributes);
        console.log(`✅ Imported ${attributes.length} card attributes.`);
    } catch (err) {
        console.error('❌ Failed to import Card Attributes:', err);
        throw err;
    }
}
