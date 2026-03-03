const puppeteer = require('puppeteer');
const fs = require('fs');

async function debugScrape() {
  console.log('Starting debug scrape...');
  
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });
  
  const productUrl = 'https://www.flipkart.com/apple-iphone-13-starlight-128-gb/p/itmc9604f122ae7f';
  
  console.log('Opening:', productUrl);
  await page.goto(productUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Take screenshot
  await page.screenshot({ path: 'scripts/debug-product-page.png', fullPage: false });
  console.log('Screenshot saved');
  
  // Get all image URLs
  const allImages = await page.evaluate(() => {
    const imgs = Array.from(document.querySelectorAll('img'));
    return imgs.map(img => ({
      src: img.src,
      class: img.className,
      parent: img.parentElement?.className || ''
    })).filter(img => img.src.includes('rukminim'));
  });
  
  console.log(`\nFound ${allImages.length} rukminim images total`);
  console.log('\nFirst 15 images:');
  allImages.slice(0, 15).forEach((img, i) => {
    console.log(`${i + 1}. ${img.src.substring(0, 100)}...`);
    console.log(`   Class: ${img.class}`);
    console.log(`   Parent: ${img.parent}\n`);
  });
  
  await browser.close();
}

debugScrape().catch(console.error);
