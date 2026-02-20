const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '..', 'public', 'images');

// Create directories
['products', 'categories', 'banners'].forEach(dir => {
    fs.mkdirSync(path.join(publicDir, dir), { recursive: true });
});

// Generate product SVGs with realistic product illustrations
const products = [
    {
        name: 'iphone15',
        label: 'iPhone 15',
        sublabel: 'Blue, 128 GB',
        color: '#007AFF',
        bgGradient: ['#E8F4FD', '#D1ECFB'],
        icon: `<rect x="95" y="30" width="110" height="220" rx="18" fill="#4A90D9" stroke="#2D6EB5" stroke-width="2"/>
           <rect x="105" y="48" width="90" height="170" rx="4" fill="#1a1a2e"/>
           <circle cx="150" cy="240" r="6" fill="#2D6EB5" stroke="#1a3a5c" stroke-width="1"/>
           <rect x="130" y="34" width="40" height="8" rx="4" fill="#1a1a2e"/>
           <circle cx="220" cy="60" r="14" fill="#2D6EB5" stroke="#1a3a5c" stroke-width="2"/>
           <circle cx="220" cy="60" r="8" fill="#1a1a2e"/>
           <circle cx="220" cy="85" r="10" fill="#2D6EB5" stroke="#1a3a5c" stroke-width="2"/>
           <circle cx="220" cy="85" r="5" fill="#1a1a2e"/>`
    },
    {
        name: 'samsung_s23',
        label: 'Galaxy S23 5G',
        sublabel: 'Green, 256 GB',
        color: '#2E7D32',
        bgGradient: ['#E8F5E9', '#C8E6C9'],
        icon: `<rect x="95" y="30" width="110" height="220" rx="14" fill="#388E3C" stroke="#1B5E20" stroke-width="2"/>
           <rect x="103" y="40" width="94" height="190" rx="4" fill="#1a1a2e"/>
           <circle cx="150" cy="36" r="4" fill="#1a1a2e"/>
           <circle cx="215" cy="55" r="12" fill="#388E3C" stroke="#1B5E20" stroke-width="2"/>
           <circle cx="215" cy="55" r="6" fill="#1a1a2e"/>
           <circle cx="215" cy="80" r="10" fill="#388E3C" stroke="#1B5E20" stroke-width="2"/>
           <circle cx="215" cy="80" r="5" fill="#1a1a2e"/>
           <circle cx="215" cy="100" r="8" fill="#388E3C" stroke="#1B5E20" stroke-width="2"/>
           <circle cx="215" cy="100" r="4" fill="#1a1a2e"/>`
    },
    {
        name: 'airpods_pro',
        label: 'AirPods Pro',
        sublabel: '2nd Generation',
        color: '#8E8E93',
        bgGradient: ['#F5F5F7', '#E8E8ED'],
        icon: `<rect x="110" y="80" width="80" height="110" rx="16" fill="#F5F5F7" stroke="#D2D2D7" stroke-width="2"/>
           <rect x="125" y="90" width="50" height="20" rx="4" fill="#E8E8ED" stroke="#D2D2D7" stroke-width="1"/>
           <ellipse cx="130" cy="140" rx="16" ry="20" fill="#F5F5F7" stroke="#D2D2D7" stroke-width="2"/>
           <rect x="126" y="155" width="8" height="25" rx="3" fill="#F5F5F7" stroke="#D2D2D7" stroke-width="1.5"/>
           <ellipse cx="170" cy="140" rx="16" ry="20" fill="#F5F5F7" stroke="#D2D2D7" stroke-width="2"/>
           <rect x="166" y="155" width="8" height="25" rx="3" fill="#F5F5F7" stroke="#D2D2D7" stroke-width="1.5"/>
           <circle cx="150" cy="200" r="3" fill="#FF9500"/>`
    },
    {
        name: 'sony_xm5',
        label: 'WH-1000XM5',
        sublabel: 'Noise Cancelling',
        color: '#212121',
        bgGradient: ['#F5F5F5', '#E0E0E0'],
        icon: `<ellipse cx="150" cy="120" rx="70" ry="10" fill="none" stroke="#333" stroke-width="6"/>
           <path d="M 80 120 Q 80 60 110 50" stroke="#333" stroke-width="8" fill="none" stroke-linecap="round"/>
           <path d="M 220 120 Q 220 60 190 50" stroke="#333" stroke-width="8" fill="none" stroke-linecap="round"/>
           <path d="M 110 50 Q 150 35 190 50" stroke="#333" stroke-width="8" fill="none" stroke-linecap="round"/>
           <ellipse cx="80" cy="135" rx="25" ry="35" fill="#333" stroke="#1a1a1a" stroke-width="2"/>
           <ellipse cx="80" cy="135" rx="18" ry="25" fill="#444"/>
           <ellipse cx="220" cy="135" rx="25" ry="35" fill="#333" stroke="#1a1a1a" stroke-width="2"/>
           <ellipse cx="220" cy="135" rx="18" ry="25" fill="#444"/>`
    },
    {
        name: 'canon_3000d',
        label: 'Canon EOS 3000D',
        sublabel: 'DSLR Camera',
        color: '#C62828',
        bgGradient: ['#FFF3E0', '#FFE0B2'],
        icon: `<rect x="80" y="70" width="140" height="100" rx="10" fill="#1a1a1a" stroke="#333" stroke-width="2"/>
           <rect x="95" y="50" width="50" height="25" rx="4" fill="#333"/>
           <circle cx="160" cy="120" r="35" fill="#222" stroke="#444" stroke-width="3"/>
           <circle cx="160" cy="120" r="25" fill="#333" stroke="#555" stroke-width="2"/>
           <circle cx="160" cy="120" r="15" fill="#1a1a2e"/>
           <circle cx="160" cy="120" r="8" fill="#2196F3" opacity="0.3"/>
           <rect x="85" y="78" width="20" height="12" rx="2" fill="#C62828"/>
           <circle cx="200" cy="78" r="6" fill="#444" stroke="#555" stroke-width="1"/>
           <rect x="80" y="170" width="30" height="45" rx="3" fill="#222" stroke="#333" stroke-width="1"/>
           <rect x="85" y="175" width="20" height="12" rx="2" fill="#333"/>`
    },
    {
        name: 'hp_pavilion',
        label: 'HP Pavilion',
        sublabel: 'Gaming Laptop',
        color: '#4A148C',
        bgGradient: ['#F3E5F5', '#E1BEE7'],
        icon: `<rect x="55" y="50" width="190" height="120" rx="6" fill="#1a1a1a" stroke="#333" stroke-width="2"/>
           <rect x="65" y="58" width="170" height="100" rx="2" fill="#0D47A1"/>
           <defs><linearGradient id="screen" x1="0%" y1="0%" x2="100%" y2="100%">
             <stop offset="0%" style="stop-color:#1565C0"/>
             <stop offset="50%" style="stop-color:#7B1FA2"/>
             <stop offset="100%" style="stop-color:#E65100"/>
           </linearGradient></defs>
           <rect x="65" y="58" width="170" height="100" rx="2" fill="url(#screen)"/>
           <path d="M 45 170 L 55 170 L 245 170 L 255 170 L 255 180 C 255 185 250 188 245 188 L 55 188 C 50 188 45 185 45 180 Z" fill="#222" stroke="#333" stroke-width="1"/>
           <rect x="120" y="172" width="60" height="4" rx="2" fill="#444"/>
           <polygon points="150,65 155,75 165,75 157,82 160,92 150,86 140,92 143,82 135,75 145,75" fill="#FFD600" opacity="0.6"/>`
    }
];

// Generate product images
products.forEach(prod => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
  <defs>
    <linearGradient id="bg_${prod.name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${prod.bgGradient[0]}"/>
      <stop offset="100%" style="stop-color:${prod.bgGradient[1]}"/>
    </linearGradient>
  </defs>
  <rect width="300" height="300" fill="url(#bg_${prod.name})" rx="8"/>
  ${prod.icon}
  <text x="150" y="270" text-anchor="middle" font-family="Arial, sans-serif" font-size="14" font-weight="bold" fill="#333">${prod.label}</text>
  <text x="150" y="288" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="#666">${prod.sublabel}</text>
</svg>`;
    fs.writeFileSync(path.join(publicDir, 'products', `${prod.name}.svg`), svg);
    console.log(`Created: products/${prod.name}.svg`);
});

// Generate category icons
const categories = [
    { name: 'mobiles', label: 'Mobiles', emoji: '📱', color: '#2196F3' },
    { name: 'fashion', label: 'Fashion', emoji: '👗', color: '#E91E63' },
    { name: 'electronics', label: 'Electronics', emoji: '🖥️', color: '#FF9800' },
    { name: 'home', label: 'Home', emoji: '🏠', color: '#4CAF50' },
    { name: 'travel', label: 'Travel', emoji: '✈️', color: '#03A9F4' },
    { name: 'appliances', label: 'Appliances', emoji: '🔌', color: '#795548' },
    { name: 'furniture', label: 'Furniture', emoji: '🪑', color: '#607D8B' },
    { name: 'beauty', label: 'Beauty', emoji: '💄', color: '#FF5722' },
    { name: 'grocery', label: 'Grocery', emoji: '🛒', color: '#8BC34A' },
];

categories.forEach(cat => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <defs>
    <linearGradient id="catbg_${cat.name}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${cat.color};stop-opacity:0.1"/>
      <stop offset="100%" style="stop-color:${cat.color};stop-opacity:0.25"/>
    </linearGradient>
  </defs>
  <circle cx="64" cy="56" r="45" fill="url(#catbg_${cat.name})"/>
  <text x="64" y="68" text-anchor="middle" font-size="40">${cat.emoji}</text>
  <text x="64" y="118" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" font-weight="600" fill="#333">${cat.label}</text>
</svg>`;
    fs.writeFileSync(path.join(publicDir, 'categories', `${cat.name}.svg`), svg);
    console.log(`Created: categories/${cat.name}.svg`);
});

// Generate banner slides
const banners = [
    {
        name: 'banner1',
        title: 'Mega Sale',
        subtitle: 'Up to 70% Off on Electronics',
        badge: 'CODE: FLIPDEAL',
        bgColors: ['#2874f0', '#1a5bb5'],
        accent: '#FFD700'
    },
    {
        name: 'banner2',
        title: 'Fashion Sale',
        subtitle: 'Min 50% Off on Top Brands',
        badge: 'SHOP NOW',
        bgColors: ['#fb641b', '#e85d19'],
        accent: '#FFF'
    },
    {
        name: 'banner3',
        title: 'Big Saving Days',
        subtitle: 'Extra ₹25,000 Off on Mobiles',
        badge: 'LIMITED TIME',
        bgColors: ['#388E3C', '#2E7D32'],
        accent: '#FFD700'
    }
];

banners.forEach(banner => {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="270" viewBox="0 0 1600 270">
  <defs>
    <linearGradient id="bannerbg_${banner.name}" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:${banner.bgColors[0]}"/>
      <stop offset="100%" style="stop-color:${banner.bgColors[1]}"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="270" fill="url(#bannerbg_${banner.name})"/>
  <!-- Decorative circles -->
  <circle cx="1400" cy="135" r="200" fill="white" opacity="0.05"/>
  <circle cx="1350" cy="135" r="150" fill="white" opacity="0.05"/>
  <circle cx="200" cy="300" r="150" fill="white" opacity="0.03"/>
  <!-- Text -->
  <text x="120" y="100" font-family="Arial, sans-serif" font-size="48" font-weight="bold" fill="white">${banner.title}</text>
  <text x="120" y="150" font-family="Arial, sans-serif" font-size="28" fill="white" opacity="0.9">${banner.subtitle}</text>
  <rect x="120" y="175" width="200" height="40" rx="4" fill="${banner.accent}"/>
  <text x="220" y="202" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="bold" fill="${banner.bgColors[0]}">${banner.badge}</text>
  <!-- Flipkart star -->
  <polygon points="1450,50 1460,80 1490,80 1465,100 1475,130 1450,110 1425,130 1435,100 1410,80 1440,80" fill="${banner.accent}" opacity="0.3"/>
</svg>`;
    fs.writeFileSync(path.join(publicDir, 'banners', `${banner.name}.svg`), svg);
    console.log(`Created: banners/${banner.name}.svg`);
});

console.log('\n✅ All images generated successfully!');
console.log(`Total files: ${products.length + categories.length + banners.length}`);
