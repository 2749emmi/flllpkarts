const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data/products.json');
const products = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

console.log(`📊 Checking ${products.length} products for missing images...`);

let fixed = 0;

products.forEach(p => {
  // Fix products with non-existent image paths
  if (p.image && (p.image.includes('google-pixel-8-pro-1') || p.image.includes('apple-airpods-pro-2nd-gen-1'))) {
    // Use existing images or fallback
    if (p.images && p.images.length > 0) {
      p.image = p.images[0];
      console.log(`✏️  Fixed ${p.id}: ${p.title} - using first image from array`);
      fixed++;
    } else {
      // Set to a known good image based on product type
      if (p.title.toLowerCase().includes('pixel')) {
        p.image = '/images/products/samsung_s23.jpg'; // Fallback to similar phone
      } else if (p.title.toLowerCase().includes('airpods')) {
        p.image = '/images/products/airpods-pro-2.jpeg';
      }
      console.log(`✏️  Fixed ${p.id}: ${p.title} - set fallback image`);
      fixed++;
    }
  }
});

fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));

console.log(`\n✅ Fixed ${fixed} products with missing images`);
console.log(`💾 Saved to ${dataPath}`);
