# Flipkart Product Page Layout Guide

## Overview
This document describes the exact layout structure, CSS styles, and design patterns used in Flipkart product pages.

---

## 🎨 Color Palette

### Primary Colors
- **Flipkart Blue**: `#2874f0` (links, buttons, primary actions)
- **Orange (Add to Cart)**: `#ff9f00`
- **Orange (Buy Now)**: `#fb641b`
- **Green (Rating/Success)**: `#388e3c`
- **Red (Deals/Discount)**: `#c31432` to `#ff6161`

### Neutral Colors
- **Black Text**: `#212121` (headings, primary text)
- **Gray Text**: `#878787` (secondary text, labels)
- **Light Gray Border**: `#e0e0e0`, `#f0f0f0`
- **Background**: `#f1f3f6` (page background)
- **White**: `#fff` (cards, containers)

---

## 📐 Layout Structure

### Main Container
```css
.pdp-container {
  max-width: 1248px;
  margin: 0 auto;
  padding: 12px;
  background-color: #f1f3f6;
}
```

### Two-Column Layout
```css
.pdp-layout {
  display: grid;
  grid-template-columns: 480px 1fr;
  gap: 20px;
  background-color: #fff;
  box-shadow: 0 1px 1px 0 rgba(0,0,0,.16);
}

/* Mobile: Stack vertically */
@media (max-width: 768px) {
  .pdp-layout {
    grid-template-columns: 1fr;
  }
}
```

---

## 🖼️ Left Column: Image Gallery

### Gallery Container
- **Width**: `480px` (desktop), `100%` (mobile)
- **Padding**: `24px`
- **Position**: Sticky on desktop (`position: sticky; top: 0;`)

### Thumbnail Strip (Vertical)
```css
.pdp-thumbs {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 550px;
  overflow-y: auto;
  padding-right: 4px;
  scrollbar-width: thin;
}

.thumb-button {
  width: 48px;
  height: 48px;
  border: 1px solid #e0e0e0;
  border-radius: 2px;
  padding: 2px;
  cursor: pointer;
}

.thumb-button.active {
  border: 2px solid #2874f0;
}
```

### Main Image Container
```css
.pdp-main-image {
  position: relative;
  width: 100%;
  aspect-ratio: 1 / 1;
  background-color: #fff;
}

.pdp-main-image img {
  object-fit: contain;
  padding: 32px;
}
```

### Image Badge (Top Left)
```css
.image-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 10;
  background-color: #c31432;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 2px;
}
```

### Action Buttons (Top Right)
```css
.image-actions {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  display: flex;
  gap: 8px;
}

.action-button {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
}
```

### Add to Cart / Buy Now Buttons
```css
.pdp-buttons-desktop {
  display: flex;
  gap: 16px;
  padding: 20px 24px;
}

.btn-add-to-cart {
  flex: 1;
  background-color: #ff9f00;
  color: #fff;
  padding: 16px;
  font-weight: 700;
  font-size: 16px;
  border-radius: 2px;
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
}

.btn-buy-now {
  flex: 1;
  background-color: #fb641b;
  color: #fff;
  padding: 16px;
  font-weight: 700;
  font-size: 16px;
  border-radius: 2px;
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  box-shadow: 0 1px 2px rgba(0,0,0,0.2);
}
```

---

## 📄 Right Column: Product Details

### Container
```css
.pdp-right {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
```

### Product Title
```css
.product-title {
  font-size: 18px;
  font-weight: 500;
  color: #212121;
  margin: 0 0 10px;
  line-height: 1.4;
}
```

### Rating Badge
```css
.rating-badge {
  background-color: #388e3c;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 2px;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}
```

### Price Section
```css
.price-container {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
}

.current-price {
  font-size: 28px;
  font-weight: 700;
  color: #212121;
}

.original-price {
  color: #878787;
  font-size: 16px;
  text-decoration: line-through;
}

.discount {
  color: #388e3c;
  font-size: 16px;
  font-weight: 700;
}
```

### Offers Section
```css
.offers-section {
  margin-bottom: 20px;
}

.offers-section h3 {
  font-weight: 700;
  font-size: 14px;
  color: #212121;
  margin-bottom: 10px;
}

.offer-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13px;
  color: #212121;
  margin-bottom: 8px;
  line-height: 1.5;
}
```

### Delivery Section
```css
.delivery-section {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.pincode-input {
  border: none;
  border-bottom: 1px solid #2874f0;
  padding: 4px 0;
  font-size: 14px;
  color: #212121;
  width: 160px;
  outline: none;
  background: transparent;
}

.delivery-icons {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.delivery-icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  width: 64px;
  text-align: center;
}
```

### Highlights Section
```css
.highlights-section {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.highlights-grid {
  display: flex;
  gap: 32px;
}

.highlights-label {
  color: #878787;
  font-size: 14px;
  font-weight: 500;
  width: 100px;
  flex-shrink: 0;
}

.highlights-list {
  margin: 0;
  padding-left: 16px;
  font-size: 14px;
  color: #212121;
  line-height: 1.7;
}
```

### Specifications Table
```css
.specs-table {
  width: 100%;
  border-collapse: collapse;
}

.specs-table tr {
  border-bottom: 1px solid #f0f0f0;
}

.specs-table td:first-child {
  color: #878787;
  font-size: 14px;
  padding: 12px 0;
  width: 180px;
  vertical-align: top;
}

.specs-table td:last-child {
  color: #212121;
  font-size: 14px;
  padding: 12px 0;
  line-height: 1.6;
}
```

### Reviews Section
```css
.reviews-section {
  margin-bottom: 24px;
}

.review-summary {
  display: flex;
  gap: 32px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.review-score {
  text-align: center;
  min-width: 120px;
}

.review-score-number {
  font-size: 36px;
  font-weight: 700;
  color: #212121;
}

.rating-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}

.rating-bar-fill {
  flex: 1;
  height: 5px;
  background-color: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.rating-bar-fill > div {
  height: 100%;
  border-radius: 3px;
}
```

### Individual Review Card
```css
.review-item {
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.review-rating-badge {
  background-color: #388e3c;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 1px 6px;
  border-radius: 2px;
  display: inline-flex;
  align-items: center;
  gap: 2px;
}

.review-title {
  font-size: 14px;
  font-weight: 600;
  color: #212121;
}

.review-comment {
  font-size: 14px;
  color: #212121;
  line-height: 1.6;
  margin: 0 0 8px;
}

.review-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  font-size: 12px;
  color: #878787;
}
```

---

## 📱 Mobile Sticky Buttons

```css
.pdp-buttons-sticky {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: none;
  background-color: #fff;
  box-shadow: 0 -2px 8px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
  .pdp-buttons-sticky {
    display: flex;
  }
  
  .pdp-buttons-desktop {
    display: none;
  }
}
```

---

## 🖼️ Image URL Patterns

### Flipkart CDN (Rukminim)
- **CDN Domain**: `rukminim2.flixcart.com` or `rukminim1.flixcart.com`
- **URL Pattern**: `https://rukminim2.flixcart.com/image/{width}/{height}/{hash}.{ext}`

### Common Sizes
- **Thumbnail**: `64/64` or `128/128`
- **Medium**: `312/312` or `416/416`
- **Large**: `832/832` (full resolution)

### Example URLs
```
https://rukminim2.flixcart.com/image/832/832/xif0q/mobile/a/b/c/iphone-17-pro-max-apple.jpeg
https://rukminim2.flixcart.com/image/128/128/xif0q/mobile/a/b/c/iphone-17-pro-max-apple.jpeg
```

---

## 🎯 Key Design Differences from Generic E-commerce

### 1. **Vertical Thumbnail Strip**
- Flipkart uses a vertical strip on the left side (not horizontal bottom)
- Thumbnails are 48x48px with 8px gap
- Strip is scrollable with thin scrollbar

### 2. **Two-Tone Orange Buttons**
- "Add to Cart" uses `#ff9f00` (lighter orange)
- "Buy Now" uses `#fb641b` (darker orange)
- Both have subtle shadow: `0 1px 2px rgba(0,0,0,0.2)`

### 3. **Rating Badge Style**
- Always green background (`#388e3c`)
- White star icon inside
- Font size 13px, font weight 700
- 2px padding top/bottom, 8px left/right

### 4. **Offers Layout**
- Green tag icon (`#388e3c`) on the left
- Bold text for offer type (e.g., "Bank Offer:")
- Normal text for offer details
- 8px gap between items

### 5. **Delivery Icons**
- 4 icons in a row: Truck, Return, Shield, Cash
- Each icon: 18x18px, color `#878787`
- Two lines of text below each icon
- Icon item width: 64px

### 6. **Specifications Table**
- No outer borders
- Only bottom border between rows (`#f0f0f0`)
- Left column (labels): 180px wide, gray text (`#878787`)
- Right column (values): auto width, black text (`#212121`)
- 12px padding top/bottom

### 7. **Review Rating Distribution**
- Horizontal bars with different colors per rating
- 5 stars: `#388e3c` (green)
- 4 stars: `#6bc040` (light green)
- 3 stars: `#ffc107` (yellow)
- 2 stars: `#ff9800` (orange)
- 1 star: `#ff6161` (red)

### 8. **Mobile Sticky Footer**
- Fixed at bottom with shadow: `0 -2px 8px rgba(0,0,0,0.1)`
- Two buttons side by side
- Appears only on mobile (`max-width: 768px`)

---

## 📊 Typography

### Font Family
- System font stack: `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`

### Font Sizes
- **Product Title**: 18px, weight 500
- **Price**: 28px, weight 700
- **Section Headers**: 18px, weight 700
- **Subsection Headers**: 14px, weight 700
- **Body Text**: 14px, weight 400
- **Small Text**: 13px, weight 400
- **Tiny Text**: 12px, weight 400

### Line Heights
- **Headings**: 1.4
- **Body Text**: 1.7
- **Compact Text**: 1.5

---

## 🔧 Interactive States

### Button Hover
```css
button:hover {
  opacity: 0.9;
  transition: opacity 0.2s;
}
```

### Thumbnail Hover
```css
.thumb-button:hover {
  border-color: #2874f0;
}
```

### Link Hover
```css
a:hover {
  text-decoration: underline;
}
```

### Input Focus
```css
input:focus {
  outline: none;
  border-bottom-color: #2874f0;
}
```

---

## ✅ Checklist for Pixel-Perfect Clone

- [ ] Use exact color codes (especially `#2874f0`, `#ff9f00`, `#fb641b`)
- [ ] Vertical thumbnail strip (48x48px, 8px gap)
- [ ] Main image padding: 32px
- [ ] Two-column grid: 480px + 1fr
- [ ] Product title: 18px, weight 500
- [ ] Price: 28px, weight 700
- [ ] Rating badge: green background, white text, star icon
- [ ] Offers with green tag icon
- [ ] Delivery icons: 4 in a row, 64px width each
- [ ] Specifications table: no outer borders, gray labels, 180px width
- [ ] Reviews: rating distribution bars with color coding
- [ ] Mobile sticky footer: fixed bottom, shadow on top
- [ ] All borders: 1px solid #e0e0e0 or #f0f0f0
- [ ] All shadows: subtle 0 1px 2px rgba(0,0,0,0.2)
- [ ] All border-radius: 2px (not rounded)

---

## 🎬 Script Usage

Use the `scripts/extract-flipkart-data.js` script to extract:
1. All product images (rukminim CDN URLs)
2. Product title, price, rating
3. All offers text
4. All highlights
5. All specifications (key-value pairs)
6. First 5 reviews with ratings, authors, comments

The script automatically converts thumbnail URLs to high-resolution (832x832) versions.

---

**Last Updated**: February 2026
