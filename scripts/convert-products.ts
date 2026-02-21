import { products } from '../src/data/products';
import fs from 'fs';
import path from 'path';

const outPath = path.join(__dirname, '../src/data/products.json');
fs.writeFileSync(outPath, JSON.stringify(products, null, 2));

console.log(`Successfully exported ${products.length} products to ${outPath}`);
