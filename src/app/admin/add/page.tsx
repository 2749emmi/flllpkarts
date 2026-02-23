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
        <div className="max-w-4xl mx-auto">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
                <Link href="/admin" className="text-[#2874f0] hover:underline font-medium text-sm">
                    &larr; Back to Products
                </Link>
            </div>

            <div className="bg-white rounded shadow-sm border border-gray-200 overflow-hidden">
                {/* Tabs */}
                <div className="flex border-b border-gray-200">
                    <button
                        className={`flex-1 py-4 text-center font-semibold text-sm transition-colors ${activeTab === 'scraper' ? 'bg-white text-[#2874f0] border-b-2 border-[#2874f0]' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('scraper')}
                    >
                        ⚡ Auto-Import via Flipkart URL
                    </button>
                    <button
                        className={`flex-1 py-4 text-center font-semibold text-sm transition-colors ${activeTab === 'manual' ? 'bg-white text-[#2874f0] border-b-2 border-[#2874f0]' : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700'}`}
                        onClick={() => setActiveTab('manual')}
                    >
                        ✏️ Manual Entry
                    </button>
                </div>

                <div className="p-6 md:p-8">
                    {error && (
                        <div className="mb-6 bg-red-50 text-red-700 p-4 rounded text-sm border border-red-200 font-medium">
                            🚧 {error}
                        </div>
                    )}

                    {activeTab === 'scraper' ? (
                        <form onSubmit={handleScrapeSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Flipkart Product URL <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="url"
                                    required
                                    placeholder="https://www.flipkart.com/apple-iphone-15-black-128-gb/p/itm6ac6485515ae4"
                                    className="w-full border border-gray-300 rounded px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2874f0]/50 focus:border-[#2874f0] text-gray-800"
                                    value={scrapeUrl}
                                    onChange={e => setScrapeUrl(e.target.value)}
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    The scraper will fetch the title, generic high-res images, real buyer reviews, and exact specifications.
                                </p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Target Selling Price (₹)
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    className="w-full md:w-1/2 border border-gray-300 rounded px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2874f0]/50 focus:border-[#2874f0] text-gray-800"
                                    value={targetPrice}
                                    onChange={e => setTargetPrice(e.target.value)}
                                />
                                <p className="text-xs text-gray-500 mt-2">
                                    We will intelligently set the "Original Price" higher to generate a massive ~99% discount.
                                </p>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-[#2874f0] hover:bg-blue-700 text-white font-medium py-3 px-6 rounded shadow-sm w-full md:w-auto transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? 'Fetching Product Data...' : 'Start Import'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <form onSubmit={handleManualSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Title *</label>
                                    <input
                                        type="text" required
                                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#2874f0] text-gray-800"
                                        value={manualData.title}
                                        onChange={e => setManualData({ ...manualData, title: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Brand</label>
                                    <input
                                        type="text"
                                        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#2874f0] text-gray-800"
                                        placeholder="e.g. APPLE"
                                        value={manualData.brand}
                                        onChange={e => setManualData({ ...manualData, brand: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL *</label>
                                <input
                                    type="url" required
                                    className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#2874f0] text-gray-800"
                                    placeholder="https://..."
                                    value={manualData.image}
                                    onChange={e => setManualData({ ...manualData, image: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-blue-50/50 p-4 rounded border border-blue-100">
                                <div>
                                    <label className="block text-sm font-bold text-gray-800 mb-2">Selling Price (₹) *</label>
                                    <input
                                        type="number" required min="1"
                                        className="w-full border border-gray-300 rounded px-4 py-2 text-xl font-medium focus:outline-none focus:border-[#2874f0] text-gray-900"
                                        value={manualData.price}
                                        onChange={e => setManualData({ ...manualData, price: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount Percentage (%) *</label>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="number" required min="1" max="99"
                                            className="w-32 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-[#2874f0] text-gray-800"
                                            value={manualData.discount}
                                            onChange={e => setManualData({ ...manualData, discount: e.target.value })}
                                        />
                                        <span className="text-gray-500 font-medium text-sm">
                                            Original Price: <span className="line-through">₹{Math.round((parseInt(manualData.price) || 0) / (1 - (parseInt(manualData.discount) || 0) / 100)).toLocaleString()}</span>
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-[#2874f0] hover:bg-blue-700 text-white font-medium py-3 px-6 rounded shadow-sm w-full md:w-auto transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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
