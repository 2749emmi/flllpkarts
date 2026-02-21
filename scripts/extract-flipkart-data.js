/**
 * Flipkart Product Data Extraction Script
 * 
 * HOW TO USE:
 * 1. Open the Flipkart product page in your browser
 * 2. Open Developer Console (F12 or Ctrl+Shift+J)
 * 3. Copy and paste this entire script
 * 4. Press Enter to run
 * 5. The script will extract all data and copy it to your clipboard
 */

(function extractFlipkartProductData() {
  console.log('🔍 Starting Flipkart product data extraction...');
  
  const data = {
    images: [],
    title: '',
    price: 0,
    originalPrice: 0,
    discount: 0,
    rating: 0,
    ratingCount: '',
    reviewCount: '',
    offers: [],
    highlights: [],
    specifications: {},
    reviews: [],
    brand: '',
    seller: '',
    description: ''
  };

  // ============= EXTRACT IMAGES =============
  console.log('📸 Extracting product images...');
  
  // Method 1: Look for thumbnail images (vertical strip on left)
  const thumbnails = document.querySelectorAll('._2E3Zt8, ._2E3Zt8 img, [class*="thumb"] img, [class*="Thumbnail"] img');
  thumbnails.forEach(img => {
    let src = img.src || img.getAttribute('src') || img.getAttribute('data-src');
    if (src && src.includes('rukminim')) {
      // Convert thumbnail to high-res (replace /128/ or /64/ with /832/ for full size)
      src = src.replace(/\/\d+\/\d+\//, '/832/832/');
      if (!data.images.includes(src)) {
        data.images.push(src);
      }
    }
  });

  // Method 2: Look for main product image
  const mainImage = document.querySelector('._2amPTt._3-z_Qk img, ._3kidJX img, [class*="MainImage"] img');
  if (mainImage) {
    let src = mainImage.src || mainImage.getAttribute('src');
    if (src && src.includes('rukminim')) {
      src = src.replace(/\/\d+\/\d+\//, '/832/832/');
      if (!data.images.includes(src)) {
        data.images.unshift(src); // Add to beginning
      }
    }
  }

  // Method 3: Search all img tags for rukminim URLs
  document.querySelectorAll('img').forEach(img => {
    const src = img.src || img.getAttribute('src') || img.getAttribute('data-src');
    if (src && src.includes('rukminim') && !src.includes('icon') && !src.includes('logo')) {
      const highResSrc = src.replace(/\/\d+\/\d+\//, '/832/832/');
      if (!data.images.includes(highResSrc)) {
        data.images.push(highResSrc);
      }
    }
  });

  console.log(`✅ Found ${data.images.length} images`);

  // ============= EXTRACT TITLE =============
  const titleSelectors = [
    '.VU-ZEz', // Common title class
    'h1.VU-ZEz',
    'span.VU-ZEz',
    '[class*="title"]',
    '.B_NuCI',
    'h1'
  ];
  
  for (const selector of titleSelectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent.trim()) {
      data.title = element.textContent.trim();
      break;
    }
  }
  console.log(`📝 Title: ${data.title}`);

  // ============= EXTRACT PRICES =============
  const priceSelectors = [
    '._30jeq3._16Jk6d', // Current price
    '._3I9_wc._27UcVY', // Current price
    '[class*="price"]'
  ];

  for (const selector of priceSelectors) {
    const element = document.querySelector(selector);
    if (element) {
      const priceText = element.textContent.replace(/[₹,]/g, '').trim();
      const price = parseInt(priceText);
      if (!isNaN(price) && price > 0) {
        data.price = price;
        break;
      }
    }
  }

  // Original price
  const originalPriceEl = document.querySelector('._3I9_wc._2p6lqe, [class*="original"]');
  if (originalPriceEl) {
    const priceText = originalPriceEl.textContent.replace(/[₹,]/g, '').trim();
    data.originalPrice = parseInt(priceText);
  }

  // Discount
  const discountEl = document.querySelector('._3Ay6Sb._31Dcoz, [class*="discount"]');
  if (discountEl) {
    const discountText = discountEl.textContent.replace(/[%off]/g, '').trim();
    data.discount = parseInt(discountText);
  }

  console.log(`💰 Price: ₹${data.price} (Original: ₹${data.originalPrice}, Discount: ${data.discount}%)`);

  // ============= EXTRACT RATING & REVIEWS =============
  const ratingEl = document.querySelector('._3LWZlK, [class*="rating"]');
  if (ratingEl) {
    data.rating = parseFloat(ratingEl.textContent.trim());
  }

  const ratingCountEl = document.querySelector('._2_R_DZ, [class*="ratingCount"]');
  if (ratingCountEl) {
    const text = ratingCountEl.textContent.trim();
    const match = text.match(/([\d,]+)\s*Ratings?\s*&?\s*([\d,]+)?\s*Reviews?/i);
    if (match) {
      data.ratingCount = match[1];
      data.reviewCount = match[2] || match[1];
    }
  }

  console.log(`⭐ Rating: ${data.rating} (${data.ratingCount} ratings, ${data.reviewCount} reviews)`);

  // ============= EXTRACT BRAND & SELLER =============
  const brandSelectors = [
    '._2cLu-l a',
    '[href*="/brand/"]',
    '.subtitle span'
  ];

  for (const selector of brandSelectors) {
    const element = document.querySelector(selector);
    if (element && element.textContent.trim()) {
      data.brand = element.textContent.trim();
      break;
    }
  }

  const sellerEl = document.querySelector('._2Ndd-A, [class*="seller"]');
  if (sellerEl) {
    data.seller = sellerEl.textContent.trim();
  }

  // ============= EXTRACT OFFERS =============
  console.log('🎁 Extracting offers...');
  const offerElements = document.querySelectorAll('._16eBzU li, ._3P8qs3 li, [class*="offer"] li');
  offerElements.forEach(el => {
    const offerText = el.textContent.trim();
    if (offerText && offerText.length > 10) {
      data.offers.push(offerText);
    }
  });
  console.log(`✅ Found ${data.offers.length} offers`);

  // ============= EXTRACT HIGHLIGHTS =============
  console.log('✨ Extracting highlights...');
  const highlightElements = document.querySelectorAll('._2418kt li, ._1CrVsY li, [class*="highlight"] li');
  highlightElements.forEach(el => {
    const highlight = el.textContent.trim();
    if (highlight) {
      data.highlights.push(highlight);
    }
  });
  console.log(`✅ Found ${data.highlights.length} highlights`);

  // ============= EXTRACT SPECIFICATIONS =============
  console.log('📋 Extracting specifications...');
  const specRows = document.querySelectorAll('._3ntsLP table tr, ._1s_Smc table tr, [class*="spec"] table tr');
  specRows.forEach(row => {
    const cells = row.querySelectorAll('td, th');
    if (cells.length >= 2) {
      const key = cells[0].textContent.trim();
      const value = cells[1].textContent.trim();
      if (key && value) {
        data.specifications[key] = value;
      }
    }
  });
  console.log(`✅ Found ${Object.keys(data.specifications).length} specifications`);

  // ============= EXTRACT DESCRIPTION =============
  const descriptionEl = document.querySelector('._3K90Ma, [class*="description"]');
  if (descriptionEl) {
    data.description = descriptionEl.textContent.trim();
  }

  // ============= EXTRACT REVIEWS =============
  console.log('💬 Extracting reviews...');
  const reviewElements = document.querySelectorAll('._27M-vq, [class*="review"]');
  let reviewCount = 0;
  
  reviewElements.forEach(reviewEl => {
    if (reviewCount >= 5) return; // Limit to 5 reviews
    
    const review = {
      author: '',
      rating: 0,
      title: '',
      comment: '',
      date: '',
      verifiedPurchase: false,
      likes: 0,
      dislikes: 0
    };

    // Author
    const authorEl = reviewEl.querySelector('._2V5EHH, ._2NsDsF, [class*="author"]');
    if (authorEl) review.author = authorEl.textContent.trim();

    // Rating
    const ratingEl = reviewEl.querySelector('._3LWZlK, [class*="rating"]');
    if (ratingEl) review.rating = parseFloat(ratingEl.textContent.trim());

    // Title
    const titleEl = reviewEl.querySelector('._2-N8zT, [class*="reviewTitle"]');
    if (titleEl) review.title = titleEl.textContent.trim();

    // Comment
    const commentEl = reviewEl.querySelector('._6K-7Co, t-ZTKy, [class*="reviewText"]');
    if (commentEl) review.comment = commentEl.textContent.trim();

    // Date
    const dateEl = reviewEl.querySelector('._2mcZGG, [class*="date"]');
    if (dateEl) review.date = dateEl.textContent.trim();

    // Verified Purchase
    const verifiedEl = reviewEl.querySelector('[class*="certified"], [class*="verified"]');
    review.verifiedPurchase = !!verifiedEl;

    // Likes/Dislikes
    const likeEl = reviewEl.querySelector('[class*="like"] span');
    if (likeEl) review.likes = parseInt(likeEl.textContent.trim()) || 0;

    const dislikeEl = reviewEl.querySelector('[class*="dislike"] span');
    if (dislikeEl) review.dislikes = parseInt(dislikeEl.textContent.trim()) || 0;

    if (review.author && review.comment) {
      data.reviews.push(review);
      reviewCount++;
    }
  });
  console.log(`✅ Found ${data.reviews.length} reviews`);

  // ============= OUTPUT RESULTS =============
  console.log('\n🎉 Extraction complete!');
  console.log('\n📊 Summary:');
  console.log(`- Images: ${data.images.length}`);
  console.log(`- Offers: ${data.offers.length}`);
  console.log(`- Highlights: ${data.highlights.length}`);
  console.log(`- Specifications: ${Object.keys(data.specifications).length}`);
  console.log(`- Reviews: ${data.reviews.length}`);
  
  console.log('\n📋 Full data object:');
  console.log(JSON.stringify(data, null, 2));

  // Copy to clipboard
  const jsonString = JSON.stringify(data, null, 2);
  navigator.clipboard.writeText(jsonString).then(() => {
    console.log('\n✅ Data copied to clipboard!');
  }).catch(() => {
    console.log('\n⚠️ Could not copy to clipboard automatically. Copy from below:');
    console.log(jsonString);
  });

  return data;
})();
