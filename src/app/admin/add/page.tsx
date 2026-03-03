'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { addManualProduct, scrapeProductFromUrl } from '../actions';
import Link from 'next/link';

export default function AddProductPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'scraper' | 'manual'>('scraper');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Scraper Form State
    const [scrapeUrl, setScrapeUrl] = useState('');
    const [targetPrice, setTargetPrice] = useState('99');

    // Manual Form State
    const [manualData, setManualData] = useState({
        title: '',
        brand: '',
        image: '',
        price: '',
        discount: '90',
    });

    const handleScrapeSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!scrapeUrl.includes('flipkart.com')) {
            setError('Please enter a valid Flipkart product URL');
            return;
        }

        setLoading(true);
        try {
            const res = await scrapeProductFromUrl(scrapeUrl, targetPrice);
            if (res.success) {
                alert(`Successfully imported: ${res.title}`);
                router.push('/admin');
            } else {
                setError(res.error || 'Failed to import product');
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        }
        setLoading(false);
    };

    const handleManualSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const price = parseInt(manualData.price) || 0;
        const discount = parseInt(manualData.discount) || 0;
        const originalPrice = Math.round(price / (1 - discount / 100));

        try {
            const payload = {
                title: manualData.title,
                brand: manualData.brand,
                image: manualData.image,
                price,
                discount,
                originalPrice,
            };

            const res = await addManualProduct(payload);
            if (res.success) {
                router.push('/admin');
            } else {
                setError(res.error || 'Failed to create product');
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
            <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1f2937' }}>Add New Product</h1>
                <Link href="/admin" style={{ color: '#2874f0', fontWeight: 500, fontSize: '14px', textDecoration: 'none' }}
                    onMouseEnter={(e) => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={(e) => e.currentTarget.style.textDecoration = 'none'}
                >
                    &larr; Back to Products
                </Link>
            </div>

            <div style={{ backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb' }}>
                    <button
                        style={{
                            flex: 1,
                            padding: '16px',
                            textAlign: 'center',
                            fontWeight: 600,
                            fontSize: '14px',
                            transition: 'all 0.2s',
                            backgroundColor: activeTab === 'scraper' ? '#fff' : '#f9fafb',
                            color: activeTab === 'scraper' ? '#2874f0' : '#6b7280',
                            borderBottom: activeTab === 'scraper' ? '2px solid #2874f0' : 'none',
                            cursor: 'pointer'
                        }}
                        onClick={() => setActiveTab('scraper')}
                        onMouseEnter={(e) => { if (activeTab !== 'scraper') { e.currentTarget.style.backgroundColor = '#f3f4f6'; e.currentTarget.style.color = '#374151'; } }}
                        onMouseLeave={(e) => { if (activeTab !== 'scraper') { e.currentTarget.style.backgroundColor = '#f9fafb'; e.currentTarget.style.color = '#6b7280'; } }}
                    >
                        ⚡ Auto-Import via Flipkart URL
                    </button>
                    <button
                        style={{
                            flex: 1,
                            padding: '16px',
                            textAlign: 'center',
                            fontWeight: 600,
                            fontSize: '14px',
                            transition: 'all 0.2s',
                            backgroundColor: activeTab === 'manual' ? '#fff' : '#f9fafb',
                            color: activeTab === 'manual' ? '#2874f0' : '#6b7280',
                            borderBottom: activeTab === 'manual' ? '2px solid #2874f0' : 'none',
                            cursor: 'pointer'
                        }}
                        onClick={() => setActiveTab('manual')}
                        onMouseEnter={(e) => { if (activeTab !== 'manual') { e.currentTarget.style.backgroundColor = '#f3f4f6'; e.currentTarget.style.color = '#374151'; } }}
                        onMouseLeave={(e) => { if (activeTab !== 'manual') { e.currentTarget.style.backgroundColor = '#f9fafb'; e.currentTarget.style.color = '#6b7280'; } }}
                    >
                        ✏️ Manual Entry
                    </button>
                </div>

                <div style={{ padding: '24px 32px' }}>
                    {error && (
                        <div style={{ marginBottom: '24px', backgroundColor: '#fef2f2', color: '#991b1b', padding: '16px', borderRadius: '4px', fontSize: '14px', border: '1px solid #fecaca', fontWeight: 500 }}>
                            🚧 {error}
                        </div>
                    )}

                    {activeTab === 'scraper' ? (
                        <form onSubmit={handleScrapeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
                                    Flipkart Product URL <span style={{ color: '#dc2626' }}>*</span>
                                </label>
                                <input
                                    type="url"
                                    required
                                    placeholder="https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac6485515ae4"
                                    style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '4px', padding: '10px 16px', fontSize: '14px', color: '#1f2937', outline: 'none' }}
                                    value={scrapeUrl}
                                    onChange={e => setScrapeUrl(e.target.value)}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = '#2874f0'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(40, 116, 240, 0.1)'; }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none'; }}
                                />
                                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                                    The scraper will fetch the title, generic high-res images, real buyer reviews, and exact specifications.
                                </p>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>
                                    Target Selling Price (₹)
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    style={{ width: '50%', border: '1px solid #d1d5db', borderRadius: '4px', padding: '10px 16px', fontSize: '14px', color: '#1f2937', outline: 'none' }}
                                    value={targetPrice}
                                    onChange={e => setTargetPrice(e.target.value)}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = '#2874f0'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(40, 116, 240, 0.1)'; }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; e.currentTarget.style.boxShadow = 'none'; }}
                                />
                                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '8px' }}>
                                    We will intelligently set the "Original Price" higher to generate a massive ~99% discount.
                                </p>
                            </div>

                            <div style={{ paddingTop: '16px' }}>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        backgroundColor: loading ? '#93c5fd' : '#2874f0',
                                        color: '#fff',
                                        fontWeight: 500,
                                        padding: '12px 24px',
                                        borderRadius: '4px',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                        fontSize: '14px',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: loading ? 0.7 : 1,
                                        transition: 'background-color 0.2s',
                                        border: 'none'
                                    }}
                                    onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#1e5bb8'; }}
                                    onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#2874f0'; }}
                                >
                                    {loading ? 'Fetching Product Data...' : 'Start Import'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Product Title *</label>
                                    <input
                                        type="text" required
                                        style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '4px', padding: '8px 16px', fontSize: '14px', color: '#1f2937', outline: 'none' }}
                                        value={manualData.title}
                                        onChange={e => setManualData({ ...manualData, title: e.target.value })}
                                        onFocus={(e) => { e.currentTarget.style.borderColor = '#2874f0'; }}
                                        onBlur={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Brand</label>
                                    <input
                                        type="text"
                                        style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '4px', padding: '8px 16px', fontSize: '14px', color: '#1f2937', outline: 'none' }}
                                        placeholder="e.g. APPLE"
                                        value={manualData.brand}
                                        onChange={e => setManualData({ ...manualData, brand: e.target.value })}
                                        onFocus={(e) => { e.currentTarget.style.borderColor = '#2874f0'; }}
                                        onBlur={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Image URL *</label>
                                <input
                                    type="url" required
                                    style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '4px', padding: '8px 16px', fontSize: '14px', color: '#1f2937', outline: 'none' }}
                                    placeholder="https://..."
                                    value={manualData.image}
                                    onChange={e => setManualData({ ...manualData, image: e.target.value })}
                                    onFocus={(e) => { e.currentTarget.style.borderColor = '#2874f0'; }}
                                    onBlur={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', backgroundColor: 'rgba(239, 246, 255, 0.5)', padding: '16px', borderRadius: '4px', border: '1px solid #dbeafe' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 700, color: '#1f2937', marginBottom: '8px' }}>Selling Price (₹) *</label>
                                    <input
                                        type="number" required min="1"
                                        style={{ width: '100%', border: '1px solid #d1d5db', borderRadius: '4px', padding: '8px 16px', fontSize: '20px', fontWeight: 500, color: '#111827', outline: 'none' }}
                                        value={manualData.price}
                                        onChange={e => setManualData({ ...manualData, price: e.target.value })}
                                        onFocus={(e) => { e.currentTarget.style.borderColor = '#2874f0'; }}
                                        onBlur={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; }}
                                    />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Discount Percentage (%) *</label>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <input
                                            type="number" required min="1" max="99"
                                            style={{ width: '128px', border: '1px solid #d1d5db', borderRadius: '4px', padding: '8px 16px', fontSize: '14px', color: '#1f2937', outline: 'none' }}
                                            value={manualData.discount}
                                            onChange={e => setManualData({ ...manualData, discount: e.target.value })}
                                            onFocus={(e) => { e.currentTarget.style.borderColor = '#2874f0'; }}
                                            onBlur={(e) => { e.currentTarget.style.borderColor = '#d1d5db'; }}
                                        />
                                        <span style={{ color: '#6b7280', fontWeight: 500, fontSize: '14px' }}>
                                            Original Price: <span style={{ textDecoration: 'line-through' }}>₹{Math.round((parseInt(manualData.price) || 0) / (1 - (parseInt(manualData.discount) || 0) / 100)).toLocaleString()}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ paddingTop: '16px' }}>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    style={{
                                        backgroundColor: loading ? '#93c5fd' : '#2874f0',
                                        color: '#fff',
                                        fontWeight: 500,
                                        padding: '12px 24px',
                                        borderRadius: '4px',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                                        fontSize: '14px',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        opacity: loading ? 0.7 : 1,
                                        transition: 'background-color 0.2s',
                                        border: 'none'
                                    }}
                                    onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#1e5bb8'; }}
                                    onMouseLeave={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#2874f0'; }}
                                >
                                    {loading ? 'Saving...' : 'Create Product'}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
