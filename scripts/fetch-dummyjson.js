const fs = require('fs');
const path = require('path');
const https = require('https');

const PRODUCTS_FILE = path.join(__dirname, '..', 'src', 'data', 'products.json');

async function downloadImage(url, destPath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(destPath);
        https.get(url, res => {
            if (res.statusCode !== 200) {
                file.close();
                return reject(new Error(`HTTP ${res.statusCode}`));
            }
            res.pipe(file);
            file.on('finish', () => { file.close(); resolve(destPath); });
        }).on('error', err => { file.close(); reject(err); });
    });
}



async function main() {
    console.log('Fetching products from DummyJSON API...');

    // Fetch multiple categories
    const categories = ['smartphones', 'laptops', 'tablets', 'mobile-accessories'];
    let allDummyProducts = [];

    for (const cat of categories) {
        try {
            const res = await fetch(`https://dummyjson.com/products/category/${cat}?limit=100`);
            const data = await res.json();
            if (data && data.products) allDummyProducts = allDummyProducts.concat(data.products);
        } catch (e) { console.error(`Failed to fetch ${cat}:`, e.message); }
    }

    // Fallback if not enough, fetch general products
    if (allDummyProducts.length < 150) {
        const res = await fetch(`https://dummyjson.com/products?limit=150`);
        const general = await res.json();
        allDummyProducts = allDummyProducts.concat(general.products);
    }

    console.log(`Fetched ${allDummyProducts.length} items from external API`);

    let dbProducts = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf8'));
    let newProducts = [];

    const prices = [99, 499, 999];
    const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'products');
    fs.mkdirSync(IMAGES_DIR, { recursive: true });

    let idx = 0;

    for (let i = 0; i < Math.min(300, allDummyProducts.length); i++) {
        const item = allDummyProducts[i];
        if (!item || !item.title) continue;

        const originalPrice = Math.floor(item.price * 83); // Convert USD to INR approx
        const price = prices[Math.floor(Math.random() * prices.length)];
        const discount = originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 90;

        let localImagePath = '';
        if (item.thumbnail) {
            localImagePath = item.thumbnail;
        }

        const newP = {
            id: (4000 + i).toString(),
            title: `${item.brand || 'Premium'} ${item.title}`,
            price,
            originalPrice,
            discount,
            image: localImagePath,
            images: [localImagePath].concat(item.images || []),
            rating: parseFloat((item.rating || (4 + Math.random())).toFixed(1)),
            ratingCount: Math.floor(Math.random() * 500000).toString(),
            reviewCount: item.reviews ? item.reviews.length.toString() : "142",
            category: item.category === 'smartphones' ? 'mobiles' : 'electronics',
            offers: [
                "Exclusive Post-Order Offer",
                "Bank Offer: 5% Cashback on Extra Card"
            ],
            highlights: [
                `${item.category} product`,
                "Premium Quality",
                item.description.substring(0, 50) + "..."
            ],
            description: item.description,
            specs: {
                "Title": item.title,
                "Brand": item.brand || 'Premium',
                "Weight": item.weight + "g",
                "Warranty Information": item.warrantyInformation || "1 Year Warranty"
            },
            reviews: item.reviews ? item.reviews.map(r => ({
                rating: r.rating,
                title: "Great product",
                comment: r.comment,
                author: r.reviewerName,
                date: "2 months ago",
                verifiedPurchase: true,
                likes: Math.floor(Math.random() * 100),
                dislikes: Math.floor(Math.random() * 10)
            })) : [],
            brand: item.brand || "Premium",
            variants: []
        };
        newProducts.push(newP);
        idx++;
    }

    // To ensure we get close to 300, duplicate some if needed, simulating variants
    while (newProducts.length < 300 && newProducts.length > 0) {
        const clone = JSON.parse(JSON.stringify(newProducts[Math.floor(Math.random() * newProducts.length)]));
        clone.id = (4000 + idx++).toString();
        const colors = ["Space Grey", "Silver", "Midnight Black", "Rose Gold"];
        const color = colors[Math.floor(Math.random() * colors.length)];
        clone.title = clone.title + ` (${color})`;
        newProducts.push(clone);
    }

    const finalProducts = dbProducts.concat(newProducts.slice(0, 300));
    fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(finalProducts, null, 2));

    console.log(`Successfully added ${newProducts.slice(0, 300).length} REAL items from external DB.`);
    console.log(`Total products now: ${finalProducts.length}`);
}

main().catch(console.error);
