'use client';

import { useParams } from 'next/navigation';
import { products } from '@/data/products';
import Link from 'next/link';
import Image from 'next/image';
import { getProductUrl } from '@/utils/url';
import { Star, SlidersHorizontal, ArrowUpDown, Heart } from 'lucide-react';
import { useState } from 'react';
import { proxyImage } from '@/lib/imageProxy';

const categoryConfig: Record<string, { title: string; keywords: string[]; category?: string }> = {
  // Keyword-based categories
  earbud: { title: 'Earbuds', keywords: ['earbud', 'airpod', 'wireless earphone', 'tws', 'bluetooth earphone'] },
  laptop: { title: 'Laptops', keywords: ['laptop', 'notebook', 'macbook', 'chromebook'] },
  phone: { title: 'Smartphones', keywords: ['iphone', 'samsung', 'phone', 'smartphone', 'mobile'] },

  // Category-based (exact match)
  mobiles: { title: 'Mobiles', keywords: [], category: 'mobiles' },
  electronics: { title: 'Electronics', keywords: [], category: 'electronics' },
  fashion: { title: 'Fashion', keywords: [], category: 'fashion' },
  home: { title: 'Home & Furniture', keywords: [], category: 'home' },
  appliances: { title: 'Appliances', keywords: [], category: 'appliances' },
  beauty: { title: 'Beauty & Personal Care', keywords: [], category: 'beauty' },
  grocery: { title: 'Grocery', keywords: [], category: 'grocery' },
};

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;
  const config = categoryConfig[category] || { title: 'Products', keywords: [] };

  const [sortBy, setSortBy] = useState('popularity');
  const [showSortModal, setShowSortModal] = useState(false);

  // Filter products by keywords or category
  const filteredProducts = products.filter(p => {
    // If config has a category field, match by exact category
    if (config.category) {
      return p.category === config.category;
    }
    // Otherwise, match by keywords in title
    const titleLower = p.title.toLowerCase();
    return config.keywords.some(keyword => titleLower.includes(keyword));
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'discount': return b.discount - a.discount;
      case 'rating': return b.rating - a.rating;
      default: return 0;
    }
  });

  const sortOptions = [
    { value: 'popularity', label: 'Popularity' },
    { value: 'price-low', label: 'Price -- Low to High' },
    { value: 'price-high', label: 'Price -- High to Low' },
    { value: 'discount', label: 'Discount -- High to Low' },
    { value: 'rating', label: 'Customer Rating' },
  ];

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .cat-products-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          .cat-product-card {
            background-color: #fff;
            border-radius: 0;
            overflow: hidden;
            box-shadow: 0 1px 2px rgba(0,0,0,0.08);
            transition: box-shadow 0.2s;
            height: 100%;
            display: flex;
            flex-direction: column;
          }
          .cat-desktop-header {
            display: none;
          }
          .cat-mobile-header,
          .cat-mobile-sort-filter {
            display: block;
          }
          @media (min-width: 769px) {
            .cat-products-grid {
              grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
              gap: 12px;
            }
            .cat-product-card {
              border-radius: 4px;
            }
            .cat-product-card:hover {
              box-shadow: 0 2px 8px rgba(0,0,0,0.12);
            }
            .cat-desktop-header {
              display: block;
            }
            .cat-mobile-header,
            .cat-mobile-sort-filter {
              display: none;
            }
          }
          @media (min-width: 769px) and (max-width: 1024px) {
            .cat-products-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }
        `
      }} />

      <div style={{ backgroundColor: '#f1f3f6', minHeight: '100vh', paddingBottom: '20px' }}>
        {/* Header - Desktop */}
        <div className="cat-desktop-header" style={{ backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0', marginBottom: '12px' }}>
          <div style={{ maxWidth: '1248px', margin: '0 auto', padding: '16px 20px' }}>
            {/* Breadcrumb */}
            <div style={{ fontSize: '12px', color: '#878787', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Link href="/" style={{ color: '#878787', textDecoration: 'none' }}>Home</Link>
              <span>&gt;</span>
              <span style={{ color: '#212121', textTransform: 'capitalize' }}>{config.title}</span>
            </div>

            {/* Title */}
            <h1 style={{ fontSize: '18px', fontWeight: 500, color: '#212121', margin: 0 }}>
              {config.title} <span style={{ color: '#878787', fontSize: '14px' }}>({sortedProducts.length} products)</span>
            </h1>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="cat-mobile-header" style={{ backgroundColor: '#fff', padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link href="/" style={{ fontSize: '24px', textDecoration: 'none', color: '#212121' }}>←</Link>
            <span style={{ fontSize: '16px', fontWeight: 500, color: '#212121' }}>{category}</span>
          </div>
        </div>

        {/* Sort & Filter Bar - Mobile */}
        <div className="cat-mobile-sort-filter" style={{
          backgroundColor: '#fff', borderBottom: '1px solid #e0e0e0',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <div style={{ display: 'flex' }}>
            <button
              onClick={() => setShowSortModal(true)}
              style={{
                flex: 1, padding: '14px', border: 'none', borderRight: '1px solid #e0e0e0',
                backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '6px', fontSize: '14px', fontWeight: 500, color: '#212121', cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <ArrowUpDown size={16} /> Sort
            </button>
            <button
              style={{
                flex: 1, padding: '14px', border: 'none', backgroundColor: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: '6px', fontSize: '14px', fontWeight: 500, color: '#212121', cursor: 'pointer',
                fontFamily: 'inherit',
              }}
            >
              <SlidersHorizontal size={16} /> Filter
            </button>
          </div>
        </div>

        {/* Sort Modal - Mobile */}
        {showSortModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)',
            zIndex: 1000, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          }} onClick={() => setShowSortModal(false)}>
            <div style={{ backgroundColor: '#fff', borderRadius: '12px 12px 0 0', padding: '20px' }} onClick={e => e.stopPropagation()}>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#212121', marginBottom: '16px' }}>Sort By</h3>
              {sortOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setSortBy(opt.value); setShowSortModal(false); }}
                  style={{
                    width: '100%', padding: '14px', border: 'none', backgroundColor: sortBy === opt.value ? '#f0f7ff' : '#fff',
                    textAlign: 'left', fontSize: '14px', color: sortBy === opt.value ? '#2874f0' : '#212121',
                    fontWeight: sortBy === opt.value ? 600 : 400, cursor: 'pointer', borderRadius: '4px',
                    marginBottom: '4px', fontFamily: 'inherit',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div style={{ maxWidth: '1248px', margin: '0 auto', padding: '12px', display: 'flex', gap: '12px' }}>
          {/* Filters Sidebar - Desktop Only */}
          <div className="cat-desktop-header" style={{ width: '260px', flexShrink: 0 }}>
            <div style={{ backgroundColor: '#fff', borderRadius: '2px', boxShadow: '0 1px 1px 0 rgba(0,0,0,.08)' }}>
              <div style={{ padding: '16px', borderBottom: '1px solid #e0e0e0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#212121', margin: 0 }}>Filters</h3>
              </div>

              {/* Price Range */}
              <div style={{ padding: '16px', borderBottom: '1px solid #e0e0e0' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#212121', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Price Range</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { label: 'Under ₹1,000', min: 0, max: 1000 },
                    { label: '₹1,000 - ₹5,000', min: 1000, max: 5000 },
                    { label: '₹5,000 - ₹20,000', min: 5000, max: 20000 },
                    { label: '₹20,000 - ₹50,000', min: 20000, max: 50000 },
                    { label: 'Above ₹50,000', min: 50000, max: 999999 },
                  ].map(range => (
                    <label key={range.label} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#212121' }}>
                      <input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                      {range.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Customer Rating */}
              <div style={{ padding: '16px', borderBottom: '1px solid #e0e0e0' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#212121', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer Rating</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['4★ & above', '3★ & above', '2★ & above'].map(rating => (
                    <label key={rating} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#212121' }}>
                      <input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                      {rating}
                    </label>
                  ))}
                </div>
              </div>

              {/* Discount */}
              <div style={{ padding: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 600, color: '#212121', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Discount</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {['10% or more', '20% or more', '30% or more', '50% or more', '70% or more'].map(discount => (
                    <label key={discount} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '13px', color: '#212121' }}>
                      <input type="checkbox" style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                      {discount}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Section */}
          <div style={{ flex: 1 }}>
            {/* Sort Bar - Desktop */}
            <div className="cat-desktop-header" style={{
              backgroundColor: '#fff', padding: '12px 16px', marginBottom: '12px',
              borderRadius: '2px', boxShadow: '0 1px 1px 0 rgba(0,0,0,.08)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '14px', color: '#212121', fontWeight: 500 }}>
                Showing {sortedProducts.length} products
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '14px', color: '#212121', fontWeight: 500 }}>Sort By</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{
                    padding: '8px 32px 8px 12px', border: '1px solid #e0e0e0', borderRadius: '2px',
                    fontSize: '13px', color: '#212121', cursor: 'pointer', backgroundColor: '#fff',
                    fontFamily: 'inherit',
                  }}
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="cat-products-grid">
              {sortedProducts.map(product => (
                <Link
                  key={product.id}
                  href={getProductUrl(product.title, product.id)}
                  style={{ textDecoration: 'none', position: 'relative' }}
                >
                  <div className="cat-product-card">
                    {/* Wishlist Heart */}
                    <button
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                      style={{
                        position: 'absolute', top: '8px', right: '8px', zIndex: 2,
                        width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.9)',
                        border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                      }}
                    >
                      <Heart size={16} color="#878787" />
                    </button>

                    {/* Image */}
                    <div style={{ width: '100%', paddingTop: '100%', position: 'relative', backgroundColor: '#fafafa' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={proxyImage(product.image)}
                        alt={product.title}
                        loading="lazy"
                        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', padding: '12px' }}
                      />
                    </div>

                    {/* Details */}
                    <div style={{ padding: '12px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      {/* Brand/Title */}
                      <h3 style={{
                        fontSize: '14px', fontWeight: 500, color: '#212121', marginBottom: '6px',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {product.brand || product.title.split(' ')[0]}
                      </h3>

                      {/* Product Name */}
                      <p style={{
                        fontSize: '12px', color: '#878787', marginBottom: '8px',
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                        overflow: 'hidden', minHeight: '32px', lineHeight: '16px',
                      }}>
                        {product.title}
                      </p>

                      {/* Rating */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                        <div style={{
                          backgroundColor: '#388e3c', color: '#fff', padding: '2px 6px',
                          borderRadius: '3px', fontSize: '11px', fontWeight: 600,
                          display: 'inline-flex', alignItems: 'center', gap: '2px',
                        }}>
                          {product.rating} <Star size={9} fill="#fff" />
                        </div>
                        <span style={{ fontSize: '11px', color: '#878787' }}>
                          ({product.ratingCount.toLocaleString()})
                        </span>
                      </div>

                      {/* Price */}
                      <div style={{ marginTop: 'auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '2px' }}>
                          <span style={{ fontSize: '16px', fontWeight: 600, color: '#212121' }}>
                            ₹{product.price.toLocaleString('en-IN')}
                          </span>
                          {/* F-Assured badge */}
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: '2px',
                            border: '1px solid #47c9a2', borderRadius: '10px',
                            padding: '1px 5px 1px 2px', flexShrink: 0,
                          }}>
                            <span style={{
                              width: '14px', height: '14px', borderRadius: '50%',
                              backgroundColor: '#2874f0',
                              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0,
                            }}>
                              <span style={{ color: '#fff', fontSize: '8px', fontWeight: 900, fontStyle: 'italic' }}>F</span>
                            </span>
                            <span style={{ color: '#47c9a2', fontSize: '9px', fontWeight: 700 }}>Assured</span>
                          </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                          <span style={{ fontSize: '12px', color: '#878787', textDecoration: 'line-through' }}>
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                          <span style={{ fontSize: '12px', color: '#388e3c', fontWeight: 600 }}>
                            {product.discount}% off
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}

              {sortedProducts.length === 0 && (
                <div style={{
                  gridColumn: '1 / -1', backgroundColor: '#fff', padding: '60px 20px',
                  textAlign: 'center', borderRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.08)',
                }}>
                  <p style={{ fontSize: '18px', color: '#878787', marginBottom: '8px' }}>No products found</p>
                  <p style={{ fontSize: '14px', color: '#878787' }}>Try searching for something else</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
