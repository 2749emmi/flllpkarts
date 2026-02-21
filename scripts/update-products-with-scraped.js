#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const PRODUCTS_PATH = path.join(__dirname, '..', 'src', 'data', 'products.json');
const IMAGES_DIR = path.join(__dirname, '..', 'public', 'images', 'products');

const products = JSON.parse(fs.readFileSync(PRODUCTS_PATH, 'utf-8'));

function getLocalImages(prefix) {
  const files = fs.readdirSync(IMAGES_DIR).filter(f => f.startsWith(prefix) && f.endsWith('.jpeg'));
  return files
    .sort((a, b) => {
      const numA = parseInt(a.match(/-(\d+)\.jpeg$/)?.[1] || '0');
      const numB = parseInt(b.match(/-(\d+)\.jpeg$/)?.[1] || '0');
      return numA - numB;
    })
    .map(f => `/images/products/${f}`);
}

const imageMapping = {
  '1001': 'apple-iphone-17-pro-max-cosmic-orange-256-gb',
  '1002': 'samsung-galaxy-s25-plus-5g-navy-256-gb',
  '1003': 'apple-iphone-16-pro-max-natural-titanium-256-gb',
  '1004': 'apple-iphone-16-pro-black-titanium-128-gb',
  '1005': 'apple-iphone-15-black-128-gb',
  '1006': 'apple-iphone-14-starlight-128-gb',
  '1007': 'apple-iphone-13-starlight-128-gb',
  '1008': 'apple-iphone-12-blue-64-gb',
  '33': 'sony-wh1000xm5-black-bluetooth-wired-headset-black-on-the-ea',
  '18': 'product-2',
  '17': 'product-3',
};

const duplicateMapping = {
  '1': '1007',
  '2': '1003',
  '3': '1008',
  '4': '1002',
};

const scrapedData = {
  '1001': {
    title: 'Apple iPhone 17 Pro Max (Cosmic Orange, 256 GB)',
    brand: 'Apple',
    seller: 'NGIVR RETAILS',
    rating: 4.8,
    ratingCount: '518',
    reviewCount: '518',
    highlights: [
      '256 GB ROM',
      'A19 Chip, 6 Core Processor | Hexa Core',
      'Superfast Multitasking. Extensive Gaming',
      '48MP + 48MP + 48MP Rear Camera',
      'DSLR Like Pictures & Great Zoom',
      '18MP Front Camera',
      '6.9 inch All Screen OLED Display',
      'Cinematic Display. Sharpest Colours',
    ],
    reviews: [
      { rating: 5, title: 'Worth every penny', comment: 'Hey, I\'d really appreciate it if Flipkart could get the product here faster. The phone itself is absolutely amazing.', author: 'Siva H', date: '5 months ago', verifiedPurchase: true, likes: 685, dislikes: 261 },
      { rating: 5, title: 'Wonderful', comment: 'Best iPhone ever 😊', author: 'SUNIL KUMAR', date: '4 months ago', verifiedPurchase: true, likes: 784, dislikes: 303 },
      { rating: 5, title: 'Simply awesome', comment: 'Best❤️ Thank you Flipkart.', author: 'Aftab Ali', date: '4 months ago', verifiedPurchase: true, likes: 465, dislikes: 181 },
      { rating: 5, title: 'Fabulous!', comment: 'It was amazing phone😍 and the camera was fantastic. And this colour is absolutely stunning!', author: 'Padmalav Upadhyaya', date: '4 months ago', verifiedPurchase: true, likes: 139, dislikes: 47 },
      { rating: 5, title: 'Mind-blowing purchase', comment: '🧡 Excellent 🧡 Best phone 🧡🔥 super 🔥🤑', author: 'akash patra', date: '3 months ago', verifiedPurchase: true, likes: 108, dislikes: 46 },
    ],
    offers: [
      'Bank Offer: ₹6,000 off on Flipkart Axis Credit Card, including cashback',
      'Bank Offer: ₹3,000 off on ICICI Credit Card',
      'Bank Offer: ₹3,000 off on Axis Credit Card',
      'Bank Offer: ₹4,000 off on Flipkart SBI Credit Card with cashback',
      'EMI available from ₹24,317/month, No Cost EMI',
      'Exchange Up to ₹51,100 off',
    ],
    specs: {
      'In The Box': 'Handset, USB-C Charge Cable (USB-C), Documentation',
      'Model Number': 'IPHONE 17 PRO MAX',
      'Model Name': 'iPhone 17 Pro Max',
      'Color': 'Cosmic Orange',
      'Browse Type': 'Smartphones',
      'SIM Type': 'Nano + eSIM',
      'Hybrid Sim Slot': 'No',
      'Touchscreen': 'Yes',
      'OTG Compatible': 'No',
      'Display Size': '17.78 cm (6.9 inch)',
      'Resolution': '2868 x 1320 Pixels',
      'Display Type': 'All Screen OLED Display',
      'Operating System': 'iOS 19',
      'Processor Brand': 'Apple',
      'Processor Type': 'A19 Chip',
      'Processor Core': 'Hexa Core',
      'Internal Storage': '256 GB',
      'RAM': '8 GB',
      'Primary Camera': '48MP + 48MP + 48MP',
      'Primary Camera Features': 'Fusion Camera, Ultra Wide Camera, Telephoto Camera',
      'Secondary Camera': '18MP Front Camera',
      'Battery Capacity': '4685 mAh',
      'Battery Type': 'Lithium Ion',
      'Network Type': '2G, 3G, 4G, 5G',
      'Bluetooth Version': 'v5.3',
      'Wi-Fi': 'Yes, with Wi-Fi 7',
      'NFC': 'Yes',
      'USB Connectivity': 'Yes, USB Type-C',
      'Weight': '227 g',
      'Width': '77.6 mm',
      'Height': '163 mm',
      'Depth': '8.25 mm',
    },
    description: 'The Apple iPhone 17 Pro Max delivers the ultimate smartphone experience with its massive 6.9-inch OLED display, powerful A19 chip, and a triple 48MP camera system. Superfast multitasking, extensive gaming, and DSLR-quality photography — all in one device. Supports USB-C, Wi-Fi 7, and 5G connectivity.',
  },
  '1003': {
    title: 'Apple iPhone 16 Pro Max (Natural Titanium, 256 GB)',
    brand: 'Apple',
    seller: 'SuperComNet',
    rating: 4.6,
    ratingCount: '1,54,456',
    reviewCount: '14,680',
    highlights: [
      '256 GB ROM',
      '17.43 cm (6.9 inch) Super Retina XDR Display',
      '48MP + 12MP + 48MP | 12MP Front Camera',
      'A18 Pro Chip, 6 Core Processor',
      'Titanium Design, Action Button, Camera Control',
    ],
    reviews: [
      { rating: 5, title: 'Worth every penny', comment: 'Best smartphone I ever used. The camera is insane and the battery lasts all day.', author: 'Rahul M', date: '6 months ago', verifiedPurchase: true, likes: 2341, dislikes: 456 },
      { rating: 5, title: 'Excellent', comment: 'Incredible performance and display quality. The ProMotion display is buttery smooth.', author: 'Priya S', date: '5 months ago', verifiedPurchase: true, likes: 1876, dislikes: 321 },
      { rating: 4, title: 'Good but expensive', comment: 'Great phone but the price is steep. Camera and display are top notch.', author: 'Amit K', date: '4 months ago', verifiedPurchase: true, likes: 987, dislikes: 234 },
      { rating: 5, title: 'Perfect upgrade', comment: 'Coming from iPhone 14, this is a massive upgrade. Love the titanium design!', author: 'Sneha R', date: '5 months ago', verifiedPurchase: true, likes: 1543, dislikes: 287 },
      { rating: 5, title: 'Mind-blowing camera', comment: 'The 5x telephoto is incredible. Best camera on any smartphone.', author: 'Vikash J', date: '3 months ago', verifiedPurchase: true, likes: 765, dislikes: 132 },
    ],
    offers: [
      'Bank Offer: ₹5,000 off on Flipkart Axis Credit Card',
      'Bank Offer: ₹3,000 off on ICICI Credit Card',
      'Exchange Up to ₹51,100 off',
      'EMI starting ₹6,837/month',
    ],
    specs: {
      'In The Box': 'Handset, USB-C Charge Cable, Documentation',
      'Model Name': 'iPhone 16 Pro Max',
      'Color': 'Natural Titanium',
      'Display Size': '17.43 cm (6.9 inch)',
      'Resolution': '2868 x 1320 Pixels',
      'Display Type': 'Super Retina XDR Display',
      'Operating System': 'iOS 18',
      'Processor Type': 'A18 Pro Chip',
      'Processor Core': 'Hexa Core',
      'Internal Storage': '256 GB',
      'RAM': '8 GB',
      'Primary Camera': '48MP + 12MP + 48MP',
      'Secondary Camera': '12MP Front Camera',
      'Battery Capacity': '4685 mAh',
      'Network Type': '5G, 4G, 3G, 2G',
      'Weight': '227 g',
    },
    description: 'Apple iPhone 16 Pro Max with A18 Pro chip, 6.9-inch Super Retina XDR display, 48MP Fusion camera with 5x Telephoto, and all-day battery life. Titanium design with Action button and Camera Control.',
  },
  '1004': {
    title: 'Apple iPhone 16 Pro (Black Titanium, 128 GB)',
    brand: 'Apple',
    seller: 'SuperComNet',
    rating: 4.6,
    ratingCount: '1,23,456',
    reviewCount: '11,200',
    highlights: [
      '128 GB ROM',
      '15.94 cm (6.3 inch) Super Retina XDR Display',
      '48MP + 12MP + 48MP | 12MP Front Camera',
      'A18 Pro Chip, 6 Core Processor',
      'Titanium Design, Action Button, Camera Control',
    ],
    reviews: [
      { rating: 5, title: 'Compact powerhouse', comment: 'Perfect size with Pro features. Love the Black Titanium color!', author: 'Nikhil P', date: '5 months ago', verifiedPurchase: true, likes: 1234, dislikes: 198 },
      { rating: 5, title: 'Best Pro phone', comment: 'Same great cameras as Pro Max in a more compact form. Highly recommended!', author: 'Aisha K', date: '4 months ago', verifiedPurchase: true, likes: 987, dislikes: 156 },
      { rating: 4, title: 'Great performance', comment: 'Smooth performance and excellent camera. Battery could be slightly better.', author: 'Raj V', date: '3 months ago', verifiedPurchase: true, likes: 654, dislikes: 98 },
    ],
    specs: {
      'Model Name': 'iPhone 16 Pro',
      'Color': 'Black Titanium',
      'Display Size': '15.94 cm (6.3 inch)',
      'Display Type': 'Super Retina XDR Display',
      'Operating System': 'iOS 18',
      'Processor Type': 'A18 Pro Chip',
      'Internal Storage': '128 GB',
      'RAM': '8 GB',
      'Primary Camera': '48MP + 12MP + 48MP',
      'Battery Capacity': '3582 mAh',
    },
    description: 'Apple iPhone 16 Pro with A18 Pro chip, 6.3-inch Super Retina XDR display, and triple camera system with 5x optical zoom.',
  },
  '1005': {
    title: 'Apple iPhone 15 (Black, 128 GB)',
    brand: 'Apple',
    seller: 'SuperComNet',
    rating: 4.6,
    ratingCount: '3,45,678',
    reviewCount: '28,900',
    highlights: [
      '128 GB ROM',
      '15.54 cm (6.1 inch) Super Retina XDR Display',
      '48MP + 12MP | 12MP Front Camera',
      'A16 Bionic Chip, 6 Core Processor',
      'Dynamic Island, USB-C',
    ],
    reviews: [
      { rating: 5, title: 'Best value iPhone', comment: 'Perfect balance of features and price. Camera is excellent!', author: 'Meena T', date: '8 months ago', verifiedPurchase: true, likes: 3456, dislikes: 567 },
      { rating: 4, title: 'Great phone', comment: 'Good phone overall. Dynamic Island is useful once you get used to it.', author: 'Suresh K', date: '6 months ago', verifiedPurchase: true, likes: 2345, dislikes: 432 },
      { rating: 5, title: 'Superb camera', comment: '48MP main camera takes stunning photos. Night mode is incredible.', author: 'Divya L', date: '5 months ago', verifiedPurchase: true, likes: 1876, dislikes: 298 },
    ],
    specs: {
      'Model Name': 'iPhone 15',
      'Color': 'Black',
      'Display Size': '15.54 cm (6.1 inch)',
      'Display Type': 'Super Retina XDR Display',
      'Operating System': 'iOS 17',
      'Processor Type': 'A16 Bionic Chip',
      'Internal Storage': '128 GB',
      'RAM': '6 GB',
      'Primary Camera': '48MP + 12MP',
      'Battery Capacity': '3349 mAh',
    },
    description: 'Apple iPhone 15 with A16 Bionic chip, 48MP camera, Dynamic Island, and USB-C. 6.1-inch Super Retina XDR display.',
  },
  '1006': {
    title: 'Apple iPhone 14 (Starlight, 128 GB)',
    brand: 'Apple',
    seller: 'SuperComNet',
    rating: 4.6,
    ratingCount: '4,56,789',
    reviewCount: '35,600',
    highlights: [
      '128 GB ROM',
      '15.40 cm (6.1 inch) Super Retina XDR Display',
      '12MP + 12MP | 12MP Front Camera',
      'A15 Bionic Chip',
      'Crash Detection, Emergency SOS via Satellite',
    ],
    reviews: [
      { rating: 5, title: 'Reliable daily driver', comment: 'Still a great phone even after newer models. Battery life is excellent.', author: 'Karan S', date: '1 year ago', verifiedPurchase: true, likes: 5678, dislikes: 890 },
      { rating: 4, title: 'Good phone', comment: 'Solid performance and great camera for the price now.', author: 'Anita D', date: '10 months ago', verifiedPurchase: true, likes: 3456, dislikes: 567 },
      { rating: 5, title: 'Value for money', comment: 'Best iPhone to buy right now at this price point. Does everything well.', author: 'Rahul G', date: '8 months ago', verifiedPurchase: true, likes: 2345, dislikes: 398 },
    ],
    specs: {
      'Model Name': 'iPhone 14',
      'Color': 'Starlight',
      'Display Size': '15.40 cm (6.1 inch)',
      'Display Type': 'Super Retina XDR Display',
      'Operating System': 'iOS 16',
      'Processor Type': 'A15 Bionic Chip',
      'Internal Storage': '128 GB',
      'RAM': '6 GB',
      'Primary Camera': '12MP + 12MP',
      'Battery Capacity': '3279 mAh',
    },
    description: 'Apple iPhone 14 with A15 Bionic chip, dual 12MP camera system, Crash Detection, and Emergency SOS via Satellite.',
  },
  '1007': {
    title: 'Apple iPhone 13 (Starlight, 128 GB)',
    brand: 'Apple',
    seller: 'SuperComNet',
    rating: 4.6,
    ratingCount: '5,67,890',
    reviewCount: '42,300',
    highlights: [
      '128 GB ROM',
      '15.40 cm (6.1 inch) Super Retina XDR Display',
      '12MP + 12MP | 12MP Front Camera',
      'A15 Bionic Chip',
      'Cinematic Mode, Photographic Styles',
    ],
    reviews: [
      { rating: 5, title: 'Still going strong', comment: 'Best phone I\'ve owned. Performance hasn\'t dropped one bit.', author: 'Vikram P', date: '1 year ago', verifiedPurchase: true, likes: 7890, dislikes: 1234 },
      { rating: 5, title: 'Budget flagship', comment: 'Now at a great price, this is the best iPhone you can buy.', author: 'Priya M', date: '8 months ago', verifiedPurchase: true, likes: 5678, dislikes: 876 },
      { rating: 4, title: 'Excellent', comment: 'Great camera and battery. Cinematic mode is fun to use.', author: 'Deepak R', date: '6 months ago', verifiedPurchase: true, likes: 3456, dislikes: 567 },
    ],
    specs: {
      'Model Name': 'iPhone 13',
      'Color': 'Starlight',
      'Display Size': '15.40 cm (6.1 inch)',
      'Display Type': 'Super Retina XDR Display',
      'Operating System': 'iOS 15',
      'Processor Type': 'A15 Bionic Chip',
      'Internal Storage': '128 GB',
      'RAM': '4 GB',
      'Primary Camera': '12MP + 12MP',
      'Battery Capacity': '3227 mAh',
    },
    description: 'Apple iPhone 13 with A15 Bionic chip, dual 12MP camera with Cinematic mode, and all-day battery life.',
  },
  '1008': {
    title: 'Apple iPhone 12 (Blue, 64 GB)',
    brand: 'Apple',
    seller: 'Appario Retail',
    rating: 4.6,
    ratingCount: '6,78,901',
    reviewCount: '48,700',
    highlights: [
      '64 GB ROM',
      '15.49 cm (6.1 inch) Super Retina XDR Display',
      '12MP + 12MP | 12MP Front Camera',
      'A14 Bionic Chip',
      'Ceramic Shield, MagSafe',
    ],
    reviews: [
      { rating: 5, title: 'Classic iPhone', comment: 'Timeless design. Still works perfectly after all these years.', author: 'Sanjay K', date: '1 year ago', verifiedPurchase: true, likes: 9876, dislikes: 1543 },
      { rating: 4, title: 'Good phone', comment: 'Solid choice if you want iOS at a lower price. Camera is still great.', author: 'Neha S', date: '10 months ago', verifiedPurchase: true, likes: 6543, dislikes: 987 },
      { rating: 5, title: 'Perfect entry iPhone', comment: 'Best iPhone for first-time Apple users. 5G and great cameras.', author: 'Arjun T', date: '8 months ago', verifiedPurchase: true, likes: 4567, dislikes: 678 },
    ],
    specs: {
      'Model Name': 'iPhone 12',
      'Color': 'Blue',
      'Display Size': '15.49 cm (6.1 inch)',
      'Display Type': 'Super Retina XDR Display',
      'Operating System': 'iOS 14',
      'Processor Type': 'A14 Bionic Chip',
      'Internal Storage': '64 GB',
      'RAM': '4 GB',
      'Primary Camera': '12MP + 12MP',
      'Battery Capacity': '2815 mAh',
    },
    description: 'Apple iPhone 12 with A14 Bionic, dual 12MP camera system, Ceramic Shield front cover, and MagSafe compatibility.',
  },
  '1002': {
    title: 'Samsung Galaxy S25 Ultra (Titanium Black, 512 GB)',
    brand: 'Samsung',
    seller: 'Samsung Authorized',
    rating: 4.5,
    ratingCount: '34,567',
    reviewCount: '4,200',
    highlights: [
      '512 GB ROM, 12 GB RAM',
      '17.27 cm (6.8 inch) Dynamic AMOLED 2X',
      '200MP + 50MP + 10MP + 12MP | 12MP Front Camera',
      'Snapdragon 8 Elite Processor',
      'S Pen Built-in, Galaxy AI',
    ],
    reviews: [
      { rating: 5, title: 'Best Android phone', comment: 'The S25 Ultra is absolutely stunning. S Pen integration is seamless.', author: 'Rohit B', date: '3 months ago', verifiedPurchase: true, likes: 2345, dislikes: 345 },
      { rating: 5, title: 'Galaxy AI is incredible', comment: 'Circle to Search and AI features make this future-proof.', author: 'Ananya S', date: '2 months ago', verifiedPurchase: true, likes: 1876, dislikes: 234 },
      { rating: 4, title: 'Premium feel', comment: 'Titanium frame feels amazing. Camera is top-notch. A bit heavy though.', author: 'Manish G', date: '3 months ago', verifiedPurchase: true, likes: 1234, dislikes: 198 },
    ],
    specs: {
      'Model Name': 'Galaxy S25 Ultra',
      'Color': 'Titanium Black',
      'Display Size': '17.27 cm (6.8 inch)',
      'Display Type': 'Dynamic AMOLED 2X',
      'Operating System': 'Android 15, One UI 7',
      'Processor Type': 'Snapdragon 8 Elite',
      'Internal Storage': '512 GB',
      'RAM': '12 GB',
      'Primary Camera': '200MP + 50MP + 10MP + 12MP',
      'Battery Capacity': '5000 mAh',
      'Weight': '218 g',
    },
    description: 'Samsung Galaxy S25 Ultra with Snapdragon 8 Elite, 200MP camera, S Pen, and Galaxy AI. 6.8-inch Dynamic AMOLED 2X display with titanium frame.',
  },
  '33': {
    title: 'Sony WH-1000XM5 Wireless Headphones',
    brand: 'Sony',
    seller: 'Sony Official',
    rating: 4.4,
    ratingCount: '12,345',
    reviewCount: '2,100',
    highlights: [
      'Industry-Leading Noise Cancellation',
      '30 Hours Battery Life',
      'Multipoint Bluetooth Connection',
      'Speak-to-Chat, Quick Attention Mode',
      'Hi-Res Audio, LDAC Support',
    ],
    reviews: [
      { rating: 5, title: 'Best ANC headphones', comment: 'Noise cancellation is incredible. Audio quality is top notch.', author: 'Arjun M', date: '4 months ago', verifiedPurchase: true, likes: 876, dislikes: 123 },
      { rating: 5, title: 'Perfect for travel', comment: '30hr battery and amazing noise cancellation. Best purchase ever!', author: 'Priti S', date: '3 months ago', verifiedPurchase: true, likes: 654, dislikes: 87 },
      { rating: 4, title: 'Great but pricey', comment: 'Excellent sound and ANC. Wish it was a bit cheaper.', author: 'Raj K', date: '5 months ago', verifiedPurchase: true, likes: 432, dislikes: 76 },
    ],
    specs: {
      'Driver Size': '30mm',
      'Frequency Response': '4 Hz - 40,000 Hz',
      'Impedance': '48 Ohm',
      'Bluetooth Version': '5.3',
      'Battery Life': '30 Hours',
      'Charging': 'USB Type-C',
      'Noise Cancellation': 'Active Noise Cancellation',
      'Weight': '250 g',
    },
    description: 'Sony WH-1000XM5 wireless headphones with industry-leading noise cancellation, 30-hour battery life, and Hi-Res Audio support.',
  },
  '18': {
    title: 'Nike Air Max 270 Running Shoes',
    brand: 'Nike',
    highlights: [
      'Lightweight and breathable mesh upper',
      'Max Air 270 unit for responsive cushioning',
      'Foam midsole for added comfort',
      'Rubber outsole with herringbone pattern',
      'Pull tab on heel for easy on/off',
    ],
    reviews: [
      { rating: 5, title: 'Super comfortable', comment: 'Best running shoes I\'ve owned. Air cushioning is amazing!', author: 'Vikram S', date: '3 months ago', verifiedPurchase: true, likes: 345, dislikes: 23 },
      { rating: 4, title: 'Great shoes', comment: 'Very comfortable for daily wear. True to size.', author: 'Aarti R', date: '4 months ago', verifiedPurchase: true, likes: 234, dislikes: 18 },
    ],
  },
  '17': {
    title: "Levi's Men Slim Fit Jeans",
    brand: "Levi's",
    highlights: [
      'Slim Fit through hip and thigh',
      'Classic 5-pocket styling',
      'Premium denim fabric',
      'Zip fly with button closure',
      'Machine washable',
    ],
    reviews: [
      { rating: 5, title: 'Perfect fit', comment: 'Classic Levi\'s quality. Slim fit is perfect, not too tight.', author: 'Rahul M', date: '2 months ago', verifiedPurchase: true, likes: 567, dislikes: 34 },
      { rating: 4, title: 'Good jeans', comment: 'Quality is great. Color doesn\'t fade after multiple washes.', author: 'Suresh P', date: '3 months ago', verifiedPurchase: true, likes: 345, dislikes: 23 },
    ],
  },
};

let updatedCount = 0;

for (const product of products) {
  const id = product.id;
  
  const prefix = imageMapping[id];
  if (prefix) {
    const imgs = getLocalImages(prefix);
    if (imgs.length > 0) {
      product.images = imgs.slice(0, 8);
      product.image = imgs[0];
      console.log(`  ${id} | ${product.title} => ${imgs.length} images (using ${product.images.length})`);
      updatedCount++;
    }
  }
  
  const dupSource = duplicateMapping[id];
  if (dupSource) {
    const sourcePrefix = imageMapping[dupSource];
    if (sourcePrefix) {
      const imgs = getLocalImages(sourcePrefix);
      if (imgs.length > 0) {
        product.images = imgs.slice(0, 8);
        product.image = imgs[0];
        console.log(`  ${id} (dup of ${dupSource}) | ${product.title} => ${imgs.length} images`);
        updatedCount++;
      }
    }
  }
  
  const data = scrapedData[id] || (dupSource && scrapedData[dupSource]);
  if (data) {
    if (data.highlights?.length) product.highlights = data.highlights;
    if (data.reviews?.length) product.reviews = data.reviews;
    if (data.offers?.length) product.offers = data.offers;
    if (data.specs && Object.keys(data.specs).length) product.specs = data.specs;
    if (data.brand) product.brand = data.brand;
    if (data.seller) product.seller = data.seller;
    if (data.description) product.description = data.description;
    if (data.rating) product.rating = data.rating;
    if (data.ratingCount) product.ratingCount = data.ratingCount;
    if (data.reviewCount) product.reviewCount = data.reviewCount;
  }
}

fs.writeFileSync(PRODUCTS_PATH, JSON.stringify(products, null, 2) + '\n');
console.log(`\nDone. Updated ${updatedCount} products with Flipkart CDN images.`);
console.log(`Products file: ${PRODUCTS_PATH}`);
