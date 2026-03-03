const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const productsPath = path.join(__dirname, '../src/data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

console.log(`Total products: ${products.length}`);

// Find products with broken/fake images
const needImageFix = products.filter(p => {
  if (!p.image) return false;
  
  // Products with local paths need fixing
  if (p.image.startsWith('/images/products/')) return true;
  
  // Products with these specific fake URLs need fixing (from the bad script)
  const fakeUrls = [
    'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/m/h/0/-original-imah4zp7hgfhgxfh.jpeg',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/b/c/m/-original-imah2z8ggfphh9fm.jpeg',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/u/n/k/-original-imagypv6nmqhh9fm.jpeg',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/k/l/m/-original-imagypv6zraxt8gg.jpeg',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/2/v/v/-original-imagypv6gfphh9fm.jpeg',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/j/z/4/-original-imagfdf4xnbwdfz2.jpeg',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/r/v/t/-original-imahfey6vqsdzscr.jpeg',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile/a/x/u/-original-imah2z8ggfphh9fm.jpeg',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/headphone/k/l/m/-original-imagypv6zraxt8gg.jpeg',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/smartwatch/u/n/k/-original-imagypv6nmqhh9fm.jpeg',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/headphone/2/v/v/-original-imagypv6gfphh9fm.jpeg',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/data-cable/k/l/m/-original-imagypv6zraxt8gg.jpeg',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/mobile-holder/j/z/4/-original-imagfdf4xnbwdfz2.jpeg',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/headphone/r/v/t/-original-imahfey6vqsdzscr.jpeg',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/screen-guard/a/x/u/-original-imah2z8ggfphh9fm.jpeg',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/t-shirt/k/l/m/-original-imagypv6zraxt8gg.jpeg',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/watch/2/v/v/-original-imagypv6gfphh9fm.jpeg',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/curtain/j/z/4/-original-imagfdf4xnbwdfz2.jpeg',
    'https://rukminim2.flixcart.com/image/312/312/xif0q/serum/r/v/t/-original-imahfey6vqsdzscr.jpeg'
  ];
  
  return fakeUrls.some(fake => p.image.includes(fake.split('?')[0]));
});

console.log(`\nFound ${needImageFix.length} products needing image fixes`);

async function scrapeProductImages(productTitle) {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Search on Flipkart
    const searchQuery = productTitle.replace(/\s+/g, '+');
    const searchUrl = `https://www.flipkart.com/search?q=${searchQuery}`;
    
    console.log(`  Searching: ${searchUrl}`);
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for product links to load
    await page.waitForSelector('a[href*="/p/"]', { timeout: 10000 });
    
    // Get the first product link
    const productLink = await page.evaluate(() => {
      const links = document.querySelectorAll('a[href*="/p/"]');
      for (const link of links) {
        const href = link.href;
        if (href && href.includes('/p/')) {
          return href;
        }
      }
      return null;
    });
    
    if (!productLink) {
      console.log(`  ✗ No product link found`);
      await browser.close();
      return null;
    }
    
    console.log(`  Opening product page: ${productLink}`);
    await page.goto(productLink, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Wait for images to load
    await page.waitForSelector('img', { timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 2000)); // Extra wait for lazy loading
    
    // Get ONLY product gallery images (not all page images)
    const images = await page.evaluate(() => {
      const imageUrls = [];
      
      // Look for the image gallery container specifically
      // Flipkart uses specific classes for product image gallery
      const gallerySelectors = [
        '._2E8Vu4', // Main image gallery container
        '._3kidJX', // Thumbnail container
        '._20Gt85', // Image slider
        '.CXW8mj ul li img', // Gallery list items
        '._2r_T1I img' // Another gallery pattern
      ];
      
      // First try to find the main product image
      const mainImg = document.querySelector('._396cs4._2amPTt img, ._2r_T1I img');
      if (mainImg && mainImg.src && mainImg.src.includes('rukminim')) {
        let src = mainImg.src.replace(/\/\d+\/\d+\//, '/832/832/');
        imageUrls.push(src);
      }
      
      // Then get thumbnail images from gallery
      const thumbnails = document.querySelectorAll('._2E8Vu4 img, ._3kidJX img, .CXW8mj ul li img');
      thumbnails.forEach(img => {
        let src = img.src || img.getAttribute('src');
        if (src && src.includes('rukminim') && !src.includes('placeholder')) {
          src = src.replace(/\/\d+\/\d+\//, '/832/832/');
          if (!imageUrls.includes(src)) {
            imageUrls.push(src);
          }
        }
      });
      
      // Limit to max 10 images (reasonable for a product)
      return imageUrls.slice(0, 10);
    });
    
    await browser.close();
    
    if (images.length > 0) {
      console.log(`  ✓ Found ${images.length} images`);
      return images;
    }
    
    return null;
  } catch (error) {
    console.error(`  Error scraping ${productTitle}:`, error.message);
    await browser.close();
    return null;
  }
}

async function fixImages() {
  console.log('\nStarting image scraping...\n');
  
  const fixedProducts = [...products];
  let fixedCount = 0;
  
  for (let i = 0; i < needImageFix.length; i++) {
    const product = needImageFix[i];
    const index = products.findIndex(p => p.id === product.id);
    
    console.log(`[${i + 1}/${needImageFix.length}] ${product.title.substring(0, 60)}...`);
    
    const newImages = await scrapeProductImages(product.title);
    
    if (newImages && newImages.length > 0) {
      fixedProducts[index] = {
        ...fixedProducts[index],
        image: newImages[0],
        images: newImages
      };
      console.log(`  ✓ Saved ${newImages.length} images\n`);
      fixedCount++;
    } else {
      console.log(`  ✗ No images found\n`);
    }
    
    // Save progress every 5 products
    if ((i + 1) % 5 === 0) {
      fs.writeFileSync(productsPath, JSON.stringify(fixedProducts, null, 2));
      console.log(`  💾 Progress saved (${fixedCount} fixed so far)\n`);
    }
    
    // Rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Final save
  fs.writeFileSync(productsPath, JSON.stringify(fixedProducts, null, 2));
  
  console.log(`\n✓ Fixed ${fixedCount}/${needImageFix.length} product images`);
  console.log(`⚠️  ${needImageFix.length - fixedCount} products still need manual updates`);
}

fixImages().catch(console.error);
