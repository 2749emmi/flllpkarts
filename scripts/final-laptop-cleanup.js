const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../src/data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log(`Total products: ${products.length}`);

// Remove duplicates - keep only unique IDs
const seenIds = new Set();
const uniqueProducts = [];

products.forEach(p => {
  if (!seenIds.has(p.id)) {
    seenIds.add(p.id);
    uniqueProducts.push(p);
  } else {
    console.log(`Removing duplicate: ${p.id} - ${p.title}`);
  }
});

console.log(`\nRemoved ${products.length - uniqueProducts.length} duplicates`);
console.log(`Final count: ${uniqueProducts.length} products`);

// Save
fs.writeFileSync(productsPath, JSON.stringify(uniqueProducts, null, 2));

console.log('\n✓ Cleanup complete!');

// Show laptop products
const laptops = uniqueProducts.filter(p => 
  p.title.toLowerCase().includes('macbook') || 
  p.title.toLowerCase().includes('laptop') ||
  p.id.startsWith('laptop-')
);

console.log(`\nLaptop products (${laptops.length}):`);
laptops.forEach(l => {
  console.log(`  ${l.id}: ${l.title} - ₹${l.price.toLocaleString()}`);
});
