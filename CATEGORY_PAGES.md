# Category Pages Guide

## New Exclusive Category Pages

I've created dedicated category pages for specific product types, similar to Flipkart's `/q/` routes.

### Available Categories

1. **Earbuds** - `/q/earbud`
   - Shows all earbuds, AirPods, TWS, wireless earphones
   - Keywords: earbud, airpod, wireless earphone, tws, bluetooth earphone

2. **Laptops** - `/q/laptop`
   - Shows all laptops, notebooks, MacBooks, Chromebooks
   - Keywords: laptop, notebook, macbook, chromebook

3. **Phones** - `/q/phone`
   - Shows all smartphones and mobile phones
   - Keywords: iphone, samsung, phone, smartphone, mobile

### Features

- **Smart Filtering**: Products are filtered by keywords in their titles
- **Price Range Filter**: Filter products by price ranges (₹0-5K, ₹5K-10K, etc.)
- **Sorting Options**: 
  - Popularity (default)
  - Price: Low to High
  - Price: High to Low
  - Discount
  - Customer Rating
- **Discount Filters**: Filter by discount percentage (80%+, 70%+, etc.)
- **Responsive Design**: Works on mobile and desktop
- **Product Cards**: Show image, title, rating, highlights, and pricing

### Navigation

The category bar at the top now includes quick links to:
- Mobiles → `/q/phone`
- Laptops → `/q/laptop`
- Earbuds → `/q/earbud`

### How to Add More Categories

Edit `src/app/q/[category]/page.tsx` and add to the `categoryConfig` object:

```typescript
const categoryConfig: Record<string, { title: string; keywords: string[] }> = {
  earbud: { title: 'Earbuds', keywords: ['earbud', 'airpod', 'wireless earphone', 'tws'] },
  laptop: { title: 'Laptops', keywords: ['laptop', 'notebook', 'macbook'] },
  phone: { title: 'Smartphones', keywords: ['iphone', 'samsung', 'phone', 'smartphone'] },
  // Add more here...
};
```

Then add the link to `src/components/CategoryBar.tsx`.
