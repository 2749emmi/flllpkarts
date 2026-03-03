const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../src/data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Find all laptop products
const laptops = products.filter(p => 
  p.id.startsWith('laptop-') || 
  p.title.toLowerCase().includes('macbook') ||
  p.title.toLowerCase().includes('laptop')
);

console.log(`Found ${laptops.length} laptop products\n`);

laptops.forEach(laptop => {
  console.log(`${laptop.id}: ${laptop.title}`);
  console.log(`  Image: ${laptop.image}`);
  console.log(`  Price: ₹${laptop.price.toLocaleString()}`);
  console.log(`  Has valid Flipkart image: ${laptop.image && laptop.image.includes('rukminim')}`);
  console.log('');
});

// Check for laptops without proper images
const needImages = laptops.filter(l => !l.image || !l.image.includes('rukminim'));

if (needImages.length > 0) {
  console.log(`\n⚠️  ${needImages.length} laptops need image updates:`);
  needImages.forEach(l => {
    console.log(`  - ${l.title} (${l.id})`);
  });
} else {
  console.log('\n✓ All laptops have valid Flipkart images!');
}
