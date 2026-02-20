'use client';
import Link from 'next/link';
import Image from 'next/image';
import { products, Product } from '@/data/products';
import { useState } from 'react';

const categoryFilters = [
  { label: 'All', value: null },
  { label: 'Mobiles', value: 'mobiles' },
  { label: 'Electronics', value: 'electronics' },
  { label: 'Fashion', value: 'fashion' },
  { label: 'Home & Furniture', value: 'home' },
  { label: 'Appliances', value: 'appliances' },
  { label: 'Beauty, Toys & More', value: 'beauty' },
  { label: 'Grocery', value: 'grocery' },
];

const sortOptions = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Popularity', value: 'popularity' },
  { label: 'Price -- Low to High', value: 'price_asc' },
  { label: 'Price -- High to Low', value: 'price_desc' },
  { label: 'Newest First', value: 'newest' },
];

function ListProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} style={{
      display: 'flex', textDecoration: 'none', padding: '16px 20px',
      borderBottom: '1px solid #f0f0f0', gap: '20px',
      transition: 'box-shadow 0.15s',
    }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 1px 6px 0 rgba(0,0,0,0.1)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
    >
      {/* Image */}
      <div style={{
        width: '176px', height: '176px', flexShrink: 0, position: 'relative',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Image src={product.image} alt={product.title} fill style={{ objectFit: 'contain' }} sizes="176px" loading="lazy" />
      </div>

      {/* Details */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <p style={{ fontSize: '16px', fontWeight: 400, color: '#212121', margin: 0, lineHeight: 1.4 }}>
          {product.title}
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            backgroundColor: '#388e3c', color: '#fff', fontSize: '12px', fontWeight: 700,
            padding: '1px 5px', borderRadius: '2px', display: 'inline-flex', alignItems: 'center', gap: '2px',
          }}>
            {product.rating} ★
          </span>
          <span style={{ color: '#878787', fontSize: '13px' }}>({product.ratingCount})</span>
          <Image
            src="/images/assured-badge.svg"
            alt="Assured"
            width={56}
            height={22}
            style={{ objectFit: 'contain' }}
          />
        </div>
        <ul style={{ listStyle: 'disc', paddingLeft: '18px', margin: '4px 0 0', color: '#878787', fontSize: '13px', lineHeight: 1.7 }}>
          {product.highlights.slice(0, 3).map((h, i) => (
            <li key={i}>{h}</li>
          ))}
        </ul>
      </div>

      {/* Price Column */}
      <div style={{
        width: '180px', flexShrink: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'flex-end', gap: '4px', paddingTop: '2px',
      }}>
        <span style={{ fontSize: '22px', fontWeight: 700, color: '#212121' }}>
          ₹{product.price.toLocaleString('en-IN')}
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#878787', fontSize: '14px', textDecoration: 'line-through' }}>
            ₹{product.originalPrice.toLocaleString('en-IN')}
          </span>
          <span style={{ color: '#388e3c', fontSize: '13px', fontWeight: 600 }}>
            {product.discount}% off
          </span>
        </div>
        <p style={{ fontSize: '12px', color: '#212121', margin: '2px 0 0' }}>Free delivery</p>
        {product.offers[0] && (
          <p style={{ fontSize: '12px', color: '#2874f0', margin: '4px 0 0', fontWeight: 500, textAlign: 'right' }}>
            {product.offers[0]}
          </p>
        )}
      </div>
    </Link>
  );
}

function GridProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} style={{
      display: 'flex', flexDirection: 'column', backgroundColor: '#fff', padding: '8px',
      textDecoration: 'none', borderBottom: '1px solid #f0f0f0', borderRight: '1px solid #f0f0f0',
    }}>
      <div style={{
        width: '100%', aspectRatio: '1', position: 'relative', marginBottom: '8px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#fff',
      }}>
        <Image src={product.image} alt={product.title} fill style={{ objectFit: 'contain', padding: '8px' }} sizes="(max-width: 640px) 45vw, 180px" loading="lazy" />
      </div>
      <p style={{
        fontSize: '13px', fontWeight: 400, color: '#212121', margin: '0 0 4px',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
      }}>
        {product.title.split('(')[0].trim()}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
        <span style={{
          backgroundColor: '#388e3c', color: '#fff', fontSize: '11px', fontWeight: 700,
          padding: '0px 4px', borderRadius: '2px',
        }}>
          {product.rating} ★
        </span>
        <span style={{ color: '#878787', fontSize: '11px' }}>({product.ratingCount})</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '14px', fontWeight: 700, color: '#212121' }}>
          ₹{product.price.toLocaleString('en-IN')}
        </span>
        <span style={{ color: '#878787', fontSize: '11px', textDecoration: 'line-through' }}>
          ₹{product.originalPrice.toLocaleString('en-IN')}
        </span>
      </div>
      <span style={{ color: '#388e3c', fontSize: '12px', fontWeight: 600 }}>
        {product.discount}% off
      </span>
    </Link>
  );
}

export default function OffersPage() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState('relevance');

  let filtered = activeCategory
    ? products.filter(p => p.category === activeCategory)
    : products.filter(p => p.discount >= 30);

  if (activeSort === 'price_asc') filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (activeSort === 'price_desc') filtered = [...filtered].sort((a, b) => b.price - a.price);
  else if (activeSort === 'popularity') filtered = [...filtered].sort((a, b) => b.rating - a.rating);

  return (
    <div style={{ backgroundColor: '#f1f3f6', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
      <div style={{ maxWidth: '1248px', margin: '0 auto', padding: '12px 0 32px', width: '100%' }}>
        {/* Breadcrumb */}
        <div style={{
          fontSize: '12px', color: '#878787', marginBottom: '10px',
          display: 'flex', alignItems: 'center', gap: '4px', padding: '0 10px',
        }}>
          <Link href="/" style={{ color: '#2874f0', textDecoration: 'none' }}>Home</Link>
          <span>&gt;</span>
          <span style={{ color: '#212121' }}>Offer Zone</span>
        </div>

        <div className="offers-layout" style={{ padding: '0' }}>
          {/* ===== SIDEBAR (Desktop) ===== */}
          <aside className="offers-sidebar">
            <div style={{ backgroundColor: '#fff', boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)' }}>
              {/* Filters heading */}
              <div style={{
                padding: '12px 16px', borderBottom: '1px solid #e0e0e0',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <span style={{ fontSize: '18px', fontWeight: 700, color: '#212121' }}>Filters</span>
              </div>

              {/* Categories */}
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0' }}>
                <p style={{
                  fontSize: '12px', fontWeight: 700, color: '#212121', textTransform: 'uppercase',
                  margin: '0 0 12px', letterSpacing: '0.5px',
                }}>
                  Categories
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {categoryFilters.map((cat, i) => (
                    <label key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                      fontSize: '14px', color: '#212121', fontWeight: activeCategory === cat.value ? 600 : 400,
                    }}>
                      <input
                        type="radio"
                        name="category"
                        checked={activeCategory === cat.value}
                        onChange={() => setActiveCategory(cat.value)}
                        style={{ accentColor: '#2874f0', width: '16px', height: '16px', cursor: 'pointer' }}
                      />
                      {cat.label}
                    </label>
                  ))}
                </div>
              </div>

              {/* Discount */}
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0' }}>
                <p style={{
                  fontSize: '12px', fontWeight: 700, color: '#212121', textTransform: 'uppercase',
                  margin: '0 0 12px', letterSpacing: '0.5px',
                }}>
                  Discount
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {['10% or more', '20% or more', '30% or more', '50% or more', '70% or more'].map((d, i) => (
                    <label key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                      fontSize: '14px', color: '#212121',
                    }}>
                      <input type="checkbox" style={{ accentColor: '#2874f0', width: '16px', height: '16px', cursor: 'pointer' }} />
                      {d}
                    </label>
                  ))}
                </div>
              </div>

              {/* Customer Rating */}
              <div style={{ padding: '14px 16px' }}>
                <p style={{
                  fontSize: '12px', fontWeight: 700, color: '#212121', textTransform: 'uppercase',
                  margin: '0 0 12px', letterSpacing: '0.5px',
                }}>
                  Customer Ratings
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {['4★ & above', '3★ & above', '2★ & above'].map((r, i) => (
                    <label key={i} style={{
                      display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer',
                      fontSize: '14px', color: '#212121',
                    }}>
                      <input type="checkbox" style={{ accentColor: '#2874f0', width: '16px', height: '16px', cursor: 'pointer' }} />
                      {r}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ===== MAIN CONTENT ===== */}
          <div className="offers-main">
            {/* Mobile filter tabs */}
            <div className="offers-mobile-tabs hide-scrollbar" style={{
              backgroundColor: '#fff', boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)',
              marginBottom: '0', overflowX: 'auto', display: 'flex',
              WebkitOverflowScrolling: 'touch',
            }}>
              {categoryFilters.map((cat, i) => {
                const isActive = activeCategory === cat.value;
                return (
                  <button key={i} onClick={() => setActiveCategory(cat.value)} style={{
                    padding: '10px 14px', fontSize: '12px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#2874f0' : '#212121',
                    backgroundColor: 'transparent', border: 'none',
                    borderBottom: isActive ? '3px solid #2874f0' : '3px solid transparent',
                    cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: 'inherit',
                    flexShrink: 0,
                  }}>
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* Sort bar */}
            <div style={{
              backgroundColor: '#fff', boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)',
              padding: '0', borderBottom: '1px solid #e0e0e0',
            }}>
              <div className="hide-scrollbar" style={{
                display: 'flex', alignItems: 'center', overflowX: 'auto',
                padding: '0 12px',
              }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#212121', marginRight: '4px', whiteSpace: 'nowrap', padding: '10px 0' }}>
                  Sort By
                </span>
                {sortOptions.map(opt => (
                  <button key={opt.value} onClick={() => setActiveSort(opt.value)} style={{
                    padding: '10px 10px', fontSize: '13px',
                    fontWeight: activeSort === opt.value ? 600 : 400,
                    color: activeSort === opt.value ? '#2874f0' : '#212121',
                    backgroundColor: 'transparent', border: 'none', cursor: 'pointer',
                    whiteSpace: 'nowrap', fontFamily: 'inherit',
                    borderBottom: activeSort === opt.value ? '2px solid #2874f0' : '2px solid transparent',
                  }}>
                    {opt.label}
                  </button>
                ))}
                <span style={{ fontSize: '12px', color: '#878787', whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 'auto', paddingLeft: '8px' }}>
                  {filtered.length} results
                </span>
              </div>
            </div>

            {/* Product list (desktop) / grid (mobile) */}
            {filtered.length > 0 ? (
              <>
                {/* Desktop: list view */}
                <div className="offers-list-view" style={{ backgroundColor: '#fff' }}>
                  {filtered.map(product => (
                    <ListProductCard key={product.id} product={product} />
                  ))}
                </div>
                {/* Mobile: grid view */}
                <div className="offers-grid-view">
                  {filtered.map(product => (
                    <GridProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            ) : (
              <div style={{
                backgroundColor: '#fff', padding: '60px 16px', textAlign: 'center',
              }}>
                <p style={{ fontSize: '16px', color: '#878787', fontWeight: 500 }}>
                  No offers available in this category right now.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
