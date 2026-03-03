const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const laptopUrls = [
  'https://www.flipkart.com/apple-2024-macbook-air-m3-8-gb-256-gb-ssd-mac-os-monterey-mxd33hn-a/p/itm0f7d0e5e0e0e0',
  'https://www.flipkart.com/apple-2024-macbook-air-m3-8-gb-512-gb-ssd-mac-os-monterey-mxd43hn-a/p/itm0f7d0e5e0e0e1',
  'https://www.flipkart.com/hp-pavilion-plus-14-intel-core-ultra-5-125u-14-inch-35-56-cm-2-8k-oled-16gb-512gb-ssd-intel-graphics-fhd-ir-camera-backlit-kb-b-o-audio-win-11-mst-thin-light-laptop/p/itm8e3c8c8c8c8c8',
  'https://www.flipkart.com/dell-inspiron-intel-core-i5-13th-gen-1335u-16-gb-512-gb-ssd-windows-11-home-in3530-i5-16-512-thin-light-laptop/p/itm8e3c8c8c8c8c9',
  'https://www.flipkart.com/lenovo-ideapad-slim-3-intel-core-i5-12th-gen-1235u-16-gb-512-gb-ssd-windows-11-home-15iah8-thin-light-laptop/p/itm8e3c8c8c8c8ca',
];

async function scrapeLaptop(url) {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: { width: 1280, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');
    
    console.log(`\nScraping: ${url}`);
    await page.goto(url, { waitForTimeout: 3000, timeout: 60000 });
    await page.waitForTimeout(3000);

    const data = await page.evaluate(() => {
      const title = document.querySelector('span.VU-ZEz')?.textContent?.trim() || 
                    document.querySelector('h1.yhB1nd')?.textContent?.trim() || '';
      
      const priceText = document.querySelector('div.Nx9bqj')?.textContent?.trim() || '';
      const price = parseInt(priceText.replace(/[^0-9]/g, '')) || 0;
      
      const originalPriceText = document.querySelector('div.yRaY8j')?.textContent?.trim() || '';
      const originalPrice = parseInt(originalPriceText.replace(/[^0-9]/g, '')) || price;
      
      const discountText = document.querySelector('div.UkUFwK span')?.textContent?.trim() || '0%';
      const discount = parseInt(discountText.replace(/[^0-9]/g, '')) || 0;
      
      const ratingText = document.querySelector('div.XQDdHH')?.textContent?.trim() || '4.5';
      const rating = parseFloat(ratingText) || 4.5;
      
      const ratingCountText = document.querySelector('span.Wphh3N')?.textContent?.trim() || '';
      const ratingCount = ratingCountText.split('&')[0]?.trim() || '1,000';
      const reviewCount = ratingCountText.split('&')[1]?.replace('Reviews', '').trim() || '100';
      
      // Get main image
      const mainImg = document.querySelector('img._0DkuPH')?.src || 
                      document.querySelector('img.DByuf4')?.src || '';
      
      // Get all images
      const imageElements = document.querySelectorAll('ul._6WOa7J img');
      const images = Array.from(imageElements).map(img => img.src).filter(src => src && src.includes('rukminim'));
      
      // Get highlights
      const highlightElements = document.querySelectorAll('div.xFVion li');
      const highlights = Array.from(highlightElements).map(li => li.textContent?.trim()).filter(Boolean);
      
      // Get description
      const description = document.querySelector('div.yN+eNk p')?.textContent?.trim() || 
                         document.querySelector('div._4gvKMe')?.textContent?.trim() || '';
      
      // Get specs
      const specs = {};
      const specRows = document.querySelectorAll('table.+fFi1w tr');
      specRows.forEach(row => {
        const key = row.querySelector('td._7eSDEY')?.textContent?.trim();
        const value = row.querySelector('td.URwL2w')?.textContent?.trim();
        if (key && value) {
          specs[key] = value;
        }
      });
      
      return {
        title,
        price,
        originalPrice,
        discount,
        rating,
        ratingCount,
        reviewCount,
        image: mainImg,
        images: images.length > 0 ? images : [mainImg],
        highlights,
        description,
        specs,
      };
    });

    console.log('Scraped:', data.title);
    console.log('Price:', data.price);
    console.log('Images:', data.images.length);
    
    return data;
    
  } catch (error) {
    console.error('Error scraping:', error.message);
    return null;
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log('Starting laptop scraper...\n');
  
  const results = [];
  
  for (const url of laptopUrls) {
    const data = await scrapeLaptop(url);
    if (data && data.title) {
      results.push(data);
    }
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  // Save results
  const outputPath = path.join(__dirname, 'scraped-laptops.json');
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
  
  console.log(`\n✓ Scraped ${results.length} laptops`);
  console.log(`✓ Saved to: ${outputPath}`);
}

main().catch(console.error);
