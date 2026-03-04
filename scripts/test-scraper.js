#!/usr/bin/env node

console.log('Starting test...');

const url = 'https://www.flipkart.com/triggr-wukong-35db-anc-4-mic-enc-dual-pairing-60h-battery-monkey-king-design-v6-0-bluetooth/p/itm807e3e6847070';

console.log('Fetching:', url);

fetch(url, {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
  }
})
.then(res => {
  console.log('Status:', res.status);
  return res.text();
})
.then(html => {
  console.log('HTML length:', html.length);
  
  const cheerio = require('cheerio');
  const $ = cheerio.load(html);
  
  // Find title
  const title = $('span.VU-ZEz').first().text().trim();
  console.log('Title:', title);
  
  // Find price
  const price = $('.Nx9bqj').first().text().trim();
  console.log('Price:', price);
  
  // Find images
  const images = [];
  $('img').each((i, el) => {
    const src = $(el).attr('src');
    if (src && src.includes('rukminim') && src.includes('/image/')) {
      images.push(src);
    }
  });
  console.log('Images found:', images.length);
  if (images.length > 0) {
    console.log('First image:', images[0]);
  }
  
  console.log('\nTest complete!');
})
.catch(err => {
  console.error('Error:', err.message);
});
