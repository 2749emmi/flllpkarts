const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const productsPath = path.join(__dirname, '../src/data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log(`Total products: ${products.length}`);

// Find products with broken/fake images
const fakeUrls = [
  'imah4zp7hgfhgxfh', 'imah2z8ggfphh9fm', 'imagypv6nmqhh9fm',
  'imagypv6zraxt8gg', 'imagypv6gfphh9fm', 'imagfdf4xnbwdfz2',
  'imahfey6vqsdzscr'
];

const needImageFix = products.filter(p => {
  if (!p.image) return false;
  if (p.image.startsWith('/images/products/')) return true;
  return fakeUrls.some(fake => p.image.includes(fake));
});

console.log(`Found ${needImageFix.length} products needing fixes\n`);

async function scrapeImages(productTitle) {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    const searchQuery = productTitle.replace(/[()]/g, '').replace(/\s+/g, '+');
    const searchUrl = `https://www.flipkart.com/search?q=${searchQuery}`;
    
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const productLink = await page.evaluate(() => {
      const link = document.querySelector('a[href*="/p/"]');
      return link ? link.href : null;
    });
    
    if (!productLink) {
      await browser.close();
      return null;
    }
    
    await page.goto(productLink, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 4000));
    
    const images = await page.evaluate(() => {
      const imageSet = new Set();
      const imgs = document.querySelectorAll('img[src*="rukminim"]');
      
      imgs.forEach(img => {
        let src = img.src;
        if (src.includes('/832/832/') || src.includes('/416/416/') || src.includes('/312/312/')) {
          src = src.replace(/\/\d+\/\d+\//, '/832/832/');
          const cleanSrc = src.split('?')[0];
          imageSet.add(cleanSrc + '?q=70');
        }
      });
      
      return Array.from(imageSet).slice(0, 8);
    });
    
    await browser.close();
    return images.length > 0 ? images : null;
    
  } catch (error) {
    await browser.close();
    return null;
  }
}

async function fixImages() {
  const fixedProducts = [...products];
  let fixedCount = 0;
  
  for (let i = 0; i < Math.min(needImageFix.length, 20); i++) { // Limit to 20 for now
    const product = needImageFix[i];
    const index = products.findIndex(p => p.id === product.id);
    
    console.log(`[${i + 1}/20] ${product.title.substring(0, 50)}...`);
    
    const newImages = await scrapeImages(product.title);
    
    if (newImages) {
      fixedProducts[index] = {
        ...fixedProducts[index],
        image: newImages[0],
        images: newImages
      };
      console.log(`  ✓ Got ${newImages.length} images\n`);
      fixedCount++;
    } else {
      console.log(`  ✗ Failed\n`);
    }
    
    if ((i + 1) % 5 === 0) {
      fs.writeFileSync(productsPath, JSON.stringify(fixedProducts, null, 2));
      console.log(`💾 Saved progress (${fixedCount} fixed)\n`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 1500));
  }
  
  fs.writeFileSync(productsPath, JSON.stringify(fixedProducts, null, 2));
  console.log(`\n✓ Fixed ${fixedCount}/20 products`);
}

fixImages().catch(console.error);
