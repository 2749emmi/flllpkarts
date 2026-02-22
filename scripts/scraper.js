import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';

// Load existing products
const dataPath = path.join(__dirname, '../src/data/products.json');
const products = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

async function scrapeFlipkartProduct(page, url) {
    try {
        await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });

        // Wait for primary title to appear
        await page.waitForSelector('.VuS-lx, .B_NuCI, h1', { timeout: 10000 }).catch(() => null);

        const data = await page.evaluate(() => {
            const extractText = (selectors) => {
                for (let sel of selectors) {
                    const el = document.querySelector(sel);
                    if (el && el.textContent.trim()) return el.textContent.trim();
                }
                return '';
            };

            const title = extractText(['.VuS-lx', '.B_NuCI', 'h1 span', 'h1']);
            const priceText = extractText(['div.Nx9bqj.CxhGGd', 'div._30jeq3._16Jk6d', 'div._30jeq3']);
            const originalPriceText = extractText(['div.yRaY8j.A6E5cg', 'div._3I9_wc._2p6lqe', 'div._3I9_wc']);
            const discountText = extractText(['div.UkUFwK', 'div._3Ay6Sb._31Dcoz', 'div._3Ay6Sb']);

            const rating = extractText(['div.XQDdHH._1XpZkE', 'div._3LWZlK']);
            const ratingCount = extractText(['span.Wphh3N', 'span._2_R_DZ span span:nth-child(1)']).replace(/ratings?/i, '').trim();
            const reviewCount = extractText(['span.Wphh3N', 'span._2_R_DZ span span:nth-child(3)']).replace(/reviews?/i, '').trim();

            const description = extractText(['div.RcXBOT', 'div._1mXcCf R6bBZP', 'div._1mXcCf']);

            // Extract Images
            const images = [];
            document.querySelectorAll('img.DByuf4, img.q6DClP, img._396cs4, ul.ZqTDlc li img').forEach(img => {
                let src = img.getAttribute('src');
                if (src && !images.includes(src)) {
                    // getting high res if possible
                    images.push(src.replace(/(\/image\/)\d+\/\d+\//, '$1800/1070/'));
                }
            });

            // Extract Specs
            const specs = {};
            document.querySelectorAll('tr._1s_Smc.row').forEach(row => {
                const key = row.querySelector('td._1hKmbr')?.textContent?.trim();
                const val = row.querySelector('td.URwL2w ul li')?.textContent?.trim();
                if (key && val) specs[key] = val;
            });

            // Highlights
            const highlights = [];
            document.querySelectorAll('div.X3BRjv li, div._2418kt ul li').forEach(li => {
                if (li.textContent) highlights.push(li.textContent.trim());
            });

            // Reviews
            const reviews = [];
            document.querySelectorAll('div.col._2wzgFH, div.col.EPCm-n').forEach(rev => {
                const rRating = rev.querySelector('div.XQDdHH, div._3LWZlK')?.textContent;
                const rTitle = rev.querySelector('p.z9E0IG, p._2-N8zT')?.textContent;
                const rComment = rev.querySelector('div.ZmyDvd div div, div.t-ZTKy div div')?.textContent;
                const rAuthor = rev.querySelector('p._2sc7ZR._2V5EAA, p._2sc7ZR')?.textContent;

                if (rTitle && rComment && rAuthor) {
                    reviews.push({
                        rating: parseFloat(rRating) || 5,
                        title: rTitle,
                        comment: rComment,
                        author: rAuthor,
                        date: new Date().toISOString()
                    });
                }
            });

            // Extract Variants
            const variants = [];
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

            return {
                title, priceText, originalPriceText, discountText,
                rating, ratingCount, reviewCount, description,
                images: images.filter(Boolean), specs, highlights, reviews, variants
            };
        });

        const numPrice = Number(data.priceText.replace(/[^0-9.-]+/g, ""));
        const numOriginalPrice = Number(data.originalPriceText.replace(/[^0-9.-]+/g, "")) || numPrice * 2;

        return {
            id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
            title: data.title || "Unknown Product",
            price: numPrice || 0,
            originalPrice: numOriginalPrice || (numPrice + 500),
            discount: Math.round(((numOriginalPrice - numPrice) / numOriginalPrice) * 100) || 0,
            image: data.images[0] || "",
            rating: parseFloat(data.rating) || 4.0,
            ratingCount: data.ratingCount || "0",
            reviewCount: data.reviewCount || "0",
            category: "scraped",
            offers: ["Bank Offer: 5% Cashback on Flipkart Axis Bank Card", "Partner Offer: Buy this product and get upto ₹500 off"],
            highlights: data.highlights.length ? data.highlights : ["High quality product", "1 Year Warranty"],
            description: data.description || `Buy ${data.title} online at best price.`,
            images: data.images,
            specs: data.specs,
            reviews: data.reviews
        };
    } catch (err) {
        console.error(`Failed to scrape ${url}`, err.message);
        return null;
    }
}

async function startScraping(urls) {
    console.log(`Starting to scrape ${urls.length} products...`);
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--window-size=1920,1080',
        ],
        defaultViewport: {
            width: 1920,
            height: 1080
        }
    });

    // Scrape in parallel (batches of 3)
    const BATCH_SIZE = 3;
    const results = [];

    for (let i = 0; i < urls.length; i += BATCH_SIZE) {
        const batch = urls.slice(i, i + BATCH_SIZE);
        console.log(`Processing batch ${i / BATCH_SIZE + 1} of ${Math.ceil(urls.length / BATCH_SIZE)}`);

        const promises = batch.map(async (url) => {
            const page = await browser.newPage();
            // Block images and css for speed
            await page.setRequestInterception(true);
            page.on('request', (req) => {
                if (req.resourceType() === 'stylesheet' || req.resourceType() === 'font' || req.resourceType() === 'image') {
                    req.abort();
                }
                else {
                    req.continue();
                }
            });
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

            const prod = await scrapeFlipkartProduct(page, url);
            await page.close();
            return prod;
        });

        const batchResults = await Promise.all(promises);
        results.push(...batchResults.filter(Boolean));
    }

    await browser.close();

    console.log(`Successfully scraped ${results.length} products!`);

    // Append to products.json
    products.push(...results);
    fs.writeFileSync(dataPath, JSON.stringify(products, null, 2));
    console.log(`Saved newly scraped products to ${dataPath}`);
}

// Simple CLI usage
const args = process.argv.slice(2);
if (args.length > 0) {
    startScraping(args).catch(console.error);
} else {
    console.log("Usage: node scripts/scraper.js <url1> <url2> ...");
}
