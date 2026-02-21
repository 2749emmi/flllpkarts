'use client';
import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Tag, Truck, Shield, RotateCcw, ShoppingCart, Zap, Heart, Share2, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp, MapPin } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/data/products';

function RatingBar({ stars, count, total }: { stars: number; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  const colors: Record<number, string> = { 5: '#388e3c', 4: '#6bc040', 3: '#ffc107', 2: '#ff9800', 1: '#ff6161' };
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
      <span style={{ width: '18px', textAlign: 'right', color: '#878787' }}>{stars}</span>
      <Star style={{ width: '11px', height: '11px', color: '#878787' }} />
      <div style={{ flex: 1, height: '5px', backgroundColor: '#f0f0f0', borderRadius: '3px', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', backgroundColor: colors[stars] || '#388e3c', borderRadius: '3px' }} />
      </div>
      <span style={{ width: '48px', color: '#878787', fontSize: '12px' }}>{count.toLocaleString('en-IN')}</span>
    </div>
  );
}

export default function ProductPageClient({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const [showAllOffers, setShowAllOffers] = useState(false);
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [pincode, setPincode] = useState('');
  const [pincodeChecked, setPincodeChecked] = useState(false);
  const [goToCart, setGoToCart] = useState(false);

  const images = product.images?.length ? product.images : [product.image];
  const specs = product.specs || {};
  const reviews = product.reviews || [];
  const specEntries = Object.entries(specs);

  const totalReviewCount = reviews.length;
  const ratingDistribution = [5, 4, 3, 2, 1].map(s => ({
    stars: s,
    count: reviews.filter(r => r.rating === s).length,
  }));

  const handleAddToCart = useCallback(() => {
    addToCart(product);
    setAdded(true);
    setGoToCart(true);
  }, [addToCart, product]);

  const handleBuyNow = useCallback(() => {
    addToCart(product);
    window.location.href = '/checkout';
  }, [addToCart, product]);

  const handlePincodeCheck = useCallback(() => {
    if (pincode.length >= 1) setPincodeChecked(true);
  }, [pincode]);

  const visibleOffers = showAllOffers ? product.offers : product.offers.slice(0, 4);

  return (
    <div style={{ backgroundColor: '#f1f3f6', minHeight: '100vh' }}>
      <div className="pdp-container">
        {/* Breadcrumb */}
        <div style={{ fontSize: '12px', color: '#878787', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px', padding: '0 12px', flexWrap: 'wrap' }}>
          <Link href="/" style={{ color: '#878787', textDecoration: 'none' }}>Home</Link>
          <span>&gt;</span>
          <Link href={`/category/${product.category}`} style={{ color: '#878787', textDecoration: 'none', textTransform: 'capitalize' }}>{product.category}</Link>
          <span>&gt;</span>
          <span style={{ color: '#212121' }}>{product.title}</span>
        </div>

        <div className="pdp-layout" style={{ backgroundColor: '#fff', boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)' }}>
          {/* ========= LEFT: IMAGE GALLERY ========= */}
          <div className="pdp-left">
            <div className="pdp-gallery">
              {/* Thumbnails */}
              <div className="pdp-thumbs hide-scrollbar">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onMouseEnter={() => setSelectedImage(i)}
                    onClick={() => setSelectedImage(i)}
                    style={{
                      width: '48px', height: '48px', flexShrink: 0,
                      border: selectedImage === i ? '2px solid #2874f0' : '1px solid #e0e0e0',
                      borderRadius: '2px', padding: '2px', backgroundColor: '#fff',
                      cursor: 'pointer', position: 'relative', overflow: 'hidden',
                    }}
                  >
                    <Image src={img} alt={`View ${i + 1}`} fill style={{ objectFit: 'contain', padding: '2px' }} sizes="48px" />
                  </button>
                ))}
              </div>

              {/* Main Image */}
              <div className="pdp-main-image" style={{ position: 'relative' }}>
                {/* Wishlist + Share */}
                <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10, display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setWishlisted(!wishlisted)}
                    style={{
                      width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fff',
                      boxShadow: '0 1px 4px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', border: 'none',
                    }}
                  >
                    <Heart style={{ width: '18px', height: '18px', color: wishlisted ? '#ff4081' : '#878787' }} fill={wishlisted ? '#ff4081' : 'none'} />
                  </button>
                  <button style={{
                    width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fff',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', border: 'none',
                  }}>
                    <Share2 style={{ width: '16px', height: '16px', color: '#878787' }} />
                  </button>
                </div>

                {/* BBD Badge */}
                {product.discount >= 50 && (
                  <div style={{
                    position: 'absolute', top: '12px', left: '12px', zIndex: 10,
                    backgroundColor: '#c31432', color: '#fff', fontSize: '11px', fontWeight: 800,
                    padding: '4px 10px', borderRadius: '2px',
                  }}>
                    🔥 BIG BILLION DAYS DEAL — {product.discount}% OFF
                  </div>
                )}

                <Image
                  src={images[selectedImage]}
                  alt={product.title}
                  fill
                  style={{ objectFit: 'contain', padding: '32px' }}
                  sizes="(max-width: 768px) 100vw, 480px"
                  priority
                />
              </div>
            </div>

            {/* Desktop Buttons */}
            <div className="pdp-buttons-desktop">
              {goToCart ? (
                <Link href="/cart" style={{
                  flex: 1, backgroundColor: '#ff9f00', color: '#fff', padding: '16px',
                  fontWeight: 700, fontSize: '16px', borderRadius: '2px', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  textTransform: 'uppercase', textDecoration: 'none', boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                }}>
                  <ShoppingCart style={{ width: '18px', height: '18px' }} fill="white" />
                  GO TO CART
                </Link>
              ) : (
                <button onClick={handleAddToCart} style={{
                  flex: 1, backgroundColor: '#ff9f00', color: '#fff', padding: '16px',
                  fontWeight: 700, fontSize: '16px', borderRadius: '2px', border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  textTransform: 'uppercase', fontFamily: 'inherit', boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                }}>
                  <ShoppingCart style={{ width: '18px', height: '18px' }} fill="white" />
                  ADD TO CART
                </button>
              )}
              <button onClick={handleBuyNow} style={{
                flex: 1, backgroundColor: '#fb641b', color: '#fff', padding: '16px',
                fontWeight: 700, fontSize: '16px', borderRadius: '2px', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                textTransform: 'uppercase', fontFamily: 'inherit', boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
              }}>
                <Zap style={{ width: '18px', height: '18px' }} fill="white" /> BUY NOW
              </button>
            </div>
          </div>

          {/* ========= RIGHT: PRODUCT DETAILS ========= */}
          <div className="pdp-right">
            {/* Title */}
            <h1 style={{ fontSize: '18px', fontWeight: 500, color: '#212121', margin: '0 0 10px', lineHeight: 1.4 }}>
              {product.title}
            </h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <span style={{
                backgroundColor: '#388e3c', color: '#fff', fontSize: '13px', fontWeight: 700,
                padding: '2px 8px', borderRadius: '2px', display: 'inline-flex', alignItems: 'center', gap: '3px',
              }}>
                {product.rating} <Star style={{ width: '12px', height: '12px' }} fill="white" />
              </span>
              <span style={{ color: '#878787', fontSize: '14px', fontWeight: 500 }}>
                {product.ratingCount} Ratings & {product.reviewCount} Reviews
              </span>
              {product.brand && (
                <Image src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" alt="Assured" width={77} height={18} style={{ objectFit: 'contain' }} />
              )}
            </div>

            {/* Special Price Tag */}
            <div style={{ marginBottom: '6px' }}>
              <span style={{ color: '#388e3c', fontSize: '13px', fontWeight: 700 }}>Big Billion Days Special Price</span>
            </div>

            {/* Price */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '28px', fontWeight: 700, color: '#212121' }}>
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span style={{ color: '#878787', fontSize: '16px', textDecoration: 'line-through' }}>
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
              <span style={{ color: '#388e3c', fontSize: '16px', fontWeight: 700 }}>
                {product.discount}% off
              </span>
            </div>

            {/* Offers */}
            {product.offers.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontWeight: 700, fontSize: '14px', color: '#212121', marginBottom: '10px' }}>Available offers</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {visibleOffers.map((offer, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#212121', marginBottom: '8px', lineHeight: 1.5 }}>
                      <Tag style={{ width: '14px', height: '14px', color: '#388e3c', marginTop: '3px', flexShrink: 0 }} />
                      <span dangerouslySetInnerHTML={{ __html: offer.replace(/^([^:]+:)/, '<strong>$1</strong>') }} />
                    </li>
                  ))}
                </ul>
                {product.offers.length > 4 && (
                  <button onClick={() => setShowAllOffers(!showAllOffers)} style={{
                    color: '#2874f0', fontSize: '13px', fontWeight: 600, background: 'none', border: 'none',
                    cursor: 'pointer', padding: '4px 0', display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'inherit',
                  }}>
                    {showAllOffers ? 'Show less' : `View ${product.offers.length - 4} more offers`}
                    {showAllOffers ? <ChevronUp style={{ width: '14px', height: '14px' }} /> : <ChevronDown style={{ width: '14px', height: '14px' }} />}
                  </button>
                )}
              </div>
            )}

            {/* Delivery */}
            <div style={{ marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <MapPin style={{ width: '18px', height: '18px', color: '#878787' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="text"
                    value={pincode}
                    onChange={e => { setPincode(e.target.value.replace(/[^0-9]/g, '').slice(0, 6)); setPincodeChecked(false); }}
                    onKeyDown={e => { if (e.key === 'Enter') handlePincodeCheck(); }}
                    placeholder="Enter Delivery Pincode"
                    maxLength={6}
                    style={{
                      border: 'none', borderBottom: `1px solid ${pincodeChecked ? '#388e3c' : '#2874f0'}`, padding: '4px 0', fontSize: '14px',
                      color: '#212121', width: '160px', fontFamily: 'inherit', outline: 'none', background: 'transparent',
                    }}
                  />
                  <button onClick={handlePincodeCheck} style={{ color: '#2874f0', fontSize: '14px', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}>
                    {pincodeChecked ? 'Change' : 'Check'}
                  </button>
                </div>
              </div>
              {pincodeChecked && (
                <div style={{ marginBottom: '12px', padding: '8px 12px', backgroundColor: '#f1f8f1', borderRadius: '4px', fontSize: '13px', color: '#388e3c', fontWeight: 500 }}>
                  Delivery to <strong>{pincode}</strong> — <span style={{ color: '#212121' }}>Free delivery by <strong>{new Date(Date.now() + 2 * 86400000).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}</strong></span>
                  {product.price > 500 && <span style={{ color: '#878787', fontWeight: 400 }}> | Order in the next 2h 30m</span>}
                </div>
              )}
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                {[
                  { icon: <Truck style={{ width: '18px', height: '18px', color: '#878787' }} />, label: 'Free Delivery', sub: 'By Tomorrow' },
                  { icon: <RotateCcw style={{ width: '18px', height: '18px', color: '#878787' }} />, label: '7 Day Return', sub: 'Policy' },
                  { icon: <Shield style={{ width: '18px', height: '18px', color: '#878787' }} />, label: 'Warranty', sub: 'Available' },
                  { icon: <span style={{ fontSize: '16px', fontWeight: 700, color: '#878787' }}>₹</span>, label: 'Cash on', sub: 'Delivery' },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', width: '64px', textAlign: 'center' }}>
                    {item.icon}
                    <span style={{ fontSize: '11px', color: '#212121', fontWeight: 500 }}>{item.label}</span>
                    <span style={{ fontSize: '10px', color: '#878787' }}>{item.sub}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights */}
            <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', gap: '32px' }}>
                <span style={{ color: '#878787', fontSize: '14px', fontWeight: 500, width: '100px', flexShrink: 0 }}>Highlights</span>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '14px', color: '#212121', lineHeight: 1.7 }}>
                  {product.highlights.map((h, i) => (
                    <li key={i} style={{ marginBottom: '4px' }}>{h}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Seller */}
            {product.seller && (
              <div style={{ marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ display: 'flex', gap: '32px' }}>
                  <span style={{ color: '#878787', fontSize: '14px', fontWeight: 500, width: '100px', flexShrink: 0 }}>Seller</span>
                  <div>
                    <span style={{ color: '#2874f0', fontSize: '14px', fontWeight: 500 }}>{product.seller}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      <span style={{
                        backgroundColor: '#388e3c', color: '#fff', fontSize: '11px', fontWeight: 700,
                        padding: '1px 5px', borderRadius: '2px', display: 'inline-flex', alignItems: 'center', gap: '2px',
                      }}>
                        4.4 <Star style={{ width: '9px', height: '9px' }} fill="white" />
                      </span>
                      <span style={{ color: '#878787', fontSize: '12px' }}>7 Day Replacement Policy</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Description */}
            <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#212121', marginBottom: '12px' }}>Product Description</h2>
              <p style={{ fontSize: '14px', color: '#212121', lineHeight: 1.8 }}>{product.description}</p>
            </div>

            {/* Specifications */}
            {specEntries.length > 0 && (
              <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #f0f0f0' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#212121', marginBottom: '16px' }}>Specifications</h2>
                <table className="pdp-specs-table">
                  <tbody>
                    {(showAllSpecs ? specEntries : specEntries.slice(0, 8)).map(([key, val]) => (
                      <tr key={key}>
                        <td>{key}</td>
                        <td>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {specEntries.length > 8 && (
                  <button onClick={() => setShowAllSpecs(!showAllSpecs)} style={{
                    color: '#2874f0', fontSize: '13px', fontWeight: 600, background: 'none', border: 'none',
                    cursor: 'pointer', padding: '8px 0', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    {showAllSpecs ? 'Read less' : 'Read all specifications'}
                    {showAllSpecs ? <ChevronUp style={{ width: '14px', height: '14px' }} /> : <ChevronDown style={{ width: '14px', height: '14px' }} />}
                  </button>
                )}
              </div>
            )}

            {/* Ratings & Reviews */}
            {reviews.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#212121', margin: 0 }}>Ratings & Reviews</h2>
                  <button style={{
                    backgroundColor: '#fff', color: '#212121', border: '1px solid #e0e0e0', padding: '8px 20px',
                    borderRadius: '2px', fontSize: '14px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                  }}>
                    Rate Product
                  </button>
                </div>

                {/* Rating Summary */}
                <div style={{ display: 'flex', gap: '32px', marginBottom: '24px', flexWrap: 'wrap' }}>
                  {/* Big rating number */}
                  <div style={{ textAlign: 'center', minWidth: '120px' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px' }}>
                      <span style={{ fontSize: '36px', fontWeight: 700, color: '#212121' }}>{product.rating}</span>
                      <Star style={{ width: '20px', height: '20px', color: '#388e3c', marginBottom: '4px' }} fill="#388e3c" />
                    </div>
                    <p style={{ fontSize: '13px', color: '#878787', margin: '4px 0' }}>
                      {product.ratingCount} Ratings &
                    </p>
                    <p style={{ fontSize: '13px', color: '#878787', margin: 0 }}>
                      {product.reviewCount} Reviews
                    </p>
                  </div>

                  {/* Distribution bars */}
                  <div style={{ flex: 1, minWidth: '200px', display: 'flex', flexDirection: 'column', gap: '4px', justifyContent: 'center' }}>
                    {ratingDistribution.map(d => (
                      <RatingBar key={d.stars} stars={d.stars} count={d.count} total={totalReviewCount} />
                    ))}
                  </div>
                </div>

                {/* Individual reviews */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {reviews.map((review, i) => (
                    <div key={i} style={{ padding: '16px 0', borderTop: '1px solid #f0f0f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                        <span style={{
                          backgroundColor: review.rating >= 4 ? '#388e3c' : review.rating >= 3 ? '#ffc107' : '#ff6161',
                          color: '#fff', fontSize: '12px', fontWeight: 700, padding: '1px 6px', borderRadius: '2px',
                          display: 'inline-flex', alignItems: 'center', gap: '2px',
                        }}>
                          {review.rating} <Star style={{ width: '10px', height: '10px' }} fill="white" />
                        </span>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#212121' }}>{review.title}</span>
                      </div>
                      <p style={{ fontSize: '14px', color: '#212121', lineHeight: 1.6, margin: '0 0 8px' }}>{review.comment}</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: '#878787' }}>
                        <span style={{ fontWeight: 500 }}>{review.author}</span>
                        {review.verifiedPurchase && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Shield style={{ width: '11px', height: '11px' }} /> Certified Buyer
                          </span>
                        )}
                        <span>{review.date}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto' }}>
                          <button style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#878787', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit' }}>
                            <ThumbsUp style={{ width: '13px', height: '13px' }} /> {review.likes || 0}
                          </button>
                          <button style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#878787', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontFamily: 'inherit' }}>
                            <ThumbsDown style={{ width: '13px', height: '13px' }} /> {review.dislikes || 0}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sticky Buttons */}
      <div className="pdp-buttons-sticky">
        {goToCart ? (
          <Link href="/cart" style={{
            flex: 1, backgroundColor: '#ff9f00', color: '#fff', padding: '14px',
            fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            textTransform: 'uppercase', textDecoration: 'none',
          }}>
            <ShoppingCart style={{ width: '16px', height: '16px' }} fill="white" />
            GO TO CART
          </Link>
        ) : (
          <button onClick={handleAddToCart} style={{
            flex: 1, backgroundColor: '#ff9f00', color: '#fff', padding: '14px',
            fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            textTransform: 'uppercase', fontFamily: 'inherit',
          }}>
            <ShoppingCart style={{ width: '16px', height: '16px' }} fill="white" />
            ADD TO CART
          </button>
        )}
        <button onClick={handleBuyNow} style={{
          flex: 1, backgroundColor: '#fb641b', color: '#fff', padding: '14px',
          fontWeight: 700, fontSize: '15px', border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          textTransform: 'uppercase', fontFamily: 'inherit',
        }}>
          <Zap style={{ width: '16px', height: '16px' }} fill="white" /> BUY NOW
        </button>
      </div>
    </div>
  );
}
