const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

try { require.resolve('cheerio'); }
catch { console.error('\n  Install deps first:\n  npm install cheerio node-fetch\n'); process.exit(1); }

const cheerio = require('cheerio');

const PRODUCTS_FILE = path.join(__dirname, '..', 'src', 'data', 'products.json');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

async function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').substring(0, 60);
}

function downloadImage(url, destPath) {
    return new Promise((resolve, reject) => {
        const protocol = url.startsWith('https') ? https : http;
        const file = fs.createWriteStream(destPath);
        protocol.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, res => {
            if (res.statusCode === 301 || res.statusCode === 302) {
                file.close();
                fs.unlinkSync(destPath);
                return downloadImage(res.headers.location, destPath).then(resolve).catch(reject);
            }
            if (res.statusCode !== 200) {
                file.close();
                try { fs.unlinkSync(destPath); } catch { }
                return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
            }
            res.pipe(file);
            file.on('finish', () => { file.close(); resolve(destPath); });
        }).on('error', err => { file.close(); try { fs.unlinkSync(destPath); } catch { } reject(err); });
    });
}

// Scrape search page for real product URLs
async function searchFlipkart(query) {
    const url = `https://www.flipkart.com/search?q=${encodeURIComponent(query)}`;
    console.log(`Searching: ${url}`);

    try {
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            }
        });

        const html = await response.text();
        const $ = cheerio.load(html);

        let products = [];

        // Target specifically the high-end product blocks which usually have the class CGtC98 or similar
        // Let's use a more robust way: find all links that go to product pages and grab their surrounding info
        $('a[href*="/p/itm"]').each((i, el) => {
            const href = $(el).attr('href');
            if (href && !href.includes('/product-reviews/')) {
                // Find nearest container
                const container = $(el).closest('div[data-id]');
                if (!container.length) return;

                const title = container.find('.KzDlHZ, .WKTcLC, .syl9yP').first().text().trim();
                if (!title) return;

                const priceText = container.find('.Nx9bqj').first().text().trim();
                if (!priceText) return;

                const originalPriceText = container.find('.yRaY8j').first().text().trim();

                let imageUrl = container.find('img').first().attr('src');
                if (imageUrl && !imageUrl.startsWith('http')) imageUrl = container.find('img').first().attr('data-url');

                if (title && priceText && imageUrl && !products.some(p => p.title === title)) {
                    // Get a clean URL
                    const cleanUrl = 'https://www.flipkart.com' + href.split('?')[0];

                    products.push({
                        title,
                        // Original real prices
                        realPrice: parseInt(priceText.replace(/[^0-9]/g, '')) || 0,
                        realOriginalPrice: originalPriceText ? parseInt(originalPriceText.replace(/[^0-9]/g, '')) : 0,
                        imageUrl: imageUrl.replace('312/312', '832/832').replace('128/128', '832/832').replace(/\?q=\d+/, ''),
                        url: cleanUrl,
                        brand: title.split(' ')[0]
                    });
                }
            }
        });

        return products.slice(0, 50); // Fetch top 50 from each category
    } catch (e) {
        console.error(`Failed to fetch ${query}:`, e.message);
        return [];
    }
}

async function processProduct(scrapedItem, targetDiscountPrice) {
    if (!scrapedItem.title) return null;

    // Assign a fixed super low price (99, 499, 999)
    const price = targetDiscountPrice;
    const originalPrice = scrapedItem.realOriginalPrice || (scrapedItem.realPrice > 0 ? scrapedItem.realPrice : Math.floor(Math.random() * 50000) + 50000);
    const discount = originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 99;

    // Generate an ID based on hash
    const startId = 3000;

    // Download image
    fs.mkdirSync(IMAGES_DIR, { recursive: true });

    let localImagePath = scrapedItem.imageUrl;
    let images = [scrapedItem.imageUrl];

    if (scrapedItem.imageUrl && scrapedItem.imageUrl.startsWith('http')) {
        const ext = scrapedItem.imageUrl.match(/\\.(jpe?g|png|webp)/)?.[1] || 'jpeg';
        const filename = `${slugify(scrapedItem.title)}-main.${ext}`;
        const destPath = path.join(IMAGES_DIR, filename);

        try {
            if (!fs.existsSync(destPath)) {
                await downloadImage(scrapedItem.imageUrl, destPath);
            }
            localImagePath = `/images/products/${filename}`;
            images = [localImagePath];
        } catch (e) {
            console.log(`Failed to d/l image: ${e.message}`);
        }
    }

    const reviews = [
        {
            rating: 5,
            title: "Worth every penny",
            comment: "Best smartphone I ever used. The camera is insane and the battery lasts all day.",
            author: "Rahul M",
            date: "6 months ago",
            verifiedPurchase: true,
            likes: 2341,
            dislikes: 456
        },
        {
            rating: 5,
            title: "Excellent",
            comment: "Incredible performance and display quality.",
            author: "Priya S",
            date: "5 months ago",
            verifiedPurchase: true,
            likes: 1876,
            dislikes: 321
        },
        {
            rating: 4,
            title: "Good but expensive",
            comment: "Great phone but the price is steep. Camera and display are top notch.",
            author: "Amit K",
            date: "4 months ago",
            verifiedPurchase: true,
            likes: 987,
            dislikes: 234
        }
    ];

    const categoryMap = {
        'Apple': 'mobiles',
        'Samsung': 'mobiles',
        'Google': 'mobiles',
        'Sony': 'electronics',
        'DJI': 'electronics'
    };

    return {
        id: (startId + Math.floor(Math.random() * 90000)).toString(),
        title: scrapedItem.title,
        price,
        originalPrice,
        discount,
        image: localImagePath,
        images,
        rating: parseFloat((4 + Math.random()).toFixed(1)),
        ratingCount: Math.floor(Math.random() * 500000).toString(),
        reviewCount: Math.floor(Math.random() * 50000).toString(),
        category: categoryMap[scrapedItem.brand] || 'electronics',
        offers: [
            "Exclusive Post-Order Offer",
            "One-Time Deal — Cannot Be Repeated"
        ],
        highlights: [
            "Premium Quality",
            "1 Year Manufacturer Warranty",
            "Top Rated Product"
        ],
        description: `${scrapedItem.title} featuring premium build quality and top performance.`,
        specs: {
            "Model Name": scrapedItem.title,
            "Brand": scrapedItem.brand,
            "Sales Package": "1 Unit, Charging Cable, User Manual"
        },
        reviews,
        brand: scrapedItem.brand || "Premium",
        seller: "SuperComNet Retail",
        variants: []
    };
}

async function main() {
    console.log('Starting high-speed deep scrape of Flipkart search categories...\n');

    let rawProductsData = fs.readFileSync(PRODUCTS_FILE, 'utf8');
    let dbProducts = JSON.parse(rawProductsData);

    const queries = [
        'apple iphone 15 pro max',
        'samsung galaxy s24 ultra',
        'macbook pro m3',
        'sony playstation 5',
        'apple airpods pro',
        'apple ipad pro 12.9',
        'apple watch ultra 2',
        'dji drone camera',
        'samsung galaxy z fold 5',
        'google pixel 8 pro',
        'samsung s23 ultra',
        'iphone 13',
        'asus rog strix laptop',
        'alienware gaming laptop',
        'apple iphone 14 plus'
    ];

    const targetPrices = [99, 499, 999];
    let newProducts = [];

    for (const query of queries) {
        console.log(`\n--- Fetching real Flipkart items for: ${query} ---`);
        const items = await searchFlipkart(query);
        console.log(`Found ${items.length} real products.`);

        for (const item of items) {
            const targetPrice = targetPrices[Math.floor(Math.random() * targetPrices.length)];
            const processed = await processProduct(item, targetPrice);
            if (processed) {
                newProducts.push(processed);
                process.stdout.write('.');
            }
        }
        console.log(`\nProcessed ${items.length} items from ${query}`);
        await delay(1000); // polite delay
    }

    console.log(`\n\nSuccessfully scraped and processed ${newProducts.length} REAL Flipkart products.`);

    // Add to DB
    const finalProducts = dbProducts.concat(newProducts);
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(finalProducts, null, 2));

    console.log(`Database updated. Total products: ${finalProducts.length}`);
}

main().catch(console.error);
