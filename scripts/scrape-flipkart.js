#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

try { require.resolve('puppeteer-extra'); require.resolve('puppeteer-extra-plugin-stealth'); }
catch { console.error('\n  Install deps first:\n  npm install puppeteer puppeteer-extra puppeteer-extra-plugin-stealth\n'); process.exit(1); }

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const OUTPUT_PATH = path.join(__dirname, 'scraped-product.json');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

async function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) Chrome/131.0.0.0' } }, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(destPath);
        return downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(destPath);
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(destPath); });
    }).on('error', err => { file.close(); try { fs.unlinkSync(destPath); } catch { } reject(err); });
  });
}

function slugify(str) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 60);
}

async function scrapeProduct(browser, url) {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  try {
    console.log(`  Navigating to: ${url}`);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
    await delay(8000);

    // Close modals
    try {
      const btns = await page.$$('button');
      for (const btn of btns) {
        const text = await page.evaluate(el => el.textContent?.trim(), btn);
        if (text === '✕' || text === '×') { await btn.click(); break; }
      }
    } catch { }

    // Scroll page to load lazy content
    console.log('  Scrolling page...');
    await page.evaluate(async () => {
      for (let y = 0; y < document.body.scrollHeight; y += 400) {
        window.scrollTo(0, y);
        await new Promise(r => setTimeout(r, 150));
      }
      window.scrollTo(0, 0);
    });
    await delay(2000);

    // Click "Show More" / "All details" buttons to expand specs
    console.log('  Expanding specs/details...');
    try {
      const clickable = await page.$$('button, span, div');
      for (const el of clickable) {
        const text = await page.evaluate(e => e.textContent?.trim(), el);
        if (text === 'Show More' || text === 'All details' || text === 'Read More') {
          await el.click();
          await delay(1000);
        }
      }
    } catch { }
    await delay(2000);

    // Hover thumbnails to load high-res images
    console.log('  Hovering thumbnails...');
    const thumbs = await page.$$('img[src*="80/110"], img[src*="80/80"]');
    for (const thumb of thumbs) {
      try { await thumb.hover(); await delay(400); } catch { }
    }
    await delay(1000);

    // Get full page text
    const fullText = await page.evaluate(() => document.body.innerText);

    // Extract all image URLs
    const productImages = await page.evaluate(() => {
      const urls = new Set();
      const seen = new Set();
      document.querySelectorAll('img').forEach(img => {
        const src = img.src || '';
        if (src.includes('rukminim') && src.includes('/image/')) {
          const highRes = src.replace(/\/image\/\d+\/\d+\//, '/image/832/832/');
          const key = highRes.replace(/\?.*$/, '');
          if (!seen.has(key) && !src.includes('/promos/') && !src.includes('/cms-') && !src.includes('/fk-p-') && !src.includes('/blobio/') && !src.includes('/www/')) {
            seen.add(key);
            urls.add(highRes);
          }
        }
      });
      return [...urls];
    });

    // Parse structured data from page text
    const data = parsePageText(fullText, productImages);

    // Try to extract specs via DOM (table structure)
    const domSpecs = await page.evaluate(() => {
      const specs = {};
      document.querySelectorAll('table').forEach(table => {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 2) {
            const key = cells[0].textContent.trim();
            const val = cells[cells.length - 1].textContent.trim();
            if (key.length > 2 && key.length < 60 && val.length > 0 && val.length < 300) {
              specs[key] = val;
            }
          }
        });
      });
      return specs;
    });

    if (Object.keys(domSpecs).length > 0) {
      data.specs = { ...data.specs, ...domSpecs };
    }

    // Try extracting variants from the DOM (color, storage etc)
    const domVariants = await page.evaluate(() => {
      const variants = [];
      // Flipkart usually puts variant sections in divs containing list items
      document.querySelectorAll('.aMaAEs').forEach(container => {
        const sections = container.querySelectorAll('.mMt9-n');
        sections.forEach(sec => {
          const labelEl = sec.querySelector('.Otb-b_');
          if (labelEl) {
            const label = labelEl.textContent.trim();
            const options = [];
            sec.querySelectorAll('ul li').forEach(li => {
              const optText = li.textContent.trim();
              const isAvailable = !li.classList.contains('CHzS-c');
              if (optText) options.push({ name: optText, available: isAvailable });
            });
            if (options.length > 0) {
              variants.push({ type: label, options });
            }
          }
        });
      });
      return variants;
    });

    if (domVariants.length > 0) {
      data.variants = domVariants;
    }

    // Take screenshot
    await page.screenshot({ path: path.join(__dirname, `screenshot-${slugify(data.title || 'product')}.png`) });

    return { ...data, sourceUrl: url, scrapedAt: new Date().toISOString() };
  } finally {
    await page.close();
  }
}

function parsePageText(text, images) {
  const lines = text.split('\n').map(l => l.trim());

  // Title: pattern "BRAND\nProduct Name (Variant, Size)"
  let title = '';
  let brand = '';
  for (let i = 0; i < Math.min(lines.length, 80); i++) {
    if (/^(APPLE|SAMSUNG|ONEPLUS|XIAOMI|REALME|OPPO|VIVO|GOOGLE|NOTHING|SONY|LG|MOTOROLA|NOKIA|HUAWEI|HONOR|ASUS|LENOVO|BOAT|JBL|BOSE)$/i.test(lines[i])) {
      brand = lines[i].charAt(0).toUpperCase() + lines[i].slice(1).toLowerCase();
      const nextLine = lines[i + 1] || '';
      if (nextLine.includes('(') && nextLine.includes(')')) {
        title = `${brand} ${nextLine}`;
        break;
      }
    }
  }
  if (!title) {
    const titleMatch = text.match(/((?:Apple|Samsung|OnePlus|Xiaomi|Realme|OPPO|vivo|Google|Nothing)[^\n]+?\([^)]+\))/);
    if (titleMatch) title = titleMatch[1].trim();
  }

  // Price
  let price = 0;
  let originalPrice = 0;
  const priceLineIdx = lines.findIndex(l => l === (brand || 'APPLE').toUpperCase());
  if (priceLineIdx > -1) {
    for (let i = priceLineIdx; i < Math.min(priceLineIdx + 10, lines.length); i++) {
      const m = lines[i].match(/^₹([0-9,]+)$/);
      if (m) {
        const val = parseInt(m[1].replace(/,/g, ''));
        if (!price) price = val;
        else if (!originalPrice && val !== price) originalPrice = val;
      }
    }
  }
  if (!originalPrice) originalPrice = price;

  // Rating
  let rating = 0;
  let ratingCount = '';
  const ratingMatch = text.match(/(\d\.\d)\n\| (\d[\d,]*)/);
  if (ratingMatch) {
    rating = parseFloat(ratingMatch[1]);
    ratingCount = ratingMatch[2];
  }

  // Highlights
  const highlights = [];
  const hlStart = lines.indexOf('Product highlights');
  if (hlStart > -1) {
    for (let i = hlStart + 1; i < lines.length; i++) {
      if (lines[i] === 'All details' || lines[i] === 'Showcase' || lines[i] === 'Specifications') break;
      if (lines[i].length > 5 && lines[i].length < 200) highlights.push(lines[i]);
    }
  }

  // Bank offers
  const offers = [];
  const bankOfferStart = lines.indexOf('Bank offers');
  if (bankOfferStart > -1) {
    let currentOffer = '';
    for (let i = bankOfferStart + 1; i < Math.min(bankOfferStart + 50, lines.length); i++) {
      if (lines[i] === 'Bank offers' || lines[i] === 'View EMI offers') break;
      if (lines[i] === 'Apply') {
        if (currentOffer) offers.push(currentOffer.trim());
        currentOffer = '';
      } else if (lines[i].match(/^₹[\d,]+ off$/)) {
        currentOffer = lines[i];
      } else if (currentOffer && lines[i].length > 2) {
        currentOffer += ' ' + lines[i];
      }
    }
  }

  // Seller
  const sellerMatch = text.match(/Fulfilled by ([^\n]+)/);
  const seller = sellerMatch ? sellerMatch[1].trim() : '';

  // Warranty & delivery info
  const warrantyMatch = text.match(/([^\n]*(?:Warranty|warranty)[^\n]*)/);
  const warranty = warrantyMatch ? warrantyMatch[1].trim() : '';

  // Reviews
  const reviews = [];
  const ratingsStart = lines.indexOf('Ratings and reviews');
  if (ratingsStart > -1) {
    let i = ratingsStart + 1;
    // Skip the summary section (rating categories)
    while (i < lines.length && !lines[i].match(/^\d$/)) i++;

    while (i < lines.length && reviews.length < 8) {
      if (lines[i].match(/^[1-5]$/) && i + 2 < lines.length) {
        const reviewRating = parseInt(lines[i]);
        const reviewTitle = lines[i + 1];
        const dateLine = lines[i + 2];
        if (dateLine.match(/ago|month|week|day|year/i)) {
          let comment = '';
          let author = 'Flipkart User';
          let j = i + 3;
          while (j < lines.length && !lines[j].match(/^[1-5]$/) && lines[j] !== 'Show all reviews') {
            if (lines[j].match(/Reviewer$/) && j > 0 && lines[j - 1].match(/^[A-Z]/)) {
              author = lines[j - 1];
            } else if (!lines[j].match(/^\d+$/) && !lines[j].match(/Reviewer$/)) {
              comment += (comment ? ' ' : '') + lines[j];
            }
            j++;
          }
          reviews.push({
            rating: reviewRating,
            title: reviewTitle,
            date: dateLine,
            comment: comment.substring(0, 500),
            author,
            verifiedPurchase: true,
            likes: 0,
            dislikes: 0,
          });
          i = j;
        } else {
          i++;
        }
      } else if (lines[i] === 'Show all reviews') {
        break;
      } else {
        i++;
      }
    }
  }

  // Specs (from text between "Specifications" and "Warranty" / "Manufacturer info")
  const specs = {};
  const specStart = lines.indexOf('Specifications');
  if (specStart > -1) {
    const specEnd = lines.findIndex((l, idx) => idx > specStart && (l === 'Warranty' || l === 'Manufacturer info' || l === 'Ratings and reviews'));
    const specLines = lines.slice(specStart + 1, specEnd > specStart ? specEnd : specStart + 100);
    for (let i = 0; i < specLines.length - 1; i++) {
      const key = specLines[i];
      const val = specLines[i + 1];
      if (key.length > 2 && key.length < 60 && val && val.length > 0 && val.length < 300 &&
        key !== 'Show More' && key !== 'Show Less' && !key.match(/^[A-Z][a-z]+ [A-Z][a-z]+$/) &&
        !val.match(/^(Show More|Show Less)$/)) {
        specs[key] = val;
        i++;
      }
    }
  }

  // Discount
  const discount = originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0;

  return {
    title,
    price,
    originalPrice,
    discount,
    images,
    rating,
    ratingCount,
    reviewCount: ratingCount,
    highlights,
    specs,
    offers,
    description: highlights.join('. ') + (warranty ? '. ' + warranty : ''),
    brand,
    seller,
    category: 'mobiles',
    reviews,
  };
}

async function downloadProductImages(product, productSlug) {
  if (!product.images || product.images.length === 0) return product;

  fs.mkdirSync(IMAGES_DIR, { recursive: true });
  const localImages = [];

  for (let i = 0; i < product.images.length; i++) {
    const url = product.images[i];
    const ext = url.match(/\.(jpe?g|png|webp)/)?.[1] || 'jpeg';
    const filename = `${productSlug}-${i + 1}.${ext}`;
    const destPath = path.join(IMAGES_DIR, filename);

    try {
      if (!fs.existsSync(destPath)) {
        await downloadImage(url, destPath);
        console.log(`    Downloaded: ${filename}`);
      } else {
        console.log(`    Exists: ${filename}`);
      }
      localImages.push(`/images/products/${filename}`);
    } catch (err) {
      console.log(`    Failed: ${filename} - ${err.message}`);
      localImages.push(url);
    }
  }

  return { ...product, images: localImages, image: localImages[0] || product.image };
}

async function main() {
  const args = process.argv.slice(2);
  const downloadLocal = args.includes('--download');
  const urls = args.filter(a => a.startsWith('http')).flatMap(a => a.split(',')).map(u => u.trim()).filter(u => u);

  if (!urls.length) {
    console.log('Usage: node scrape-flipkart.js <url1> [url2] [--download]');
    console.log('');
    console.log('Options:');
    console.log('  --download    Download images locally to public/images/products/');
    console.log('');
    console.log('Examples:');
    console.log('  node scrape-flipkart.js "https://www.flipkart.com/product-url"');
    console.log('  node scrape-flipkart.js "url1" "url2" "url3" --download');
    process.exit(1);
  }

  console.log(`\nScraping ${urls.length} product(s)...\n`);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1920,1080', '--disable-blink-features=AutomationControlled'],
  });

  const results = [];

  for (let i = 0; i < urls.length; i++) {
    console.log(`[${i + 1}/${urls.length}] Scraping...`);
    try {
      let data = await scrapeProduct(browser, urls[i]);

      if (downloadLocal && data.images?.length) {
        console.log('  Downloading images...');
        const urlPath = urls[i].split('/p/')[0].split('/').pop() || '';
        const slug = slugify(data.title || urlPath || `product-${Date.now()}-${i}`);
        data = await downloadProductImages(data, slug);
      }

      results.push(data);
      console.log(`  ✓ "${data.title}" — ${data.images.length} images, ${data.reviews.length} reviews`);
    } catch (err) {
      console.error(`  ✗ Error: ${err.message}`);
      results.push({ error: err.message, sourceUrl: urls[i] });
    }

    if (i < urls.length - 1) {
      console.log('  Waiting between requests...');
      await delay(3000 + Math.random() * 2000);
    }
  }

  await browser.close();

  const output = results.length === 1 ? results[0] : results;
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2));
  console.log(`\nSaved to ${OUTPUT_PATH}`);
  console.log('\n--- Summary ---');
  results.forEach((r, i) => {
    if (r.error) console.log(`  ${i + 1}. ERROR: ${r.error}`);
    else console.log(`  ${i + 1}. ${r.title} — ₹${r.price?.toLocaleString()} — ${r.images?.length} imgs — ${Object.keys(r.specs || {}).length} specs — ${r.reviews?.length} reviews`);
  });
}

main().catch(e => { console.error(e); process.exit(1); });
