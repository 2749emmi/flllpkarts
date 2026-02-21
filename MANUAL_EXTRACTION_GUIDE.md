# Manual Screenshot & Data Extraction Guide

## 🎯 Objective
Extract all visual layout information and image URLs from the Flipkart iPhone 17 Pro Max product page.

**Product URL**: https://www.flipkart.com/apple-iphone-17-pro-max-cosmic-orange-256-gb/p/itm81f3a173391c4?pid=MOBHFN6YQKMWVPXH

---

## 📸 Step-by-Step Screenshot Guide

### Step 1: Take Full Page Screenshots

1. **Open the product page** in your browser
2. **Wait 5 seconds** for the page to fully load
3. Take screenshots of these sections:

#### Screenshot 1: Top Section (Hero Area)
- **What to capture**: Product images (thumbnails + main image), title, price, rating, offers
- **How**: Scroll to the very top of the page
- **Save as**: `flipkart-top-section.png`
- **Notes to record**:
  - Thumbnail strip width and positioning (left side, vertical)
  - Main image container size
  - Spacing between thumbnails
  - Badge positions (top-left corner badges)

#### Screenshot 2: Offers Section
- **What to capture**: All available offers with green tag icons
- **How**: Scroll to the offers section (below price)
- **Save as**: `flipkart-offers.png`
- **Notes to record**:
  - Offer item styling (icon, text formatting)
  - Spacing between offer items
  - "View more offers" link style

#### Screenshot 3: Delivery & Services
- **What to capture**: Pincode input, delivery icons (truck, return, warranty, COD)
- **How**: Scroll to delivery section
- **Save as**: `flipkart-delivery.png`
- **Notes to record**:
  - Icon sizes and spacing
  - Icon arrangement (horizontal row)
  - Text below each icon

#### Screenshot 4: Highlights
- **What to capture**: Highlights section with bullet points
- **How**: Scroll to highlights
- **Save as**: `flipkart-highlights.png`
- **Notes to record**:
  - Label position ("Highlights" text)
  - List item styling
  - Spacing between items

#### Screenshot 5: Specifications
- **What to capture**: Specifications table with key-value pairs
- **How**: Scroll to specifications section
- **Save as**: `flipkart-specifications.png`
- **Notes to record**:
  - Table structure (no outer borders)
  - Column widths (label vs value)
  - Row separators (bottom borders)

#### Screenshot 6: Ratings & Reviews
- **What to capture**: Rating summary + individual review cards
- **How**: Scroll to reviews section
- **Save as**: `flipkart-reviews.png`
- **Notes to record**:
  - Rating distribution bars with colors
  - Review card layout
  - Meta information (author, date, verified badge)

---

## 🖼️ Step 2: Extract Image URLs

### Method 1: Right-Click on Thumbnails (Recommended)

1. **Find the thumbnail strip** (vertical strip on the left side)
2. **Right-click on each thumbnail image**
3. Select "Copy image address" or "Copy image link"
4. Paste each URL into a text file
5. **Repeat for all thumbnails** (usually 5-8 images)

**Expected URL format**:
```
https://rukminim2.flixcart.com/image/128/128/xif0q/mobile/...
```

### Method 2: Use Browser DevTools

1. **Open DevTools** (F12 or Ctrl+Shift+I)
2. Go to the **"Elements"** tab
3. Click the **element picker** (top-left icon in DevTools)
4. **Hover over the main product image**
5. In the Elements tab, find the `<img>` tag
6. Look for the `src` attribute
7. **Copy the URL**
8. Repeat for each thumbnail

### Method 3: Run the Extraction Script

1. **Open the browser console** (F12 → Console tab)
2. **Copy the script** from `scripts/extract-flipkart-data.js`
3. **Paste into console** and press Enter
4. The script will:
   - Extract all image URLs
   - Convert thumbnails to high-resolution (832x832)
   - Copy all data to your clipboard
   - Log results in the console

---

## 📝 Step 3: Record CSS Properties

### Use Browser DevTools to Inspect Elements

For each major section, record:

#### Product Title
1. Right-click on the product title
2. Select "Inspect"
3. In the Styles panel, note:
   - `font-size` (usually 18px)
   - `font-weight` (usually 500)
   - `color` (usually #212121)
   - `line-height`

#### Price Section
1. Inspect the current price
2. Note:
   - `font-size` (usually 28px)
   - `font-weight` (usually 700)
   - `color`

#### Rating Badge
1. Inspect the green rating badge
2. Note:
   - `background-color` (usually #388e3c)
   - `color` (white)
   - `padding`
   - `border-radius`

#### Buttons (Add to Cart, Buy Now)
1. Inspect each button
2. Note:
   - `background-color` (#ff9f00 for Add to Cart, #fb641b for Buy Now)
   - `padding`
   - `font-size`
   - `border-radius`
   - `box-shadow`

---

## 🎨 Step 4: Color Extraction Checklist

Open the DevTools Color Picker to extract exact colors:

### Primary Colors
- [ ] Flipkart Blue (links, borders)
- [ ] Add to Cart button (orange)
- [ ] Buy Now button (darker orange)
- [ ] Rating badge (green)
- [ ] Discount badge (red)

### Text Colors
- [ ] Primary text (black)
- [ ] Secondary text (gray)
- [ ] Link color (blue)

### Background Colors
- [ ] Page background
- [ ] Card background
- [ ] Input field background

### Border Colors
- [ ] Default border
- [ ] Active/focus border
- [ ] Table row separator

---

## 📐 Step 5: Measure Layout Dimensions

### Using Browser DevTools Ruler

1. Open DevTools
2. Click the element picker
3. Hover over elements to see dimensions in the tooltip

**Measure these elements**:
- [ ] Thumbnail width/height (usually 48px × 48px)
- [ ] Main image container width (usually 480px)
- [ ] Right column width
- [ ] Gap between columns
- [ ] Section padding
- [ ] Button height
- [ ] Input field width
- [ ] Icon sizes

---

## 🔍 Step 6: Extract Product Data

### Using the Extraction Script

1. Run `scripts/extract-flipkart-data.js` in the browser console
2. The script will extract:
   - ✅ All product images (high-resolution URLs)
   - ✅ Product title
   - ✅ Price, original price, discount
   - ✅ Rating and review counts
   - ✅ All offers (text)
   - ✅ All highlights (bullet points)
   - ✅ All specifications (key-value pairs)
   - ✅ First 5 reviews (with author, rating, title, comment, date)

3. The data will be copied to your clipboard in JSON format

### Manual Extraction (if script fails)

Copy and paste the following from the page:

1. **Product Title**: (full text)
2. **Price**: ₹___
3. **Original Price**: ₹___
4. **Discount**: ___%
5. **Rating**: _.__
6. **Offers**: (copy all offer lines)
7. **Highlights**: (copy all bullet points)
8. **Specifications**: (copy key-value pairs)
9. **Reviews**: (copy first 5 reviews)

---

## 📊 Expected Data Structure

After extraction, you should have:

```json
{
  "images": [
    "https://rukminim2.flixcart.com/image/832/832/...",
    "https://rukminim2.flixcart.com/image/832/832/...",
    "..."
  ],
  "title": "Apple iPhone 17 Pro Max (Cosmic Orange, 256 GB)",
  "price": 154999,
  "originalPrice": 179999,
  "discount": 14,
  "rating": 4.6,
  "ratingCount": "47,234",
  "reviewCount": "3,829",
  "offers": [
    "Bank Offer: 10% off on HDFC Bank Credit Card...",
    "..."
  ],
  "highlights": [
    "256 GB ROM",
    "17.78 cm (7 inch) Super Retina XDR Display",
    "..."
  ],
  "specifications": {
    "Display Size": "17.78 cm (7 inch)",
    "Resolution": "2796 x 1290 Pixels",
    "..."
  },
  "reviews": [
    {
      "author": "John Doe",
      "rating": 5,
      "title": "Excellent phone",
      "comment": "Best purchase ever...",
      "date": "15 days ago",
      "verifiedPurchase": true
    }
  ]
}
```

---

## ✅ Checklist

Before you're done, make sure you have:

- [ ] 6 screenshots (top, offers, delivery, highlights, specs, reviews)
- [ ] All product image URLs (at least 5-8 images)
- [ ] Color codes for all UI elements
- [ ] Layout dimensions (widths, heights, spacing)
- [ ] Product data in JSON format
- [ ] CSS properties for key elements

---

## 🚀 Next Steps

Once you have all this data:

1. **Save the JSON data** to a file: `extracted-iphone-17-data.json`
2. **Update your product data** in `src/data/products.json`
3. **Compare screenshots** with your clone to identify differences
4. **Adjust CSS** in your components to match Flipkart's exact styling
5. **Test on mobile** to ensure responsive design matches

---

## 💡 Tips

1. **Use Chrome DevTools** for the best inspection experience
2. **Zoom out** (Ctrl + -) to fit more content in screenshots
3. **Take multiple screenshots** at different scroll positions
4. **Right-click images** to get the highest resolution URLs
5. **Run the script multiple times** if some data is missing
6. **Check the console** for script output and errors
7. **Compare with multiple products** to understand patterns

---

**Ready to start?** Go to the Flipkart page and follow these steps!
