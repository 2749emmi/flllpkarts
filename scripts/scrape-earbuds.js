import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Real earbud URLs from Flipkart
const earbudUrls = [
  'https://www.flipkart.com/apple-airpods-pro-2nd-generation-bluetooth-headset/p/itmbfc083335b35c',
  'https://www.flipkart.com/boat-airdopes-100-50-hours-playback-quad-mics-enx-technology-beast-mode-bluetooth-headset/p/itm9f7be4649c78a',
  'https://www.flipkart.com/boat-airdopes-800-w-dolby-audio-4-mics-ai-enx-tech-titanium-drivers-asap-charge-bluetooth/p/itm311c5717b8fcc',
  'https://www.flipkart.com/boat-airdopes-101-bluetooth-headset/p/itmdb4a17a4e64c2',
  'https://www.flipkart.com/boat-121-pro-plus-bluetooth/p/itmff39a7d38cca2',
];

const dataPath = path.join(__dirname, '../src/data/products.json');

async function scrapeProduct(page, url) {
  try {
    console.log(`\n📡 Scraping: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    await page.waitForSelector('h1, .VU-ZEz', { timeout: 10000 });

    const data = await page.evaluate(() => {
      const getText = (selectors) => {
        for (let sel of selectors) {
          const el = document.querySelector(sel);
          if (el?.textContent?.trim()) return el.textContent.trim();
        }
        return '';
      };

      const title = getText(['h1 span.VU-ZEz', 'h1.yhB1nd', 'h1', '.VU-ZEz']);
      const price = getText(['.Nx9bqj.CxhGGd', '._30jeq3._16Jk6d', '._30jeq3']);
      const originalPrice = getText(['.yRaY8j.A6+E5c', '._3I9_wc._27UcVY', '._3I9_wc']);
      const discount = getText(['.UkUFwK.WW8yVX', '._3Ay6Sb._31Dcoz', '._3Ay6Sb']);
      const rating = getText(['.XQDdHH', '._3LWZlK']);
      const ratingCount = getText(['.Wphh3N span:first-child', '._2_R_DZ span']);
      const reviewCount = getText(['.Wphh3N span:last-child', '._2_R_DZ span']);

      // Images
      const images = [];
      document.querySelectorAll('img').forEach(img => {
        const src = img.src || img.getAttribute('src');
        if (src && src.includes('rukminim') && !images.includes(src)) {
          const highRes = src.replace(/\/image\/\d+\/\d+\//, '/image/832/832/');
          images.push(highRes);
        }
      });

      // Highlights
      const highlights = [];
      document.querySelectorAll('ul.G4BRas li, div._7eSDEY ul li').forEach(li => {
        const text = li.textContent?.trim();
        if (text && text.length > 5) highlights.push(text);
      });

      // Specs
      const specs = {};
      document.querySelectorAll('table tr').forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
          const key = cells[0].textContent?.trim();
          const val = cells[cells.length - 1].textContent?.trim();
          if (key && val && key.length < 100) specs[key] = val;
        }
      });

      return { title, price, originalPrice, discount, rating, ratingCount, reviewCount, images, highlights, specs };
    });

    const numPrice = parseInt(data.price.replace(/[^0-9]/g, '')) || 0;
    const numOriginalPrice = parseInt(data.originalPrice.replace(/[^0-9]/g, '')) || numPrice * 2;
    const numDiscount = parseInt(data.discount.replace(/[^0-9]/g, '')) || Math.round((1 - numPrice / numOriginalPrice) * 100);

    const product = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      title: data.title || 'Unknown Product',
      price: numPrice,
      originalPrice: numOriginalPrice,
      discount: numDiscount,
      image: data.images[0] || '',
      rating: parseFloat(data.rating) || 4.5,
      ratingCount: data.ratingCount.replace(/[^0-9,]/g, '') || '1,000',
      reviewCount: data.reviewCount.replace(/[^0-9,]/g, '') || '100',
      category: 'electronics',
      offers: [
        'Bank Offer: 5% Cashback on Flipkart Axis Bank Card',
        'Special Price: Get extra 10% off (price inclusive of cashback/coupon)',
      ],
      highlights: data.highlights.slice(0, 6),
      description: data.highlights.join('. '),
      images: data.images.slice(0, 8),
      specs: data.specs,
      reviews: [],
      brand: data.title.split(' ')[0] || 'Generic',
      seller: 'RetailNet',
      variants: [],
    };

    console.log(`✅ Scraped: ${product.title}`);
    console.log(`   Price: ₹${product.price} | Discount: ${product.discount}% | Images: ${product.images.length}`);
    
    return product;
  } catch (err) {
    console.error(`❌ Failed: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log('🚀 Starting earbud scraper...\n');
  
  const browser = await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920,1080',
    ],
  });

  const products = [];

  for (const url of earbudUrls) {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    const product = await scrapeProduct(page, url);
    if (product) products.push(product);
    
    await page.close();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s between requests
  }

  await browser.close();

  console.log(`\n✨ Successfully scraped ${products.length} products!`);

  // Load existing products
  let existingProducts = [];
  if (fs.existsSync(dataPath)) {
    existingProducts = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));
  }

  // Remove fake AirPods products (those with phone specs)
  console.log('\n🧹 Cleaning fake products...');
  const cleaned = existingProducts.filter(p => {
    const isFakeAirPods = p.title.toLowerCase().includes('airpods') && 
                          (p.highlights?.some(h => h.includes('ROM') || h.includes('Display') || h.includes('Camera')) ||
                           p.specs?.['Display Size'] || p.specs?.['Internal Storage']);
    if (isFakeAirPods) {
      console.log(`   Removed fake: ${p.title}`);
    }
    return !isFakeAirPods;
  });

  // Add new products
  const updated = [...cleaned, ...products];
  fs.writeFileSync(dataPath, JSON.stringify(updated, null, 2));
  
  console.log(`\n💾 Saved to ${dataPath}`);
  console.log(`   Total products: ${updated.length}`);
  console.log(`   Removed: ${existingProducts.length - cleaned.length} fake products`);
  console.log(`   Added: ${products.length} real earbuds`);
  console.log('\n✅ Done!');
}

main().catch(console.error);
