const fs = require('fs');
const path = require('path');

const PRODUCTS_FILE = path.join(__dirname, '../src/data/products.json');

const rawData = fs.readFileSync(PRODUCTS_FILE, 'utf8');
let products = JSON.parse(rawData);

const baseTemplates = [
    {
        brand: "Apple",
        category: "mobiles",
        titles: ["Apple iPhone 15 Pro", "Apple iPhone 14 Pro Max", "Apple iPhone 13 Pro"],
        image: "/images/products/apple-iphone-15-black-128-gb-1.jpeg"
    },
    {
        brand: "Apple",
        category: "electronics",
        titles: ["Apple AirPods Max", "Apple AirPods Pro (2nd Gen)", "Apple MacBook Pro M3"],
        image: "/images/products/apple-airpods-pro-2nd-gen-1.jpeg" // assuming there might be some fallback image, we'll reuse something
    },
    {
        brand: "Samsung",
        category: "mobiles",
        titles: ["Samsung Galaxy S24 Ultra", "Samsung Galaxy Z Fold 5", "Samsung Galaxy S23 Ultra"],
        image: "/images/products/samsung-galaxy-s25-plus-5g-navy-256-gb-1.jpeg"
    },
    {
        brand: "Google",
        category: "mobiles",
        titles: ["Google Pixel 8 Pro", "Google Pixel Fold", "Google Pixel 7 Pro"],
        image: "/images/products/google-pixel-8-pro-1.jpeg" // fallback
    }
];

const prices = [99, 499, 999];
let newProducts = [];
let startId = 2000;

for (let i = 0; i < 300; i++) {
    const template = baseTemplates[Math.floor(Math.random() * baseTemplates.length)];
    const titleBase = template.titles[Math.floor(Math.random() * template.titles.length)];
    const storageOptions = ["128 GB", "256 GB", "512 GB", "1 TB"];
    const storage = storageOptions[Math.floor(Math.random() * storageOptions.length)];
    const colorOptions = ["Titanium", "Black", "Silver", "Gold", "Midnight"];
    const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];

    const title = `${titleBase} (${color}, ${storage})`;
    const price = prices[Math.floor(Math.random() * prices.length)];
    const originalPrice = price * 100 + Math.floor(Math.random() * 50000);
    const discount = Math.round((1 - price / originalPrice) * 100);

    const newProduct = {
        id: (startId + i).toString(),
        title: title,
        price: price,
        originalPrice: originalPrice,
        discount: discount,
        image: template.image,
        rating: (4 + Math.random()).toFixed(1),
        ratingCount: Math.floor(Math.random() * 500000).toString(),
        reviewCount: Math.floor(Math.random() * 50000).toString(),
        category: template.category,
        offers: [
            "Exclusive Post-Order Offer",
            "One-Time Deal — Cannot Be Repeated"
        ],
        highlights: [
            `${storage} ROM`,
            "Premium Display",
            "Advanced Camera System",
            "High-End Processor"
        ],
        description: `This is a premium ${template.brand} device. ${title} offers the best performance in its class.`,
        images: [template.image],
        specs: {
            "Model Name": titleBase,
            "Color": color,
            "Internal Storage": storage,
        },
        reviews: [],
        brand: template.brand,
        seller: "SuperComNet",
        variants: []
    };
    newProducts.push(newProduct);
}

products = products.concat(newProducts);
fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2));
console.log(`Successfully added 300 new mock high-value products. Total products: ${products.length}`);
