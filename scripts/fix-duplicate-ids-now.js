const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../src/data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log(`Total products: ${products.length}`);

// Find duplicates
const idMap = {};
const duplicates = [];

products.forEach((p, index) => {
  if (idMap[p.id]) {
    duplicates.push({ id: p.id, index, title: p.title });
  } else {
    idMap[p.id] = true;
  }
});

console.log(`Found ${duplicates.length} duplicate IDs`);

if (duplicates.length > 0) {
  console.log('\nDuplicates:');
  duplicates.forEach(d => {
    console.log(`  ID ${d.id} at index ${d.index}: ${d.title.substring(0, 60)}`);
  });
}

// Fix by generating new unique IDs
let maxId = Math.max(...products.map(p => parseInt(p.id) || 0));

const fixedProducts = products.map((p, index) => {
  const isDuplicate = duplicates.some(d => d.index === index);
  
  if (isDuplicate) {
    maxId++;
    const newId = maxId.toString();
    console.log(`\nFixed: ${p.title.substring(0, 50)}`);
    console.log(`  Old ID: ${p.id} -> New ID: ${newId}`);
    return { ...p, id: newId };
  }
  
  return p;
});

// Save
fs.writeFileSync(productsPath, JSON.stringify(fixedProducts, null, 2));

console.log(`\n✓ Fixed all duplicate IDs`);
console.log(`✓ Total products: ${fixedProducts.length}`);
