import { Star, Tag, Truck, Shield, RotateCcw } from 'lucide-react';
import Image from 'next/image';
import { products } from '@/data/products';
import Link from 'next/link';
import AddToCartButton from '@/components/AddToCartButton';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const product = products.find((p) => p.id === id);

    if (!product) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff' }}>
                <div style={{ textAlign: 'center' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#212121', marginBottom: '8px' }}>Product Not Found</h1>
                    <Link href="/" style={{ color: '#2874f0', fontSize: '14px' }}>Go to Homepage</Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1248px', margin: '0 auto', padding: '12px 16px' }}>
                {/* Breadcrumb */}
                <div style={{ fontSize: '12px', color: '#878787', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <Link href="/" style={{ color: '#878787', textDecoration: 'none' }}>Home</Link>
                    <span>&gt;</span>
                    <Link href={`/category/${product.category}`} style={{ color: '#878787', textDecoration: 'none', textTransform: 'capitalize' }}>{product.category}</Link>
                    <span>&gt;</span>
                    <span style={{ color: '#212121' }}>{product.title}</span>
                </div>

                <div className="md-flex-row" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Left: Image */}
                    <div style={{ flex: '0 0 40%' }}>
                        <div style={{ position: 'sticky', top: '100px' }}>
                            {/* BBD Badge */}
                            {product.discount >= 50 && (
                                <div style={{
                                    backgroundColor: '#c31432', color: '#fff', fontSize: '12px', fontWeight: 800,
                                    padding: '4px 12px', borderRadius: '4px 4px 0 0', display: 'inline-block',
                                }}>
                                    🔥 BIG BILLION DAYS DEAL — {product.discount}% OFF
                                </div>
                            )}
                            <div style={{ border: '1px solid #e0e0e0', borderRadius: product.discount >= 50 ? '0 4px 4px 4px' : '4px', padding: '16px', position: 'relative', height: '400px', backgroundColor: '#fff' }}>
                                <Image src={product.image} alt={product.title} fill style={{ objectFit: 'contain', padding: '24px' }} sizes="400px" />
                            </div>
                            <AddToCartButton product={product} />
                        </div>
                    </div>

                    {/* Right: Details */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <h1 style={{ fontSize: '18px', fontWeight: 500, color: '#212121', marginBottom: '8px', lineHeight: 1.4 }}>{product.title}</h1>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <span style={{ backgroundColor: '#388e3c', color: '#fff', fontSize: '12px', fontWeight: 700, padding: '2px 8px', borderRadius: '2px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                {product.rating} <Star style={{ width: '12px', height: '12px' }} fill="white" />
                            </span>
                            <span style={{ color: '#878787', fontSize: '13px', fontWeight: 500 }}>{product.ratingCount} Ratings & {product.reviewCount} Reviews</span>
                        </div>

                        <div style={{ marginBottom: '4px' }}>
                            <span style={{ color: '#388e3c', fontSize: '12px', fontWeight: 700 }}>Big Billion Days Special Price</span>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '28px', fontWeight: 700, color: '#212121' }}>₹{product.price.toLocaleString('en-IN')}</span>
                            <span style={{ color: '#878787', fontSize: '16px', textDecoration: 'line-through' }}>₹{product.originalPrice.toLocaleString('en-IN')}</span>
                            <span style={{ color: '#388e3c', fontSize: '16px', fontWeight: 700 }}>{product.discount}% off</span>
                        </div>

                        {/* Offers */}
                        <div style={{ marginBottom: '20px' }}>
                            <h3 style={{ fontWeight: 700, fontSize: '14px', color: '#212121', marginBottom: '8px' }}>Available offers</h3>
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {product.offers.map((offer, i) => (
                                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '13px', color: '#212121', marginBottom: '8px' }}>
                                        <Tag style={{ width: '14px', height: '14px', color: '#388e3c', marginTop: '2px', flexShrink: 0 }} />
                                        <span dangerouslySetInnerHTML={{ __html: offer.replace(/^([^:]+:)/, '<strong>$1</strong>') }} />
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Delivery Icons */}
                        <div style={{ display: 'flex', gap: '24px', marginBottom: '20px', padding: '16px 0', borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', flexWrap: 'wrap' }}>
                            {[
                                { icon: <Truck style={{ width: '20px', height: '20px', color: '#878787' }} />, label: 'Free Delivery' },
                                { icon: <RotateCcw style={{ width: '20px', height: '20px', color: '#878787' }} />, label: '7 Day Return' },
                                { icon: <Shield style={{ width: '20px', height: '20px', color: '#878787' }} />, label: 'Warranty' },
                                { icon: <span style={{ fontSize: '18px', fontWeight: 700, color: '#878787' }}>₹</span>, label: 'COD Available' },
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', width: '72px', textAlign: 'center' }}>
                                    {item.icon}
                                    <span style={{ fontSize: '11px', color: '#212121', fontWeight: 500 }}>{item.label}</span>
                                </div>
                            ))}
                        </div>

                        {/* Highlights */}
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', gap: '32px', flexWrap: 'wrap' }}>
                                <span style={{ color: '#878787', fontSize: '13px', fontWeight: 500, width: '96px', flexShrink: 0 }}>Highlights</span>
                                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '13px', color: '#212121' }}>
                                    {product.highlights.map((h, i) => (
                                        <li key={i} style={{ marginBottom: '6px' }}>{h}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Description */}
                        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '20px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#212121', marginBottom: '12px' }}>Product Description</h3>
                            <p style={{ fontSize: '14px', color: '#878787', lineHeight: 1.7 }}>{product.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
