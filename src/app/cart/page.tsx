'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Minus, Plus, Trash2, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getProductUrl } from '@/utils/url';

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, totalItems, totalPrice, clearCart } = useCart();

    const totalOriginalPrice = items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
    const totalDiscount = totalOriginalPrice - totalPrice;

    return (
        <div style={{ backgroundColor: '#f1f3f6', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1248px', margin: '0 auto', padding: '16px' }}>
                <div className="md-flex-row" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {/* Main Cart */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        {/* Header */}
                        <div style={{ backgroundColor: '#fff', borderRadius: '4px', padding: '16px', marginBottom: '8px', boxShadow: '0 1px 1px 0 rgba(0,0,0,0.08)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #f0f0f0' }}>
                                <h1 style={{ fontSize: '18px', fontWeight: 700, color: '#212121' }}>
                                    My Cart ({totalItems})
                                </h1>
                                <span style={{ fontSize: '13px', color: '#878787' }}>Deliver to: Select Address</span>
                            </div>
                        </div>

                        {items.length === 0 ? (
                            <div style={{ backgroundColor: '#fff', borderRadius: '4px', padding: '64px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', boxShadow: '0 1px 1px 0 rgba(0,0,0,0.08)' }}>
                                <ShoppingCart style={{ width: '120px', height: '120px', color: '#e0e0e0', marginBottom: '24px' }} strokeWidth={1} />
                                <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#212121', marginBottom: '8px' }}>Your cart is empty!</h2>
                                <p style={{ fontSize: '13px', color: '#878787', marginBottom: '24px', maxWidth: '400px' }}>
                                    Add items to it now. Check out from where you left off, or discover something new.
                                </p>
                                <Link href="/" style={{
                                    backgroundColor: '#2874f0', color: '#fff', fontWeight: 700, padding: '12px 32px', borderRadius: '2px', fontSize: '14px', textDecoration: 'none',
                                }}>
                                    Shop Now
                                </Link>
                            </div>
                        ) : (
                            <>
                                {items.map(item => (
                                    <div key={item.id} style={{
                                        backgroundColor: '#fff', borderRadius: '4px', padding: '16px',
                                        marginBottom: '8px', boxShadow: '0 1px 1px 0 rgba(0,0,0,0.08)',
                                        display: 'flex', gap: '16px', alignItems: 'flex-start',
                                    }}>
                                        {/* Product Image */}
                                        <Link href={getProductUrl(item.title, item.id)} style={{ flexShrink: 0 }}>
                                            <div style={{ width: '112px', height: '112px', position: 'relative' }}>
                                                <Image src={item.image} alt={item.title} fill style={{ objectFit: 'contain' }} sizes="112px" />
                                            </div>
                                        </Link>

                                        {/* Details */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <Link href={getProductUrl(item.title, item.id)} style={{ textDecoration: 'none' }}>
                                                <p style={{ fontSize: '16px', fontWeight: 500, color: '#212121', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {item.title}
                                                </p>
                                            </Link>

                                            {/* Price */}
                                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
                                                <span style={{ fontSize: '18px', fontWeight: 700, color: '#212121' }}>₹{item.price.toLocaleString('en-IN')}</span>
                                                <span style={{ color: '#878787', fontSize: '14px', textDecoration: 'line-through' }}>₹{item.originalPrice.toLocaleString('en-IN')}</span>
                                                <span style={{ color: '#388e3c', fontSize: '14px', fontWeight: 600 }}>{item.discount}% off</span>
                                            </div>

                                            {/* Delivery Info */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                                                <Truck size={14} color="#388e3c" />
                                                <span style={{ fontSize: '13px', color: '#388e3c', fontWeight: 500 }}>Free Delivery</span>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0', border: '1px solid #c2c2c2', borderRadius: '20px', overflow: 'hidden' }}>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={{
                                                        width: '32px', height: '32px', border: 'none', backgroundColor: item.quantity <= 1 ? '#f0f0f0' : '#fff',
                                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}>
                                                        {item.quantity <= 1 ? <Trash2 size={14} color="#878787" /> : <Minus size={14} />}
                                                    </button>
                                                    <span style={{ width: '40px', textAlign: 'center', fontSize: '14px', fontWeight: 700, backgroundColor: '#fff', lineHeight: '32px', borderLeft: '1px solid #c2c2c2', borderRight: '1px solid #c2c2c2' }}>
                                                        {item.quantity}
                                                    </span>
                                                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={{
                                                        width: '32px', height: '32px', border: 'none', backgroundColor: '#fff',
                                                        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    }}>
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <button onClick={() => removeFromCart(item.id)} style={{
                                                    border: 'none', background: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600,
                                                    color: '#212121', textTransform: 'uppercase',
                                                }}>
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Place Order */}
                                <div style={{
                                    backgroundColor: '#fff', borderRadius: '4px', padding: '16px',
                                    boxShadow: '0 1px 1px 0 rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'flex-end',
                                }}>
                                    <Link href="/checkout" style={{
                                        backgroundColor: '#fb641b', color: '#fff',
                                        borderRadius: '2px', padding: '14px 48px', fontSize: '16px', fontWeight: 700,
                                        textDecoration: 'none', textTransform: 'uppercase', display: 'inline-block',
                                    }}>
                                        Place Order
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Price Details Sidebar */}
                    <div className="desktop-only-block" style={{ width: '360px', flexShrink: 0 }}>
                        <div style={{ backgroundColor: '#fff', borderRadius: '4px', padding: '16px', position: 'sticky', top: '100px', boxShadow: '0 1px 1px 0 rgba(0,0,0,0.08)' }}>
                            <h3 style={{ color: '#878787', fontWeight: 700, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f0f0f0' }}>
                                Price Details
                            </h3>
                            <div style={{ fontSize: '14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#212121', marginBottom: '12px' }}>
                                    <span>Price ({totalItems} items)</span>
                                    <span>₹{totalOriginalPrice.toLocaleString('en-IN')}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#212121', marginBottom: '12px' }}>
                                    <span>Discount</span>
                                    <span style={{ color: '#388e3c' }}>− ₹{totalDiscount.toLocaleString('en-IN')}</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#212121', marginBottom: '12px' }}>
                                    <span>Delivery Charges</span>
                                    <span style={{ color: '#388e3c' }}>Free</span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '16px', color: '#212121', paddingTop: '12px', borderTop: '1px solid #f0f0f0' }}>
                                    <span>Total Amount</span>
                                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                                </div>
                                {totalDiscount > 0 && (
                                    <p style={{ color: '#388e3c', fontWeight: 600, fontSize: '14px', marginTop: '12px', textAlign: 'center' }}>
                                        You will save ₹{totalDiscount.toLocaleString('en-IN')} on this order
                                    </p>
                                )}
                            </div>

                            {/* Trust Badges */}
                            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <ShieldCheck size={20} color="#878787" />
                                <span style={{ fontSize: '12px', color: '#878787' }}>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
