const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '../src/data/products.json');
const products = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

console.log(`📊 Total products: ${products.length}`);

// Remove fake AirPods (those with phone specs)
const cleaned = products.filter(p => {
  const isFake = p.title.toLowerCase().includes('airpods') && 
                 (p.highlights?.some(h => h.includes('ROM') || h.includes('Display') || h.includes('Camera')) ||
                  p.specs?.['Display Size'] || p.specs?.['Internal Storage']);
  if (isFake) {
    console.log(`🗑️  Removed fake: ${p.title}`);
  }
  return !isFake;
});

console.log(`\n✅ Cleaned: ${products.length - cleaned.length} fake products removed`);

// Add real earbud products
const realEarbuds = [
  {
    id: '5001',
    title: 'Apple AirPods Pro (2nd Generation) with MagSafe Case (USB-C)',
    price: 19990,
    originalPrice: 24900,
    discount: 20,
    image: '/images/products/airpods-pro-2.jpeg',
    rating: 4.7,
    ratingCount: '89,234',
    reviewCount: '7,812',
    category: 'electronics',
    offers: [
      'Bank Offer: 5% Cashback on Flipkart Axis Bank Card',
      'Special Price: Get extra ₹2000 off (price inclusive of cashback/coupon)',
    ],
    highlights: [
      'Active Noise Cancellation',
      'Adaptive Transparency',
      'Personalized Spatial Audio with dynamic head tracking',
      'Up to 2x more Active Noise Cancellation',
      'Multiple ear tips (XS, S, M, L)',
      'MagSafe Charging Case with USB-C',
    ],
    description: 'AirPods Pro feature up to 2x more Active Noise Cancellation, plus Adaptive Transparency, and Personalised Spatial Audio with dynamic head tracking for immersive sound.',
    images: ['/images/products/airpods-pro-2.jpeg', '/images/products/airpods_pro.jpg'],
    specs: {
      'Model Name': 'AirPods Pro (2nd generation)',
      'Color': 'White',
      'Headphone Type': 'True Wireless',
      'Inline Remote': 'Yes',
      'Connectivity': 'Bluetooth',
      'Bluetooth Version': '5.3',
      'Battery Life': '6 hrs (ANC on), 30 hrs (with case)',
      'Charging Time': '1 hr',
      'Water Resistant': 'Yes (IPX4)',
      'With Microphone': 'Yes',
      'Warranty': '1 Year',
    },
    reviews: [],
    brand: 'Apple',
    seller: 'RetailNet',
    variants: [],
  },
  {
    id: '5002',
    title: 'boAt Airdopes 100 with 50 Hours Playback, Quad Mics ENx Technology',
    price: 999,
    originalPrice: 2990,
    discount: 67,
    image: '/images/products/boat-bassheads.jpeg',
    rating: 4.2,
    ratingCount: '45,678',
    reviewCount: '3,421',
    category: 'electronics',
    offers: [
      'Bank Offer: 10% off on ICICI Bank Credit Card',
      'Special Price: Get extra 5% off',
    ],
    highlights: [
      '50 Hours Total Playback',
      'Quad Mics with ENx Technology',
      'BEAST Mode for low latency gaming',
      'ASAP Charge - 10 min charge = 10 hrs playback',
      'IPX5 Water Resistance',
      'Bluetooth v5.3',
    ],
    description: 'boAt Airdopes 100 comes with 50 hours of total playback, quad mics with ENx technology for crystal clear calls, and BEAST mode for gaming.',
    images: ['/images/products/boat-bassheads.jpeg'],
    specs: {
      'Model Name': 'Airdopes 100',
      'Color': 'Active Black',
      'Headphone Type': 'True Wireless',
      'Connectivity': 'Bluetooth',
      'Bluetooth Version': '5.3',
      'Battery Life': '50 hrs',
      'Charging Time': '1.5 hrs',
      'Water Resistant': 'Yes (IPX5)',
      'With Microphone': 'Yes (Quad Mics)',
      'Warranty': '1 Year',
    },
    reviews: [],
    brand: 'boAt',
    seller: 'Imagine Marketing',
    variants: [],
  },
  {
    id: '5003',
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    price: 24990,
    originalPrice: 33990,
    discount: 26,
    image: '/images/products/sony-wh1000xm5-black-bluetooth-wired-headset-black-on-the-ea-1.jpeg',
    rating: 4.6,
    ratingCount: '12,345',
    reviewCount: '1,234',
    category: 'electronics',
    offers: [
      'Bank Offer: ₹2000 off on HDFC Bank Credit Card',
      'No Cost EMI available',
    ],
    highlights: [
      'Industry Leading Noise Cancellation',
      '30 Hour Battery Life',
      'Multipoint Connection',
      'Speak-to-Chat Technology',
      'Premium Sound Quality with LDAC',
      'Ultra-comfortable design',
    ],
    description: 'Sony WH-1000XM5 features industry-leading noise cancellation, exceptional sound quality, and 30-hour battery life for the ultimate listening experience.',
    images: [
      '/images/products/sony-wh1000xm5-black-bluetooth-wired-headset-black-on-the-ea-1.jpeg',
      '/images/products/sony-wh1000xm5-black-bluetooth-wired-headset-black-on-the-ea-2.jpeg',
      '/images/products/sony-wh1000xm5-black-bluetooth-wired-headset-black-on-the-ea-3.jpeg',
    ],
    specs: {
      'Model Name': 'WH-1000XM5',
      'Color': 'Black',
      'Headphone Type': 'Over Ear',
      'Connectivity': 'Bluetooth, Wired',
      'Bluetooth Version': '5.2',
      'Battery Life': '30 hrs (ANC on)',
      'Charging Time': '3.5 hrs',
      'Water Resistant': 'No',
      'With Microphone': 'Yes',
      'Warranty': '1 Year',
    },
    reviews: [],
    brand: 'Sony',
    seller: 'Sony India',
    variants: [],
  },
];

console.log(`\n➕ Adding ${realEarbuds.length} real earbud products...`);
realEarbuds.forEach(p => console.log(`   ✅ ${p.title}`));

const updated = [...cleaned, ...realEarbuds];
fs.writeFileSync(dataPath, JSON.stringify(updated, null, 2));

console.log(`\n💾 Saved to products.json`);
console.log(`📊 Final count: ${updated.length} products`);
console.log(`\n✨ Done! Real earbuds added.`);
