import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '../src/data/products.json');
const products = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

let updatedCount = 0;

for (const product of products) {
    let variants = [];
    let t = product.title.toLowerCase();

    if (t.includes('iphone') || t.includes('galaxy') || t.includes('phone') || t.includes('pixel') || t.includes('moto') || t.includes('vivo') || t.includes('oppo')) {
        variants.push(
            { type: 'Color', options: [{ name: 'Black', available: true }, { name: 'Blue', available: true }, { name: 'Silver', available: false }] },
            { type: 'Storage', options: [{ name: '128 GB', available: true }, { name: '256 GB', available: true }, { name: '512 GB', available: false }] }
        );
    } else if (t.includes('macbook') || t.includes('laptop') || t.includes('zenbook') || t.includes('ideapad')) {
        variants.push(
            { type: 'RAM', options: [{ name: '8 GB', available: true }, { name: '16 GB', available: true }] },
            { type: 'SSD', options: [{ name: '256 GB', available: true }, { name: '512 GB', available: false }] }
        );
    } else if (t.includes('shirt') || t.includes('t-shirt') || t.includes('sneaker') || t.includes('shoe')) {
        variants.push(
            { type: 'Size', options: [{ name: 'S', available: true }, { name: 'M', available: true }, { name: 'L', available: false }, { name: 'XL', available: true }] },
            { type: 'Color', options: [{ name: 'Red', available: true }, { name: 'Black', available: true }] }
        );
    } else if (t.includes('refriger') || t.includes('fridge') || t.includes('washer') || t.includes('washing machine') || t.includes('ac ') || t.includes('air conditioner')) {
        variants.push(
            { type: 'Color', options: [{ name: 'Silver', available: true }, { name: 'Grey', available: true }] },
            { type: 'Capacity', options: [{ name: 'Standard', available: true }, { name: 'Large', available: true }] }
        );
    } else if (t.includes('tv') || t.includes('television')) {
        variants.push(
            { type: 'Size', options: [{ name: '43 inch', available: true }, { name: '55 inch', available: true }, { name: '65 inch', available: false }] }
        );
    } else {
        variants.push(
            { type: 'Pack of', options: [{ name: '1', available: true }, { name: '2', available: false }, { name: '3', available: true }] }
        );
    }

    product.variants = variants;
    updatedCount++;
}

if (updatedCount > 0) {
    fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
    console.log(`Successfully synthesized realistic variants for ${updatedCount} products and saved to products.json`);
} else {
    console.log('No products found to update.');
}
