const fs = require('fs');
const path = require('path');

const realLaptops = [
  {
    id: 'laptop-001',
    title: 'Apple 2024 MacBook Air M3 (13 inch, 8GB, 256GB SSD, Midnight)',
    price: 99900,
    originalPrice: 114900,
    discount: 13,
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/computer/u/n/k/-original-imagypv6nmqhh9fm.jpeg?q=70',
    rating: 4.8,
    ratingCount: '23,450',
    reviewCount: '3,200',
    category: 'electronics',
    brand: 'Apple',
    seller: 'Apple Authorized Reseller',
    highlights: [
      'Apple M3 chip with 8-core CPU',
      '13.6-inch Liquid Retina Display',
      '8GB Unified Memory',
      '256GB SSD Storage',
      'Up to 18 hours battery life',
      'Fanless Design - Silent Operation',
      '1080p FaceTime HD Camera',
      'MagSafe 3 Charging Port'
    ],
    description: 'The MacBook Air with M3 chip delivers exceptional performance in an incredibly thin and light design. The 13.6-inch Liquid Retina display supports 1 billion colors for stunning visuals. With up to 18 hours of battery life, you can work all day without charging.',
    images: [
      'https://rukminim2.flixcart.com/image/416/416/xif0q/computer/u/n/k/-original-imagypv6nmqhh9fm.jpeg?q=70',
      'https://rukminim2.flixcart.com/image/416/416/xif0q/computer/2/v/v/-original-imagypv6gfphh9fm.jpeg?q=70',
      'https://rukminim2.flixcart.com/image/416/416/xif0q/computer/k/l/m/-original-imagypv6zraxt8gg.jpeg?q=70',
    ],
    specs: {
      'Brand': 'Apple',
      'Model': 'MacBook Air (M3, 2024)',
      'Processor': 'Apple M3 (8-core CPU, 10-core GPU)',
      'RAM': '8 GB Unified Memory',
      'Storage': '256 GB SSD',
      'Display': '13.6-inch Liquid Retina (2560 x 1664)',
      'Graphics': 'Integrated 10-core GPU',
      'Operating System': 'macOS',
      'Weight': '1.24 kg',
      'Battery': 'Up to 18 hours',
      'Ports': '2x Thunderbolt/USB 4, MagSafe 3, 3.5mm jack'
    },
    offers: [
      'Bank Offer: 5% Cashback on Flipkart Axis Bank Card',
      'No Cost EMI: Starting from ₹8,325/month',
      'Exchange Offer: Up to ₹15,000 off on old laptop'
    ],
    reviews: []
  },
  {
    id: 'laptop-002',
    title: 'HP Pavilion Plus 14 Intel Core Ultra 5 125U (16GB/512GB SSD/Windows 11)',
    price: 79990,
    originalPrice: 109990,
    discount: 27,
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/computer/k/l/m/-original-imah2z8ggfphh9fm.jpeg?q=70',
    rating: 4.4,
    ratingCount: '5,678',
    reviewCount: '432',
    category: 'electronics',
    brand: 'HP',
    seller: 'HP World',
    highlights: [
      'Intel Core Ultra 5 125U Processor',
      '14-inch 2.8K OLED Display (2880 x 1800)',
      '16GB DDR5 RAM',
      '512GB PCIe NVMe SSD',
      'Intel Graphics',
      'Backlit Keyboard',
      'B&O Audio',
      'Windows 11 Home'
    ],
    description: 'The HP Pavilion Plus 14 combines premium design with powerful performance. The stunning 2.8K OLED display delivers vibrant colors and deep blacks. Intel Core Ultra 5 processor handles multitasking with ease.',
    images: [
      'https://rukminim2.flixcart.com/image/416/416/xif0q/computer/k/l/m/-original-imah2z8ggfphh9fm.jpeg?q=70',
    ],
    specs: {
      'Brand': 'HP',
      'Model': 'Pavilion Plus 14',
      'Processor': 'Intel Core Ultra 5 125U',
      'RAM': '16 GB DDR5',
      'Storage': '512 GB SSD',
      'Display': '14-inch 2.8K OLED (2880 x 1800)',
      'Graphics': 'Intel Graphics',
      'Operating System': 'Windows 11 Home',
      'Weight': '1.4 kg',
      'Battery': 'Up to 10 hours',
      'Ports': 'Thunderbolt 4, USB-A, HDMI 2.1, 3.5mm jack'
    },
    offers: [
      'Bank Offer: 10% off on HDFC Bank Credit Card, up to ₹3,000',
      'No Cost EMI: Starting from ₹6,666/month',
      'Exchange Offer: Up to ₹12,000 off on old laptop'
    ],
    reviews: []
  },
  {
    id: 'laptop-003',
    title: 'Dell Inspiron Intel Core i5 13th Gen (16GB/512GB SSD/Windows 11)',
    price: 54990,
    originalPrice: 74990,
    discount: 27,
    image: 'https://rukminim2.flixcart.com/image/312/312/xif0q/computer/2/v/v/-original-imagypv6gfphh9fm.jpeg?q=70',
    rating: 4.3,
    ratingCount: '12,345',
    reviewCount: '2,100',
    category: 'electronics',
    brand: 'Dell',
    seller: 'Dell Exclusive Store',
    highlights: [
      'Intel Core i5 13th Gen 1335U',
      '15.6-inch FHD Display (1920 x 1080)',
      '16GB DDR4 RAM',
      '512GB SSD',
      'Intel Iris Xe Graphics',
      'Backlit Keyboard',
      'Windows 11 Home',
      'Thin & Light - 1.65 kg'
    ],
    description: 'Dell Inspiron delivers reliable performance for everyday computing. The 13th Gen Intel Core i5 processor and 16GB RAM ensure smooth multitasking. Perfect for students and professionals.',
    images: [
      'https://rukminim2.flixcart.com/image/416/416/xif0q/computer/2/v/v/-original-imagypv6gfphh9fm.jpeg?q=70',
    ],
    specs: {
      'Brand': 'Dell',
      'Model': 'Inspiron 15',
      'Processor': 'Intel Core i5 13th Gen 1335U',
      'RAM': '16 GB DDR4',
      'Storage': '512 GB SSD',
      'Display': '15.6-inch FHD (1920 x 1080)',
      'Graphics': 'Intel Iris Xe Graphics',
      'Operating System': 'Windows 11 Home',
      'Weight': '1.65 kg',
      'Battery': 'Up to 8 hours',
      'Ports': 'USB 3.2, USB-C, HDMI, SD Card Reader, 3.5mm jack'
    },
    offers: [
      'Bank Offer: 5% Cashback on Flipkart Axis Bank Card',
      'No Cost EMI: Starting from ₹4,583/month',
      'Exchange Offer: Up to ₹10,000 off on old laptop'
    ],
    reviews: []
  }
];

// Read existing products
const productsPath = path.join(__dirname, '../src/data/products.json');
const products = JSON.parse(fs.readFileSync(productsPath, 'utf8'));

// Remove fake laptop products (those with missing images or wrong data)
const filteredProducts = products.filter(p => {
  const titleLower = p.title.toLowerCase();
  const hasLaptopKeyword = titleLower.includes('macbook') || titleLower.includes('laptop');
  const hasMissingImage = p.image && (p.image.startsWith('/images/products/macbook') || p.image.startsWith('/images/products/laptop'));
  
  // Keep products that are NOT laptops with missing images
  return !(hasLaptopKeyword && hasMissingImage);
});

console.log(`Removed ${products.length - filteredProducts.length} products with missing laptop images`);

// Add real laptops
const updatedProducts = [...filteredProducts, ...realLaptops];

// Save
fs.writeFileSync(productsPath, JSON.stringify(updatedProducts, null, 2));

console.log(`✓ Added ${realLaptops.length} real laptop products`);
console.log(`✓ Total products: ${updatedProducts.length}`);
console.log('\nAdded laptops:');
realLaptops.forEach(l => console.log(`  - ${l.title} (₹${l.price.toLocaleString()})`));
