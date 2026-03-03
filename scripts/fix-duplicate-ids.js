const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data/products.json');
const products = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

console.log(`📊 Total products: ${products.length}`);

// Find duplicates
const idCounts = {};
products.forEach(p => {
  idCounts[p.id] = (idCounts[p.id] || 0) + 1;
});

const duplicates = Object.entries(idCounts).filter(([id, count]) => count > 1);
console.log(`\n🔍 Found ${duplicates.length} duplicate IDs:`);
duplicates.forEach(([id, count]) => {
  console.log(`   ID ${id}: ${count} times`);
});

// Fix duplicates by generating new unique IDs
let fixed = 0;
const usedIds = new Set();

products.forEach((p, index) => {
  if (usedIds.has(p.id)) {
    const oldId = p.id;
    // Generate new unique ID
    let newId;
    do {
      newId = (10000 + Math.floor(Math.random() * 90000)).toString();
    } while (usedIds.has(newId));
    
    p.id = newId;
    console.log(`   ✏️  Fixed: ${oldId} → ${newId} (${p.title.substring(0, 50)}...)`);
    fixed++;
  }
  usedIds.add(p.id);
});

console.log(`\n✅ Fixed ${fixed} duplicate IDs`);

// Save
fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
console.log(`💾 Saved to ${dataPath}`);
console.log(`\n✨ Done! All IDs are now unique.`);
