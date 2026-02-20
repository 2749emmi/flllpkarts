import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/data/products';

const categoryNames: Record<string, string> = {
    mobiles: 'Mobiles',
    fashion: 'Fashion',
    electronics: 'Electronics',
    home: 'Home & Furniture',
    travel: 'Travel',
    appliances: 'Appliances',
    beauty: 'Beauty, Toys & More',
    grocery: 'Grocery',
};

const sortOptions = ['Relevance', 'Popularity', 'Price -- Low to High', 'Price -- High to Low', 'Newest First'];

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const displayName = categoryNames[slug] || slug;
    const filtered = products.filter((p) => p.category === slug);

    return (
        <div style={{ backgroundColor: '#f1f3f6', minHeight: '100vh', paddingBottom: '32px', width: '100%', overflowX: 'hidden' }}>
            <div style={{ maxWidth: '1248px', margin: '0 auto', padding: '12px 0 0', width: '100%' }}>
                {/* Breadcrumb */}
                <div style={{ fontSize: '12px', color: '#878787', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '4px', padding: '0 10px' }}>
                    <Link href="/" style={{ color: '#2874f0', textDecoration: 'none' }}>Home</Link>
                    <span>&gt;</span>
                    <span style={{ color: '#212121', fontWeight: 500 }}>{displayName}</span>
                </div>

                <div className="category-layout">
                    {/* Sidebar */}
                    <aside className="category-sidebar">
                        <div style={{ backgroundColor: '#fff', boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)', position: 'sticky', top: '106px' }}>
                            <div style={{ padding: '12px 16px', borderBottom: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <span style={{ fontSize: '18px', fontWeight: 700, color: '#212121' }}>Filters</span>
                            </div>

                            <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0' }}>
                                <p style={{ fontSize: '12px', fontWeight: 700, color: '#212121', textTransform: 'uppercase', margin: '0 0 12px', letterSpacing: '0.5px' }}>
                                    Price Range
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {['Under ₹1,000', '₹1,000 - ₹5,000', '₹5,000 - ₹20,000', '₹20,000 - ₹50,000', 'Above ₹50,000'].map(r => (
                                        <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#212121' }}>
                                            <input type="checkbox" readOnly style={{ accentColor: '#2874f0', width: '16px', height: '16px' }} /> {r}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0' }}>
                                <p style={{ fontSize: '12px', fontWeight: 700, color: '#212121', textTransform: 'uppercase', margin: '0 0 12px', letterSpacing: '0.5px' }}>
                                    Customer Rating
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {['4★ & above', '3★ & above', '2★ & above'].map(r => (
                                        <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#212121' }}>
                                            <input type="checkbox" readOnly style={{ accentColor: '#2874f0', width: '16px', height: '16px' }} /> {r}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div style={{ padding: '14px 16px' }}>
                                <p style={{ fontSize: '12px', fontWeight: 700, color: '#212121', textTransform: 'uppercase', margin: '0 0 12px', letterSpacing: '0.5px' }}>
                                    Discount
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {['10% or more', '20% or more', '30% or more', '50% or more', '70% or more'].map(r => (
                                        <label key={r} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', color: '#212121' }}>
                                            <input type="checkbox" readOnly style={{ accentColor: '#2874f0', width: '16px', height: '16px' }} /> {r}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="category-main">
                        {/* Header */}
                        <div style={{
                            backgroundColor: '#fff', padding: '12px 16px', marginBottom: '0',
                            boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)',
                            borderBottom: '1px solid #e0e0e0',
                        }}>
                            <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#212121', margin: 0 }}>{displayName}</h1>
                            <p style={{ fontSize: '12px', color: '#878787', margin: '2px 0 0' }}>
                                Showing {filtered.length} product{filtered.length !== 1 ? 's' : ''}
                            </p>
                        </div>

                        {/* Sort bar */}
                        <div className="hide-scrollbar" style={{
                            backgroundColor: '#fff', boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)',
                            padding: '0 12px', marginBottom: '0',
                            display: 'flex', alignItems: 'center', overflowX: 'auto',
                            borderBottom: '1px solid #e0e0e0',
                        }}>
                            <span style={{ fontSize: '13px', fontWeight: 700, color: '#212121', marginRight: '4px', whiteSpace: 'nowrap', padding: '10px 0' }}>
                                Sort By
                            </span>
                            {sortOptions.map((opt, i) => (
                                <button
                                    key={opt}
                                    style={{
                                        fontSize: '13px',
                                        padding: '10px 10px',
                                        border: 'none',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        fontWeight: i === 0 ? 600 : 400,
                                        color: i === 0 ? '#2874f0' : '#212121',
                                        backgroundColor: 'transparent',
                                        whiteSpace: 'nowrap',
                                        borderBottom: i === 0 ? '2px solid #2874f0' : '2px solid transparent',
                                    }}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>

                        {/* Product Grid */}
                        {filtered.length > 0 ? (
                            <div className="category-grid">
                                {filtered.map((product) => (
                                    <Link
                                        key={product.id}
                                        href={`/product/${product.id}`}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            padding: '8px',
                                            textDecoration: 'none',
                                            backgroundColor: '#fff',
                                        }}
                                    >
                                        <div style={{
                                            width: '100%', aspectRatio: '1', position: 'relative', marginBottom: '8px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        }}>
                                            <Image
                                                src={product.image}
                                                alt={product.title}
                                                fill
                                                style={{ objectFit: 'contain', padding: '6px' }}
                                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                                loading="lazy"
                                            />
                                        </div>
                                        <p style={{
                                            fontSize: '13px', fontWeight: 400, color: '#212121',
                                            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                            margin: '0 0 4px',
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
                                        <p style={{ fontSize: '11px', color: '#212121', margin: '4px 0 0' }}>
                                            Free delivery
                                        </p>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div style={{ backgroundColor: '#fff', padding: '60px 16px', textAlign: 'center' }}>
                                <p style={{ color: '#878787', fontSize: '16px', marginBottom: '8px' }}>No products found in this category</p>
                                <Link href="/" style={{ color: '#2874f0', fontSize: '14px' }}>Browse all products</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
