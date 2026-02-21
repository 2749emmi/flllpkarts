'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, RefreshCw, ExternalLink, Search, Package, AlertCircle, CheckCircle, Loader2, Edit3, X, ChevronDown, ChevronUp } from 'lucide-react';

interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  images?: string[];
  rating: number;
  ratingCount: string;
  reviewCount: string;
  category: string;
  offers: string[];
  highlights: string[];
  description: string;
  specs?: Record<string, string>;
  reviews?: { rating: number; title: string; comment: string; author: string; date: string; verifiedPurchase: boolean; likes: number; dislikes: number }[];
  brand?: string;
  seller?: string;
  sourceUrl?: string;
}

type ScrapeStatus = 'idle' | 'scraping' | 'scraped' | 'error';
type Tab = 'products' | 'add';

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('products');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQ, setSearchQ] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const [flipkartUrl, setFlipkartUrl] = useState('');
  const [scrapeStatus, setScrapeStatus] = useState<ScrapeStatus>('idle');
  const [scrapeError, setScrapeError] = useState('');
  const [scrapedProduct, setScrapedProduct] = useState<Partial<Product> | null>(null);
  const [listingPrice, setListingPrice] = useState('');
  const [adding, setAdding] = useState(false);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch { showToast('Failed to load products', 'error'); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleScrape = async () => {
    if (!flipkartUrl.includes('flipkart.com')) {
      setScrapeError('Enter a valid Flipkart product URL');
      return;
    }
    setScrapeStatus('scraping');
    setScrapeError('');
    setScrapedProduct(null);
    try {
      const res = await fetch('/api/admin/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: flipkartUrl }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Scraping failed');
      setScrapedProduct(data.product);
      setListingPrice(String(data.product.price || ''));
      setScrapeStatus('scraped');
    } catch (err: unknown) {
      setScrapeError(err instanceof Error ? err.message : 'Scraping failed');
      setScrapeStatus('error');
    }
  };

  const calcDiscount = (listing: number, original: number) => {
    if (original <= 0 || listing >= original) return 0;
    return Math.round((1 - listing / original) * 100);
  };

  const handleAddProduct = async () => {
    if (!scrapedProduct) return;
    const lp = parseInt(listingPrice);
    if (!lp || lp <= 0) { setScrapeError('Enter a valid listing price'); return; }

    setAdding(true);
    try {
      const discount = calcDiscount(lp, scrapedProduct.originalPrice || 0);
      const productToAdd = {
        ...scrapedProduct,
        price: lp,
        discount,
      };
      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productToAdd),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error);
      showToast(`Added "${data.product.title}" (ID: ${data.product.id})`);
      setScrapedProduct(null);
      setFlipkartUrl('');
      setListingPrice('');
      setScrapeStatus('idle');
      fetchProducts();
      setTab('products');
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Failed to add', 'error');
    }
    setAdding(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/admin/products', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      showToast(`Removed "${data.removed?.title}"`);
      setDeleteConfirm(null);
      fetchProducts();
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : 'Delete failed', 'error');
    }
  };

  const filtered = products.filter(p =>
    !searchQ || p.title.toLowerCase().includes(searchQ.toLowerCase()) || p.category.toLowerCase().includes(searchQ.toLowerCase()) || p.id === searchQ
  );

  const categories = [...new Set(products.map(p => p.category))];

  return (
    <div style={{ backgroundColor: '#f1f3f6', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#2874f0', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <Link href="/" style={{ color: '#fff', textDecoration: 'none', fontSize: '18px', fontWeight: 700 }}>
            Flipkart
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px' }}>Admin Panel</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fff', fontSize: '13px' }}>
          <Package style={{ width: '16px', height: '16px' }} />
          {products.length} Products
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '20px', borderBottom: '2px solid #e0e0e0' }}>
          {[
            { id: 'products' as Tab, label: 'Manage Products', icon: <Package style={{ width: '16px', height: '16px' }} /> },
            { id: 'add' as Tab, label: 'Add from Flipkart', icon: <Plus style={{ width: '16px', height: '16px' }} /> },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              style={{
                padding: '12px 24px', fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                backgroundColor: 'transparent', border: 'none', borderBottom: tab === t.id ? '2px solid #2874f0' : '2px solid transparent',
                color: tab === t.id ? '#2874f0' : '#878787', display: 'flex', alignItems: 'center', gap: '8px',
                fontFamily: 'inherit', marginBottom: '-2px', transition: 'all 0.2s',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ========== PRODUCTS TAB ========== */}
        {tab === 'products' && (
          <div>
            {/* Search + Stats */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
              <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: '#878787' }} />
                <input
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  placeholder="Search by title, category, or ID..."
                  style={{
                    width: '100%', padding: '10px 12px 10px 38px', border: '1px solid #e0e0e0',
                    borderRadius: '4px', fontSize: '14px', fontFamily: 'inherit', outline: 'none', backgroundColor: '#fff',
                  }}
                />
              </div>
              <button onClick={fetchProducts} style={{
                padding: '10px 16px', backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontFamily: 'inherit',
              }}>
                <RefreshCw style={{ width: '14px', height: '14px' }} /> Refresh
              </button>
            </div>

            {/* Category pills */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              <button onClick={() => setSearchQ('')} style={{
                padding: '6px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                backgroundColor: !searchQ ? '#2874f0' : '#fff', color: !searchQ ? '#fff' : '#212121',
                border: !searchQ ? 'none' : '1px solid #e0e0e0',
              }}>
                All ({products.length})
              </button>
              {categories.map(cat => {
                const count = products.filter(p => p.category === cat).length;
                return (
                  <button key={cat} onClick={() => setSearchQ(cat)} style={{
                    padding: '6px 12px', borderRadius: '16px', fontSize: '12px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                    backgroundColor: searchQ === cat ? '#2874f0' : '#fff', color: searchQ === cat ? '#fff' : '#212121',
                    border: searchQ === cat ? 'none' : '1px solid #e0e0e0', textTransform: 'capitalize',
                  }}>
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            {/* Products list */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: '#878787' }}>
                <Loader2 style={{ width: '32px', height: '32px', animation: 'spin 1s linear infinite' }} />
                <p>Loading products...</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {filtered.map(p => (
                  <div key={p.id} style={{ backgroundColor: '#fff', borderRadius: '4px', border: '1px solid #e0e0e0', overflow: 'hidden' }}>
                    <div
                      style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', cursor: 'pointer' }}
                      onClick={() => setExpandedId(expandedId === p.id ? null : p.id)}
                    >
                      <div style={{ width: '48px', height: '48px', position: 'relative', flexShrink: 0, borderRadius: '4px', overflow: 'hidden', border: '1px solid #f0f0f0' }}>
                        {p.image && <Image src={p.image} alt="" fill style={{ objectFit: 'contain' }} sizes="48px" />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '14px', fontWeight: 500, color: '#212121', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {p.title}
                        </div>
                        <div style={{ fontSize: '12px', color: '#878787', display: 'flex', gap: '12px', marginTop: '2px' }}>
                          <span>ID: {p.id}</span>
                          <span style={{ textTransform: 'capitalize' }}>{p.category}</span>
                          <span>₹{p.price.toLocaleString('en-IN')}</span>
                          <span style={{ color: '#388e3c' }}>{p.discount}% off</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                        <span style={{ fontSize: '11px', color: '#878787' }}>{(p.images?.length || 1)} imgs</span>
                        <Link href={`/product/${p.id}`} onClick={e => e.stopPropagation()} style={{ color: '#2874f0' }}>
                          <ExternalLink style={{ width: '16px', height: '16px' }} />
                        </Link>
                        {expandedId === p.id ? <ChevronUp style={{ width: '16px', height: '16px', color: '#878787' }} /> : <ChevronDown style={{ width: '16px', height: '16px', color: '#878787' }} />}
                      </div>
                    </div>

                    {expandedId === p.id && (
                      <div style={{ padding: '0 16px 16px', borderTop: '1px solid #f0f0f0' }}>
                        {/* Image gallery */}
                        {p.images && p.images.length > 0 && (
                          <div style={{ display: 'flex', gap: '8px', padding: '12px 0', overflowX: 'auto' }}>
                            {p.images.map((img, i) => (
                              <div key={i} style={{ width: '64px', height: '64px', position: 'relative', flexShrink: 0, border: '1px solid #f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                                <Image src={img} alt="" fill style={{ objectFit: 'contain' }} sizes="64px" />
                              </div>
                            ))}
                          </div>
                        )}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', fontSize: '12px', color: '#212121', marginBottom: '12px' }}>
                          <div><strong>Original:</strong> ₹{p.originalPrice?.toLocaleString('en-IN')}</div>
                          <div><strong>Rating:</strong> {p.rating} ({p.ratingCount})</div>
                          <div><strong>Brand:</strong> {p.brand || 'N/A'}</div>
                          <div><strong>Seller:</strong> {p.seller || 'N/A'}</div>
                          <div><strong>Reviews:</strong> {p.reviews?.length || 0} scraped</div>
                          <div><strong>Specs:</strong> {Object.keys(p.specs || {}).length} fields</div>
                        </div>
                        {p.highlights?.length > 0 && (
                          <div style={{ fontSize: '12px', color: '#212121', marginBottom: '12px' }}>
                            <strong>Highlights:</strong>
                            <ul style={{ margin: '4px 0 0', paddingLeft: '16px' }}>
                              {p.highlights.slice(0, 4).map((h, i) => <li key={i}>{h}</li>)}
                            </ul>
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          {deleteConfirm === p.id ? (
                            <>
                              <span style={{ fontSize: '13px', color: '#c31432', padding: '6px 0' }}>Delete this product?</span>
                              <button onClick={() => handleDelete(p.id)} style={{
                                padding: '6px 16px', backgroundColor: '#c31432', color: '#fff', border: 'none', borderRadius: '4px',
                                fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                              }}>
                                Yes, Delete
                              </button>
                              <button onClick={() => setDeleteConfirm(null)} style={{
                                padding: '6px 16px', backgroundColor: '#fff', color: '#212121', border: '1px solid #e0e0e0', borderRadius: '4px',
                                fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit',
                              }}>
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button onClick={() => setDeleteConfirm(p.id)} style={{
                              padding: '6px 16px', backgroundColor: '#fff', color: '#c31432', border: '1px solid #e0e0e0', borderRadius: '4px',
                              fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontFamily: 'inherit',
                            }}>
                              <Trash2 style={{ width: '14px', height: '14px' }} /> Remove
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========== ADD FROM FLIPKART TAB ========== */}
        {tab === 'add' && (
          <div>
            {/* Step 1: Enter URL */}
            <div style={{ backgroundColor: '#fff', borderRadius: '4px', padding: '24px', marginBottom: '16px', border: '1px solid #e0e0e0' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#212121', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ backgroundColor: '#2874f0', color: '#fff', width: '24px', height: '24px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>1</span>
                Paste Flipkart Product URL
              </h3>
              <p style={{ fontSize: '13px', color: '#878787', marginBottom: '16px' }}>
                The scraper will auto-extract title, images, price, specs, reviews, highlights — everything.
              </p>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input
                  value={flipkartUrl}
                  onChange={e => { setFlipkartUrl(e.target.value); setScrapeStatus('idle'); setScrapeError(''); }}
                  placeholder="https://www.flipkart.com/product-name/p/..."
                  style={{
                    flex: 1, padding: '12px 16px', border: '1px solid #e0e0e0', borderRadius: '4px',
                    fontSize: '14px', fontFamily: 'inherit', outline: 'none',
                  }}
                  onKeyDown={e => { if (e.key === 'Enter') handleScrape(); }}
                />
                <button
                  onClick={handleScrape}
                  disabled={scrapeStatus === 'scraping'}
                  style={{
                    padding: '12px 24px', backgroundColor: '#2874f0', color: '#fff', border: 'none', borderRadius: '4px',
                    fontSize: '14px', fontWeight: 600, cursor: scrapeStatus === 'scraping' ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'inherit', opacity: scrapeStatus === 'scraping' ? 0.7 : 1,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {scrapeStatus === 'scraping' ? (
                    <><Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} /> Scraping...</>
                  ) : (
                    <><Search style={{ width: '16px', height: '16px' }} /> Scrape</>
                  )}
                </button>
              </div>
              {scrapeStatus === 'scraping' && (
                <div style={{ marginTop: '12px', padding: '12px 16px', backgroundColor: '#fff8e1', borderRadius: '4px', fontSize: '13px', color: '#f57f17', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Loader2 style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
                  Scraping Flipkart page... This takes 30-60 seconds (headless browser navigates, scrolls, extracts everything).
                </div>
              )}
              {scrapeError && (
                <div style={{ marginTop: '12px', padding: '12px 16px', backgroundColor: '#fde8e8', borderRadius: '4px', fontSize: '13px', color: '#c31432', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <AlertCircle style={{ width: '16px', height: '16px' }} /> {scrapeError}
                </div>
              )}
            </div>

            {/* Step 2: Preview scraped data */}
            {scrapedProduct && (
              <div style={{ backgroundColor: '#fff', borderRadius: '4px', padding: '24px', marginBottom: '16px', border: '1px solid #e0e0e0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#212121', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ backgroundColor: '#388e3c', color: '#fff', width: '24px', height: '24px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>2</span>
                  Scraped Product Preview
                  <CheckCircle style={{ width: '18px', height: '18px', color: '#388e3c', marginLeft: 'auto' }} />
                </h3>

                {/* Images */}
                {scrapedProduct.images && scrapedProduct.images.length > 0 && (
                  <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', overflowX: 'auto', padding: '4px 0' }}>
                    {scrapedProduct.images.slice(0, 8).map((img, i) => (
                      <div key={i} style={{ width: '80px', height: '80px', position: 'relative', flexShrink: 0, border: '1px solid #f0f0f0', borderRadius: '4px', overflow: 'hidden', backgroundColor: '#fff' }}>
                        <Image src={img} alt="" fill style={{ objectFit: 'contain', padding: '4px' }} sizes="80px" />
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ fontSize: '16px', fontWeight: 600, color: '#212121', marginBottom: '8px' }}>{scrapedProduct.title || 'Untitled'}</div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', fontSize: '13px', color: '#212121', marginBottom: '16px' }}>
                  <div><strong>Flipkart Price:</strong> ₹{(scrapedProduct.originalPrice || 0).toLocaleString('en-IN')}</div>
                  <div><strong>Rating:</strong> {scrapedProduct.rating} ({scrapedProduct.ratingCount})</div>
                  <div><strong>Brand:</strong> {scrapedProduct.brand || 'N/A'}</div>
                  <div><strong>Images:</strong> {scrapedProduct.images?.length || 0} scraped</div>
                  <div><strong>Highlights:</strong> {scrapedProduct.highlights?.length || 0}</div>
                  <div><strong>Specs:</strong> {Object.keys(scrapedProduct.specs || {}).length} fields</div>
                  <div><strong>Reviews:</strong> {scrapedProduct.reviews?.length || 0}</div>
                  <div><strong>Seller:</strong> {scrapedProduct.seller || 'N/A'}</div>
                </div>

                {scrapedProduct.highlights && scrapedProduct.highlights.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <strong style={{ fontSize: '13px' }}>Highlights:</strong>
                    <ul style={{ margin: '4px 0 0', paddingLeft: '16px', fontSize: '13px', color: '#212121' }}>
                      {scrapedProduct.highlights.map((h, i) => <li key={i}>{h}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Set price & add */}
            {scrapedProduct && (
              <div style={{ backgroundColor: '#fff', borderRadius: '4px', padding: '24px', border: '1px solid #e0e0e0' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#212121', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ backgroundColor: '#fb641b', color: '#fff', width: '24px', height: '24px', borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700 }}>3</span>
                  Set Your Listing Price
                </h3>
                <p style={{ fontSize: '13px', color: '#878787', marginBottom: '16px' }}>
                  Original Flipkart price is ₹{(scrapedProduct.originalPrice || 0).toLocaleString('en-IN')}. Set your price — discount auto-calculates.
                </p>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap', marginBottom: '20px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#878787', display: 'block', marginBottom: '4px' }}>Your Listing Price (₹)</label>
                    <input
                      value={listingPrice}
                      onChange={e => setListingPrice(e.target.value.replace(/[^0-9]/g, ''))}
                      placeholder="e.g. 499"
                      style={{
                        padding: '10px 16px', border: '2px solid #2874f0', borderRadius: '4px',
                        fontSize: '20px', fontWeight: 700, width: '180px', fontFamily: 'inherit', outline: 'none',
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '14px', color: '#878787' }}>
                    <span style={{ textDecoration: 'line-through' }}>₹{(scrapedProduct.originalPrice || 0).toLocaleString('en-IN')}</span>
                    {listingPrice && parseInt(listingPrice) > 0 && (
                      <span style={{ color: '#388e3c', fontWeight: 700, marginLeft: '8px' }}>
                        {calcDiscount(parseInt(listingPrice), scrapedProduct.originalPrice || 0)}% off
                      </span>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={handleAddProduct}
                    disabled={adding}
                    style={{
                      padding: '14px 32px', backgroundColor: '#fb641b', color: '#fff', border: 'none', borderRadius: '4px',
                      fontSize: '15px', fontWeight: 700, cursor: adding ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', gap: '8px', fontFamily: 'inherit',
                      opacity: adding ? 0.7 : 1, textTransform: 'uppercase',
                    }}
                  >
                    {adding ? <Loader2 style={{ width: '18px', height: '18px', animation: 'spin 1s linear infinite' }} /> : <Plus style={{ width: '18px', height: '18px' }} />}
                    {adding ? 'Adding...' : 'Add Product to Store'}
                  </button>
                  <button
                    onClick={() => { setScrapedProduct(null); setScrapeStatus('idle'); setFlipkartUrl(''); }}
                    style={{
                      padding: '14px 24px', backgroundColor: '#fff', color: '#212121', border: '1px solid #e0e0e0',
                      borderRadius: '4px', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit',
                      display: 'flex', alignItems: 'center', gap: '6px',
                    }}
                  >
                    <X style={{ width: '16px', height: '16px' }} /> Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          backgroundColor: toast.type === 'success' ? '#388e3c' : '#c31432', color: '#fff',
          padding: '12px 24px', borderRadius: '4px', boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          zIndex: 9999, fontSize: '14px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '8px',
        }}>
          {toast.type === 'success' ? <CheckCircle style={{ width: '16px', height: '16px' }} /> : <AlertCircle style={{ width: '16px', height: '16px' }} />}
          {toast.msg}
        </div>
      )}

      <style jsx global>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
