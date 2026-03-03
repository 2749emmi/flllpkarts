# Admin Scraper Testing Guide

## How to Test the Scraper

### 1. Start the Development Server

```bash
npm run dev
```

### 2. Access the Admin Panel

Navigate to: `http://localhost:3000/admin`

### 3. Add a New Product

Click the "Add New Product" button

### 4. Use the Auto-Import Tab

The scraper has two modes:

#### Auto-Import via Flipkart URL (Recommended)
- Paste any Flipkart product URL
- Set your target selling price (e.g., ₹99)
- Click "Start Import"
- The scraper will:
  - Fetch product title, images, specs, reviews
  - Download high-res images locally
  - Calculate discount based on your target price
  - Add the product to your store

#### Manual Entry
- Fill in product details manually
- Useful for quick testing or non-Flipkart products

### 5. Test URLs

Here are some working Flipkart URLs to test:

**Earbuds:**
```
https://www.flipkart.com/apple-airpods-pro-2nd-generation-bluetooth-headset/p/itm583ef432b2b24
https://www.flipkart.com/boat-airdopes-141-bluetooth-headset/p/itm6c5d5e8f8f8f8
```

**Phones:**
```
https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac6485515ae4
https://www.flipkart.com/samsung-galaxy-s24-ultra-5g-titanium-gray-256-gb/p/itm123456789
```

**Laptops:**
```
https://www.flipkart.com/apple-2023-macbook-pro-m3-8-gb-512-gb-ssd-macos-sonoma-14-inch/p/itm123456789
```

### 6. What the Scraper Extracts

- ✅ Product title with variants
- ✅ High-resolution images (downloaded locally)
- ✅ Original price and discount
- ✅ Rating and review count
- ✅ Product highlights
- ✅ Detailed specifications
- ✅ Real customer reviews (up to 8)
- ✅ Bank offers
- ✅ Seller information
- ✅ Product variants (colors, storage, etc.)

### 7. Verify the Import

After importing:
1. Check the admin products list
2. Visit the product page to see all details
3. Check `/public/images/products/` for downloaded images
4. Verify the product appears in category pages

### 8. Command Line Testing

You can also test the scraper directly:

```bash
# Test scraping without downloading images
node scripts/scrape-flipkart.js "FLIPKART_URL"

# Test with image download
node scripts/scrape-flipkart.js "FLIPKART_URL" --download

# Check the output
cat scripts/scraped-product.json
```

### 9. Troubleshooting

**Scraper fails:**
- Make sure `cheerio` is installed: `npm install cheerio`
- Check if the URL is valid and accessible
- Flipkart may block requests - try again after a few seconds

**Images not downloading:**
- Check internet connection
- Verify `/public/images/products/` directory exists
- Check file permissions

**Product not appearing:**
- Check browser console for errors
- Verify the product was added to `src/data/products.json`
- Try refreshing the page (Ctrl+R)

### 10. API Endpoint

The scraper is also available via API:

```bash
curl -X POST http://localhost:3000/api/admin/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "FLIPKART_URL"}'
```

## Scraper Features

✨ **Smart Parsing**: Extracts data from Flipkart's HTML structure
🖼️ **Image Download**: Downloads high-res product images locally
📊 **Specs Extraction**: Parses specification tables automatically
⭐ **Review Scraping**: Captures real customer reviews
🎨 **Variant Detection**: Identifies color, storage, and size options
💰 **Price Manipulation**: Set custom prices with auto-calculated discounts
