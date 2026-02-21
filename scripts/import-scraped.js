#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const SCRAPED_PATH = path.join(__dirname, 'scraped-product.json');
const PRODUCTS_PATH = path.join(__dirname, '..', 'src', 'data', 'products.json');

function generateId(products) {
  const numericIds = products
    .map(p => parseInt(p.id, 10))
    .filter(n => !isNaN(n));
  return String(Math.max(0, ...numericIds) + 1);
}

function slugifyCategory(raw) {
  if (!raw) return 'general';
  return raw
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function scrapedToProduct(scraped, existingId) {
  const product = {
    id: existingId || '',
    title: scraped.title || 'Untitled Product',
    price: scraped.price || 0,
    originalPrice: scraped.originalPrice || 0,
    discount: scraped.discount || 0,
    image: (scraped.images && scraped.images[0]) || '',
    rating: scraped.rating || 0,
    ratingCount: scraped.ratingCount || '0',
    reviewCount: scraped.reviewCount || '0',
    category: slugifyCategory(scraped.category),
    offers: scraped.offers || [],
    highlights: scraped.highlights || [],
    description: scraped.description || '',
    images: scraped.images || [],
    specs: scraped.specs || {},
    reviews: (scraped.reviews || []).slice(0, 5),
    brand: scraped.brand || '',
    seller: scraped.seller || '',
  };

  if (scraped.sourceUrl) {
    product.sourceUrl = scraped.sourceUrl;
  }

  return product;
}

function findExistingProduct(products, scraped) {
  if (scraped.sourceUrl) {
    const match = products.find(p => p.sourceUrl === scraped.sourceUrl);
    if (match) return match;
  }

  if (scraped.title) {
    const normalize = s => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const scrapedNorm = normalize(scraped.title);
    const match = products.find(p => normalize(p.title) === scrapedNorm);
    if (match) return match;
  }

  return null;
}

function mergeProduct(existing, incoming) {
  const merged = { ...existing };

  for (const [key, value] of Object.entries(incoming)) {
    if (key === 'id') continue;

    const isEmpty = value === '' || value === 0 ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === 'object' && !Array.isArray(value) && Object.keys(value).length === 0);

    if (!isEmpty) {
      if (key === 'specs' && typeof existing.specs === 'object') {
        merged.specs = { ...existing.specs, ...value };
      } else {
        merged[key] = value;
      }
    }
  }

  return merged;
}

function main() {
  if (!fs.existsSync(SCRAPED_PATH)) {
    console.error(`Error: ${SCRAPED_PATH} not found.`);
    console.error('Run scrape-flipkart.js first to generate scraped data.');
    process.exit(1);
  }

  const scrapedRaw = JSON.parse(fs.readFileSync(SCRAPED_PATH, 'utf-8'));
  const scrapedItems = Array.isArray(scrapedRaw) ? scrapedRaw : [scrapedRaw];

  if (!fs.existsSync(PRODUCTS_PATH)) {
    console.error(`Error: ${PRODUCTS_PATH} not found.`);
    process.exit(1);
  }

  const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf-8'));

  let added = 0;
  let updated = 0;
  let skipped = 0;

  for (const scraped of scrapedItems) {
    if (scraped.error) {
      console.log(`  Skipping errored entry: ${scraped.sourceUrl || '(unknown)'}`);
      skipped++;
      continue;
    }

    const existing = findExistingProduct(products, scraped);

    if (existing) {
      const incoming = scrapedToProduct(scraped, existing.id);
      const merged = mergeProduct(existing, incoming);
      const idx = products.indexOf(existing);
      products[idx] = merged;
      console.log(`  Updated: [${existing.id}] "${merged.title}"`);
      updated++;
    } else {
      const newId = generateId(products);
      const newProduct = scrapedToProduct(scraped, newId);
      products.push(newProduct);
      console.log(`  Added:   [${newId}] "${newProduct.title}"`);
      added++;
    }
  }

  fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2) + '\n', 'utf-8');

  console.log(`\nDone. Added: ${added}, Updated: ${updated}, Skipped: ${skipped}`);
  console.log(`Products file: ${PRODUCTS_PATH} (${products.length} total products)`);
}

main();
