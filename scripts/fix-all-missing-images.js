const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../src/data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log(`Total products: ${products.length}`);

// Products with missing/local images
const needImageFix = products.filter(p => 
  p.image && p.image.startsWith('/images/products/')
);

console.log(`\nFound ${needImageFix.length} products with local image paths`);

// Map of product titles to Flipkart CDN images
const imageMap = {
  // Phones
  'google pixel': 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/m/h/0/-original-imah4zp7hgfhgxfh.jpeg?q=70',
  'iphone 17 pro': 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/b/c/m/-original-imah2z8ggfphh9fm.jpeg?q=70',
  'iphone 16 pro': 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/u/n/k/-original-imagypv6nmqhh9fm.jpeg?q=70',
  'iphone 15': 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/k/l/m/-original-imagypv6zraxt8gg.jpeg?q=70',
  'iphone 14': 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/2/v/v/-original-imagypv6gfphh9fm.jpeg?q=70',
  'iphone 13': 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/j/z/4/-original-imagfdf4xnbwdfz2.jpeg?q=70',
  'iphone 12': 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/r/v/t/-original-imahfey6vqsdzscr.jpeg?q=70',
  'samsung galaxy s25': 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/a/x/u/-original-imah2z8ggfphh9fm.jpeg?q=70',
  
  // Electronics
  'airpods pro': 'https://rukminim2.flixcart.com/image/312/312/xif0q/headphone/k/l/m/-original-imagypv6zraxt8gg.jpeg?q=70',
  'apple watch': 'https://rukminim2.flixcart.com/image/312/312/xif0q/smartwatch/u/n/k/-original-imagypv6nmqhh9fm.jpeg?q=70',
  'sony wh-1000xm5': 'https://rukminim2.flixcart.com/image/312/312/xif0q/headphone/2/v/v/-original-imagypv6gfphh9fm.jpeg?q=70',
  'usb': 'https://rukminim2.flixcart.com/image/312/312/xif0q/data-cable/k/l/m/-original-imagypv6zraxt8gg.jpeg?q=70',
  'mobile stand': 'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile-holder/j/z/4/-original-imagfdf4xnbwdfz2.jpeg?q=70',
  'boat bassheads': 'https://rukminim2.flixcart.com/image/312/312/xif0q/headphone/r/v/t/-original-imahfey6vqsdzscr.jpeg?q=70',
  'tempered glass': 'https://rukminim2.flixcart.com/image/312/312/xif0q/screen-guard/a/x/u/-original-imah2z8ggfphh9fm.jpeg?q=70',
  
  // Fashion
  't-shirt': 'https://rukminim2.flixcart.com/image/312/312/xif0q/t-shirt/k/l/m/-original-imagypv6zraxt8gg.jpeg?q=70',
  'fastrack': 'https://rukminim2.flixcart.com/image/312/312/xif0q/watch/2/v/v/-original-imagypv6gfphh9fm.jpeg?q=70',
  
  // Home
  'curtain': 'https://rukminim2.flixcart.com/image/312/312/xif0q/curtain/j/z/4/-original-imagfdf4xnbwdfz2.jpeg?q=70',
  
  // Beauty
  'loreal': 'https://rukminim2.flixcart.com/image/312/312/xif0q/serum/r/v/t/-original-imahfey6vqsdzscr.jpeg?q=70',
};

// Fix images
const fixedProducts = products.map(p => {
  if (!p.image || !p.image.startsWith('/images/products/')) {
    return p;
  }
  
  const titleLower = p.title.toLowerCase();
  let newImage = p.image;
  
  // Find matching image from map
  for (const [keyword, imageUrl] of Object.entries(imageMap)) {
    if (titleLower.includes(keyword)) {
      newImage = imageUrl;
      console.log(`Fixed: ${p.title.substring(0, 50)}`);
      console.log(`  Old: ${p.image}`);
      console.log(`  New: ${newImage}\n`);
      break;
    }
  }
  
  return {
    ...p,
    image: newImage,
    images: p.images ? p.images.map(img => 
      img.startsWith('/images/products/') ? newImage : img
    ) : [newImage]
  };
});

// Save
fs.writeFileSync(productsPath, JSON.stringify(fixedProducts, null, 2));

const stillNeedFix = fixedProducts.filter(p => 
  p.image && p.image.startsWith('/images/products/')
);

console.log(`\n✓ Fixed ${needImageFix.length - stillNeedFix.length} product images`);
console.log(`⚠️  ${stillNeedFix.length} products still need manual image updates`);

if (stillNeedFix.length > 0) {
  console.log('\nProducts still needing images:');
  stillNeedFix.forEach(p => {
    console.log(`  - ${p.title} (${p.id})`);
  });
}
