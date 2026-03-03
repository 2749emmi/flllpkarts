const puppeteer = require('puppeteer');

async function scrapeImages(productTitle) {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Search
    const searchQuery = productTitle.replace(/\s+/g, '+');
    const searchUrl = `https://www.flipkart.com/search?q=${searchQuery}`;
    
    console.log(`Searching: ${productTitle}`);
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Get first product link
    const productLink = await page.evaluate(() => {
      const link = document.querySelector('a[href*="/p/"]');
      return link ? link.href : null;
    });
    
    if (!productLink) {
      console.log('No product found');
      await browser.close();
      return null;
    }
    
    console.log(`Opening product page...`);
    await page.goto(productLink, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for images to load
    
    // Get product images - look for images in specific size patterns
    const images = await page.evaluate(() => {
      const imageSet = new Set();
      const imgs = document.querySelectorAll('img[src*="rukminim"]');
      
      imgs.forEach(img => {
        let src = img.src;
        // Only get large product images (832x832 or 416x416 patterns)
        if (src.includes('/832/832/') || src.includes('/416/416/') || src.includes('/312/312/')) {
          // Normalize to 832x832 for high quality
          src = src.replace(/\/\d+\/\d+\//, '/832/832/');
          // Remove query params for deduplication
          const cleanSrc = src.split('?')[0];
          imageSet.add(cleanSrc + '?q=70');
        }
      });
      
      return Array.from(imageSet).slice(0, 8); // Max 8 images per product
    });
    
    await browser.close();
    
    if (images.length > 0) {
      console.log(`✓ Found ${images.length} images\n`);
      return images;
    }
    
    console.log('✗ No images found\n');
    return null;
    
  } catch (error) {
    console.error(`Error: ${error.message}`);
    await browser.close();
    return null;
  }
}

// Test
scrapeImages('Apple iPhone 13 Starlight 128 GB').then(images => {
  if (images) {
    console.log('Images:');
    images.forEach((img, i) => console.log(`${i + 1}. ${img}`));
  }
});
