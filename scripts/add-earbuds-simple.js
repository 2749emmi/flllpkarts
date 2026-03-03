const fs = require('fs');

// Read products
const products = JSON.parse(fs.readFileSync('src/data/products.json', 'utf-8'));

console.log('Before:', products.length, 'products');

// Remove fake AirPods
const cleaned = products.filter(p => {
  const isFake = p.title.toLowerCase().includes('airpods') && 
                 (p.highlights?.some(h => h.includes('ROM') || h.includes('Display') || h.includes('Camera')) ||
                  p.specs?.['Display Size']);
  return !isFake;
});

console.log('After cleaning:', cleaned.length, 'products');

// Add real earbuds
const earbuds = [
  {
    id: '90001',
    title: 'Apple AirPods Pro (2nd Generation) with MagSafe Case (USB-C)',
    price: 19990,
    originalPrice: 24900,
    discount: 20,
    image: '/images/products/airpods-pro-2.jpeg',
    rating: 4.7,
    ratingCount: '89,234',
    reviewCount: '7,812',
    category: 'electronics',
    offers: ['Bank Offer: 5% Cashback', 'Special Price'],
    highlights: ['Active Noise Cancellation', 'Adaptive Transparency', 'Spatial Audio', 'USB-C Charging'],
    description: 'AirPods Pro with Active Noise Cancellation and Spatial Audio',
    images: ['/images/products/airpods-pro-2.jpeg'],
    specs: { 'Model': 'AirPods Pro 2', 'Type': 'True Wireless', 'Battery': '6 hrs' },
    reviews: [],
    brand: 'Apple',
    seller: 'RetailNet',
    variants: []
  },
  {
    id: '90002',
    title: 'boAt Airdopes 100 with 50 Hours Playback',
    price: 999,
    originalPrice: 2990,
    discount: 67,
    image: '/images/products/boat-bassheads.jpeg',
    rating: 4.2,
    ratingCount: '45,678',
    reviewCount: '3,421',
    category: 'electronics',
    offers: ['Bank Offer: 10% off', 'Special Price'],
    highlights: ['50 Hours Playback', 'Quad Mics ENx', 'BEAST Mode', 'IPX5 Water Resistant'],
    description: 'boAt Airdopes 100 with 50 hours playback and quad mics',
    images: ['/images/products/boat-bassheads.jpeg'],
    specs: { 'Model': 'Airdopes 100', 'Type': 'True Wireless', 'Battery': '50 hrs' },
    reviews: [],
    brand: 'boAt',
    seller: 'Imagine Marketing',
    variants: []
  },
  {
    id: '90003',
    title: 'Sony WH-1000XM5 Wireless Noise Cancelling Headphones',
    price: 24990,
    originalPrice: 33990,
    discount: 26,
    image: '/images/products/sony-wh1000xm5-black-bluetooth-wired-headset-black-on-the-ea-1.jpeg',
    rating: 4.6,
    ratingCount: '12,345',
    reviewCount: '1,234',
    category: 'electronics',
    offers: ['Bank Offer: ₹2000 off', 'No Cost EMI'],
    highlights: ['Industry Leading ANC', '30 Hour Battery', 'Multipoint Connection', 'Premium Sound'],
    description: 'Sony WH-1000XM5 with industry-leading noise cancellation',
    images: ['/images/products/sony-wh1000xm5-black-bluetooth-wired-headset-black-on-the-ea-1.jpeg'],
    specs: { 'Model': 'WH-1000XM5', 'Type': 'Over Ear', 'Battery': '30 hrs' },
    reviews: [],
    brand: 'Sony',
    seller: 'Sony India',
    variants: []
  }
];

cleaned.push(...earbuds);

fs.writeFileSync('src/data/products.json', JSON.stringify(cleaned, null, 2));

console.log('Final:', cleaned.length, 'products');
console.log('Added 3 real earbuds!');
