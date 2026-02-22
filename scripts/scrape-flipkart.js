#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');

try { require.resolve('cheerio'); }
catch { console.error('\n  Install deps first:\n  npm install cheerio\n'); process.exit(1); }

const cheerio = require('cheerio');

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

async function scrapeProduct(url) {
  try {
    console.log(`  Fetching HTML for: ${url}`);

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Images
    const productImages = [];
    const seenImages = new Set();
    $('img').each((i, el) => {
      let src = $(el).attr('src') || $(el).attr('data-url') || '';
      if (src.includes('rukminim') && src.includes('/image/')) {
        const highRes = src.replace(/\/image\/\d+\/\d+\//, '/image/832/832/');
        const key = highRes.replace(/\?.*$/, '');
        if (!seenImages.has(key) && !src.includes('/promos/') && !src.includes('/cms-') && !src.includes('/fk-p-') && !src.includes('/blobio/') && !src.includes('/www/')) {
          seenImages.add(key);
          productImages.push(highRes);
        }
      }
    });

    // Replace <br> and other block elements with newlines for innerText simulation
    $('br').replaceWith('\n');
    $('script, style, noscript, svg, header, footer, nav, iframe').remove();
    $('div, p, h1, h2, h3, h4, h5, h6, li, tr').prepend('\n');
    const fullText = $('body').text().replace(/\n+/g, '\n');

    const data = parsePageText(fullText, productImages);

    // Try to extract specs via DOM (table structure)
    const domSpecs = {};
    $('table tr').each((i, row) => {
      const cells = $(row).find('td');
      if (cells.length >= 2) {
        const key = $(cells[0]).text().trim();
        const val = $(cells[cells.length - 1]).text().trim();
        if (key.length > 2 && key.length < 60 && val.length > 0 && val.length < 300) {
          domSpecs[key] = val;
        }
      }
    });

    if (Object.keys(domSpecs).length > 0) {
      data.specs = { ...data.specs, ...domSpecs };
    }

    // Try extracting variants from the DOM (color, storage etc)
    const domVariants = [];
    $('.InyRmc, .\\_3Z5yFS').each((i, container) => {
      const type = $(container).find('.\\_25b18c, .\\_2fIbwP').text().trim();
      if (!type) return;

      const options = [];
      $(container).find('li').each((j, li) => {
        const title = $(li).attr('title') || $(li).text().trim() || $(li).find('a').text().trim() || $(li).find('.\\_4zdo').text().trim();
        const a = $(li).find('a').first();
        const optionUrl = a.length ? 'https://www.flipkart.com' + a.attr('href') : '';
        const isCurrent = $(li).hasClass('RcXBOT') || $(li).hasClass('\\_3V2w15');

        let imgUrl = $(li).find('img').attr('src') || '';
        if (imgUrl && imgUrl.includes('/image/')) {
          imgUrl = imgUrl.replace(/\/image\/\d+\/\d+\//, '/image/128/128/');
        }

        if (title && title.length > 1) {
          options.push({ name: title, url: optionUrl, isCurrent: !!isCurrent, image: imgUrl });
        }
      });

      if (options.length > 0) {
        domVariants.push({ type, options });
      }
    });

    if (domVariants.length > 0) {
      data.variants = domVariants;
    }

    return { ...data, sourceUrl: url, scrapedAt: new Date().toISOString() };
  } catch (err) {
    throw err;
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
  console.log(`    parsePageText: Rating Start -> ${ratingsStart}`);
  if (ratingsStart > -1) {
    let i = ratingsStart + 1;
    // Skip the summary section (rating categories)
    let safeCount1 = 0;
    while (i < lines.length && !lines[i].match(/^\d$/) && safeCount1++ < 1000) i++;

    let safeCount2 = 0;
    while (i < lines.length && reviews.length < 8 && safeCount2++ < 5000) {
      if (lines[i].match(/^[1-5]$/) && i + 2 < lines.length) {
        const reviewRating = parseInt(lines[i]);
        const reviewTitle = lines[i + 1];
        const dateLine = lines[i + 2];
        if (dateLine.match(/ago|month|week|day|year/i)) {
          let comment = '';
          let author = 'Flipkart User';
          let j = i + 3;
          let safeCount3 = 0;
          while (j < lines.length && !lines[j].match(/^[1-5]$/) && lines[j] !== 'Show all reviews' && safeCount3++ < 500) {
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
  console.log(`    parsePageText: Reviews Done -> ${reviews.length}`);

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

  const results = [];

  for (let i = 0; i < urls.length; i++) {
    console.log(`[${i + 1}/${urls.length}] Scraping...`);
    try {
      let data = await scrapeProduct(urls[i]);

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
