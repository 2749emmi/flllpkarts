const puppeteer = require('puppeteer');

async function testScrape() {
  console.log('Starting test scrape...');
  
  let browser;
  try {
    browser = await puppeteer.launch({ 
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    console.log('Browser launched');
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Test with iPhone 13
    const searchUrl = 'https://www.flipkart.com/search?q=Apple+iPhone+13+Starlight+128+GB';
    
    console.log('Searching:', searchUrl);
    await page.goto(searchUrl, { waitUntil: 'networkidle2', timeout: 30000 });
    
    // Get first product link
    await page.waitForSelector('a[href*="/p/"]', { timeout: 10000 });
    const productLink = await page.evaluate(() => {
      const links = document.querySelectorAll('a[href*="/p/"]');
      return links[0]?.href || null;
    });
    
    console.log('Opening product:', productLink);
    await page.goto(productLink, { waitUntil: 'networkidle2', timeout: 30000 });
    
    await page.waitForSelector('img', { timeout: 10000 });
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Get ONLY product gallery images
    const images = await page.evaluate(() => {
      const imageUrls = [];
      
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
      
      return imageUrls.slice(0, 10);
    });
    
    console.log(`\nFound ${images.length} images:`);
    images.forEach((img, i) => {
      console.log(`${i + 1}. ${img}`);
    });
    
    await browser.close();
    console.log('\nTest complete!');
  } catch (error) {
    console.error('Error:', error.message);
    if (browser) await browser.close();
  }
}

testScrape();
