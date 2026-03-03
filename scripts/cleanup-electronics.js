const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, '../src/data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log(`Total products: ${products.length}`);

// Remove "Are you a human?" products
const withoutHuman = products.filter(p => {
  if (p.title.toLowerCase().includes('are you a human')) {
    console.log(`Removing: ${p.title}`);
    return false;
  }
  return true;
});

console.log(`Removed ${products.length - withoutHuman.length} "Are you a human?" products`);

// Fix prices for products with missing images or 99% discount in electronics
const fixedProducts = withoutHuman.map(p => {
  if (p.category !== 'electronics') return p;
  
  // Check if product has missing image or extreme discount
  const hasMissingImage = !p.image || p.image.startsWith('/images/products/') && !p.image.includes('airpods') && !p.image.includes('usb');
  const hasExtremeDiscount = p.discount >= 99;
  
  if (!hasMissingImage && !hasExtremeDiscount) return p;
  
  // Fix prices based on product type
  let newPrice = p.price;
  let newOriginalPrice = p.originalPrice;
  
  if (p.title.toLowerCase().includes('ipad')) {
    newPrice = 49999;
    newOriginalPrice = 124900;
  } else if (p.title.toLowerCase().includes('airpods pro')) {
    newPrice = 19990;
    newOriginalPrice = 24900;
  } else if (p.title.toLowerCase().includes('apple watch')) {
    newPrice = 39990;
    newOriginalPrice = 46900;
  } else if (p.title.toLowerCase().includes('sony') && p.title.toLowerCase().includes('headphone')) {
    newPrice = 24990;
    newOriginalPrice = 34990;
  } else if (p.title.toLowerCase().includes('usb') || p.title.toLowerCase().includes('cable')) {
    newPrice = 199;
    newOriginalPrice = 499;
  } else if (p.title.toLowerCase().includes('stand') || p.title.toLowerCase().includes('holder')) {
    newPrice = 149;
    newOriginalPrice = 499;
  } else if (p.title.toLowerCase().includes('boat') && p.title.toLowerCase().includes('earphone')) {
    newPrice = 299;
    newOriginalPrice = 599;
  } else {
    // Default pricing for other electronics
    if (p.originalPrice > 50000) {
      newPrice = 49999;
    } else if (p.originalPrice > 20000) {
      newPrice = 19990;
    } else if (p.originalPrice > 5000) {
      newPrice = 4990;
    } else if (p.originalPrice > 1000) {
      newPrice = 999;
    } else {
      newPrice = 299;
    }
    newOriginalPrice = p.originalPrice;
  }
  
  const newDiscount = Math.round(((newOriginalPrice - newPrice) / newOriginalPrice) * 100);
  
  console.log(`Fixed: ${p.title}`);
  console.log(`  Old: ₹${p.price} (${p.discount}% off)`);
  console.log(`  New: ₹${newPrice} (${newDiscount}% off)`);
  
  return {
    ...p,
    price: newPrice,
    originalPrice: newOriginalPrice,
    discount: newDiscount
  };
});

// Remove duplicates
const seenIds = new Set();
const uniqueProducts = fixedProducts.filter(p => {
  if (seenIds.has(p.id)) {
    console.log(`Removing duplicate: ${p.id} - ${p.title}`);
    return false;
  }
  seenIds.add(p.id);
  return true;
});

console.log(`\nRemoved ${fixedProducts.length - uniqueProducts.length} duplicates`);

// Save
fs.writeFileSync(productsPath, JSON.stringify(uniqueProducts, null, 2));

console.log(`\n✓ Cleanup complete!`);
console.log(`✓ Final count: ${uniqueProducts.length} products`);

// Show electronics products
const electronics = uniqueProducts.filter(p => p.category === 'electronics');
console.log(`\nElectronics products (${electronics.length}):`);
electronics.forEach(e => {
  console.log(`  ${e.title.substring(0, 50)} - ₹${e.price.toLocaleString()} (${e.discount}% off)`);
});
