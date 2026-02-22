const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CATEGORY_URL = process.argv[2];
const PRODUCTS_JSON_PATH = path.join(__dirname, '../src/data/products.json');
const TEMP_JSON_PATH = path.join(__dirname, 'scraped-product.json');
const SCRAPER_JS = path.join(__dirname, 'scrape-flipkart.js');

if (!CATEGORY_URL) {
    console.error('Usage: node scripts/scrape-category.js <flipkart-category-url>');
    process.exit(1);
}

function generateId(products) {
    const ids = products.map(p => parseInt(String(p.id), 10)).filter(n => !isNaN(n));
    return String(Math.max(0, ...ids) + 1);
}

async function main() {
    console.log(`Starting bulk scrape for: ${CATEGORY_URL}`);
    const browser = await puppeteer.launch({
        headless: 'new',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    console.log('Navigating to category page...');
    await page.goto(CATEGORY_URL, { waitUntil: 'networkidle2', timeout: 60000 });

    // Scroll to bottom to ensure lazy-loaded items might appear
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 500;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;
                if (totalHeight >= scrollHeight) {
                    clearInterval(timer);
                    resolve();
                }
            }, 200);
        });
    });

    // Extract all product links
    const productLinks = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'))
            .map(a => a.href)
            .filter(href => href.includes('/p/itm') || href.includes('/p/'));

        // Remove duplicates and parameters to get base URLs
        const uniqueLinks = [...new Set(links.map(link => {
            try {
                const url = new URL(link);
                return `${url.origin}${url.pathname}`;
            } catch {
                return link.split('?')[0];
            }
        }))];
        return uniqueLinks;
    });

    await browser.close();

    console.log(`Found ${productLinks.length} products to scrape.`);

    if (productLinks.length === 0) {
        console.log('No products found on page. Exiting.');
        return;
    }

    let successCount = 0;

    // Read current products DB
    const existingProducts = JSON.parse(fs.readFileSync(PRODUCTS_JSON_PATH, 'utf-8'));

    for (let i = 0; i < productLinks.length; i++) {
        const url = productLinks[i];
        console.log(`\n[${i + 1}/${productLinks.length}] Scraping: ${url}`);

        try {
            // Check if we already have it (basic check by sourceUrl)
            if (existingProducts.some(p => p.sourceUrl === url)) {
                console.log(`-> Skipped: Product already exists in database.`);
                continue;
            }

            // Run individual scraper
            execSync(`node "${SCRAPER_JS}" "${url}"`, { stdio: 'inherit' });

            // Read result
            if (!fs.existsSync(TEMP_JSON_PATH)) {
                console.log('-> Error: Scraper did not produce output file.');
                continue;
            }

            const scrapedData = JSON.parse(fs.readFileSync(TEMP_JSON_PATH, 'utf-8'));
            const product = Array.isArray(scrapedData) ? scrapedData[0] : scrapedData;

            if (product && product.title) {
                // Ensure default values are filled
                const newProduct = {
                    id: generateId(existingProducts),
                    title: product.title || '',
                    originalPrice: product.originalPrice || product.price || 0,
                    price: product.price || 0,
                    discount: product.discount || 0,
                    images: product.images || [],
                    image: product.images?.[0] || product.image || '',
                    rating: product.rating || 0,
                    ratingCount: product.ratingCount || '0',
                    reviewCount: product.reviewCount || product.ratingCount || '0',
                    highlights: product.highlights || [],
                    specs: product.specs || {},
                    offers: product.offers || [],
                    description: product.description || '',
                    brand: product.brand || '',
                    seller: product.seller || '',
                    category: product.category || 'general',
                    variants: product.variants || [],
                    reviews: (product.reviews || []).slice(0, 5),
                    sourceUrl: url,
                };

                existingProducts.push(newProduct);

                // Write immediately to save progress
                fs.writeFileSync(PRODUCTS_JSON_PATH, JSON.stringify(existingProducts, null, 2) + '\n');
                console.log(`-> Success: Added "${newProduct.title}" (ID: ${newProduct.id})`);
                successCount++;
            } else {
                console.log('-> Error: Scraped data missing title or invalid.');
            }

            // Small delay to prevent rate limits
            await new Promise(r => setTimeout(r, 2000));

        } catch (error) {
            console.error(`-> Failed to scrape ${url}:`, error.message);
        }
    }

    console.log(`\nBulk scrape complete! Successfully added ${successCount} products.`);
}

main().catch(console.error);
