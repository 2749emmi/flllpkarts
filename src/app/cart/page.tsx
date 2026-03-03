'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { ArrowLeft, ShoppingCart, Minus, Plus, Trash2, ShieldCheck, Truck, ChevronUp, ChevronDown, Bookmark, Zap } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getProductUrl } from '@/utils/url';

function getDeliveryDate() {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
}

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, totalItems, totalPrice } = useCart();
    const router = useRouter();
    const [priceOpen, setPriceOpen] = useState(true);
    const [qtyOpen, setQtyOpen] = useState<string | null>(null);

    const totalOriginalPrice = items.reduce((sum, item) => sum + item.originalPrice * item.quantity, 0);
    const totalDiscount = totalOriginalPrice - totalPrice;
    const deliveryDate = getDeliveryDate();

    if (items.length === 0) {
        return (
            <div style={{ minHeight: '100vh', backgroundColor: '#fff', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 16px',
                    borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 10,
                }}>
                    <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center' }}>
                        <ArrowLeft size={22} color="#212121" />
                    </button>
                    <span style={{ fontSize: '17px', fontWeight: 600, color: '#212121' }}>My Cart</span>
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
                    <ShoppingCart style={{ width: '100px', height: '100px', color: '#e0e0e0', marginBottom: '20px' }} strokeWidth={1} />
                    <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#212121', marginBottom: '8px' }}>Your cart is empty!</h2>
                    <p style={{ fontSize: '13px', color: '#878787', marginBottom: '24px', textAlign: 'center' }}>
                        Add items to it now.
                    </p>
                    <Link href="/" style={{
                        backgroundColor: '#2874f0', color: '#fff', fontWeight: 700, padding: '12px 32px',
                        borderRadius: '2px', fontSize: '14px', textDecoration: 'none',
                    }}>
                        Shop Now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f1f3f6', paddingBottom: '80px' }}>
            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 16px',
                backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0',
                position: 'sticky', top: 0, zIndex: 10,
            }}>
                <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center' }}>
                    <ArrowLeft size={22} color="#212121" />
                </button>
                <span style={{ fontSize: '17px', fontWeight: 600, color: '#212121' }}>My Cart</span>
            </div>

            {/* Pincode Bar */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 16px', backgroundColor: '#fff', borderBottom: '1px solid #f0f0f0',
            }}>
                <span style={{ fontSize: '13px', color: '#212121' }}>From Saved Addresses</span>
                <button style={{
                    border: '1px solid #2874f0', borderRadius: '16px', padding: '6px 16px',
                    color: '#2874f0', fontSize: '12px', fontWeight: 600, backgroundColor: '#fff',
                }}>
                    Enter Delivery Pincode
                </button>
            </div>

            {/* Cart Items */}
            {items.map(item => {
                const isQtyOpen = qtyOpen === item.id;
                return (
                    <div key={item.id} style={{ backgroundColor: '#fff', marginTop: '8px' }}>
                        {/* Product Card */}
                        <div style={{ padding: '16px', display: 'flex', gap: '12px' }}>
                            {/* Image */}
                            <Link href={getProductUrl(item.title, item.id)} style={{ flexShrink: 0 }}>
                                <div style={{ width: '90px', height: '90px', position: 'relative' }}>
                                    <Image src={item.image} alt={item.title} fill style={{ objectFit: 'contain' }} sizes="90px" />
                                </div>
                            </Link>

                            {/* Details */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <Link href={getProductUrl(item.title, item.id)} style={{ textDecoration: 'none' }}>
                                    <p style={{
                                        fontSize: '14px', color: '#212121', marginBottom: '2px',
                                        overflow: 'hidden', textOverflow: 'ellipsis',
                                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                    }}>
                                        {item.title}
                                    </p>
                                </Link>
                                {item.brand && (
                                    <p style={{ fontSize: '12px', color: '#878787', marginBottom: '4px' }}>
                                        {item.brand}, {item.category}
                                    </p>
                                )}

                                {/* Rating */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                                    <span style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '2px',
                                        backgroundColor: '#388e3c', color: '#fff', fontSize: '10px', fontWeight: 700,
                                        padding: '1px 5px', borderRadius: '2px',
                                    }}>
                                        {item.rating} ★
                                    </span>
                                    <span style={{ fontSize: '11px', color: '#878787' }}>({item.ratingCount})</span>
                                </div>

                                {/* Qty Dropdown */}
                                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '8px' }}>
                                    <button
                                        onClick={() => setQtyOpen(isQtyOpen ? null : item.id)}
                                        style={{
                                            border: '1px solid #e0e0e0', borderRadius: '3px', padding: '4px 12px',
                                            fontSize: '13px', color: '#212121', backgroundColor: '#fff',
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                        }}
                                    >
                                        Qty: {item.quantity}
                                        <ChevronDown size={12} color="#878787" />
                                    </button>
                                    {isQtyOpen && (
                                        <div style={{
                                            position: 'absolute', top: '100%', left: 0, marginTop: '2px',
                                            backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 20, minWidth: '48px',
                                        }}>
                                            {[1, 2, 3, 4, 5].map(q => (
                                                <button key={q} onClick={() => { updateQuantity(item.id, q); setQtyOpen(null); }}
                                                    style={{
                                                        display: 'block', width: '100%', padding: '8px 16px',
                                                        fontSize: '13px', color: q === item.quantity ? '#2874f0' : '#212121',
                                                        fontWeight: q === item.quantity ? 600 : 400,
                                                        textAlign: 'left', backgroundColor: 'transparent',
                                                        borderBottom: q < 5 ? '1px solid #f0f0f0' : 'none',
                                                    }}
                                                >{q}</button>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Price Row */}
                                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                                    <span style={{ fontSize: '12px', color: '#388e3c', fontWeight: 600 }}>↓ {item.discount}%</span>
                                    <span style={{ fontSize: '12px', color: '#878787', textDecoration: 'line-through' }}>
                                        ₹{item.originalPrice.toLocaleString('en-IN')}
                                    </span>
                                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#212121' }}>
                                        ₹{item.price.toLocaleString('en-IN')}
                                    </span>
                                </div>


                            </div>
                        </div>

                        {/* Delivery date */}
                        <div style={{ padding: '0 16px 10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Truck size={14} color="#212121" />
                            <span style={{ fontSize: '12px', color: '#212121' }}>
                                Delivery by <span style={{ fontWeight: 600 }}>{deliveryDate}</span>
                            </span>
                        </div>

                        {/* Action Row */}
                        <div style={{
                            display: 'flex', borderTop: '1px solid #f0f0f0',
                        }}>
                            <button style={{
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                padding: '12px 0', fontSize: '12px', color: '#212121', fontWeight: 500,
                                borderRight: '1px solid #f0f0f0',
                            }}>
                                <Bookmark size={14} color="#878787" /> Save for later
                            </button>
                            <button
                                onClick={() => removeFromCart(item.id)}
                                style={{
                                    flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                    padding: '12px 0', fontSize: '12px', color: '#212121', fontWeight: 500,
                                    borderRight: '1px solid #f0f0f0',
                                }}
                            >
                                <Trash2 size={14} color="#878787" /> Remove
                            </button>
                            <button style={{
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                                padding: '12px 0', fontSize: '12px', color: '#212121', fontWeight: 500,
                            }}>
                                <Zap size={14} color="#878787" /> Buy this now
                            </button>
                        </div>
                    </div>
                );
            })}

            {/* Price Details */}
            <div style={{ backgroundColor: '#fff', marginTop: '8px' }}>
                <button
                    onClick={() => setPriceOpen(v => !v)}
                    style={{
                        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '14px 16px', backgroundColor: 'transparent',
                    }}
                >
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#212121', textTransform: 'uppercase' }}>Price Details</span>
                    {priceOpen ? <ChevronUp size={18} color="#878787" /> : <ChevronDown size={18} color="#878787" />}
                </button>

                {priceOpen && (
                    <div style={{ padding: '0 16px 16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#212121' }}>
                            <span>Price ({totalItems} item{totalItems > 1 ? 's' : ''}) <span style={{ fontSize: '12px', color: '#878787' }}>ⓘ</span></span>
                            <span>₹{totalOriginalPrice.toLocaleString('en-IN')}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#212121' }}>
                            <span>Discount</span>
                            <span style={{ color: '#388e3c' }}>− ₹{totalDiscount.toLocaleString('en-IN')}</span>
                        </div>
                        <div style={{
                            display: 'flex', justifyContent: 'space-between', paddingTop: '12px',
                            borderTop: '1px solid #f0f0f0', fontSize: '16px', fontWeight: 700, color: '#212121',
                        }}>
                            <span>Total Amount</span>
                            <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                        </div>
                    </div>
                )}

                {/* Savings banner */}
                {totalDiscount > 0 && (
                    <div style={{
                        padding: '10px 16px', backgroundColor: '#f0faf0',
                        display: 'flex', alignItems: 'center', gap: '6px', borderTop: '1px solid #e8f5e9',
                    }}>
                        <span style={{ fontSize: '16px' }}>🎉</span>
                        <span style={{ fontSize: '13px', color: '#388e3c', fontWeight: 600 }}>
                            You&apos;ll save ₹{totalDiscount.toLocaleString('en-IN')} on this order!
                        </span>
                    </div>
                )}
            </div>

            {/* Safe & Secure */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 16px',
                backgroundColor: '#fff', marginTop: '8px',
            }}>
                <ShieldCheck size={20} color="#878787" />
                <span style={{ fontSize: '12px', color: '#878787' }}>Safe and Secure Payments. Easy returns. 100% Authentic products.</span>
            </div>

            {/* Sticky Bottom Bar */}
            <div style={{
                position: 'fixed', bottom: 0, left: 0, right: 0,
                backgroundColor: '#fff', borderTop: '1px solid #e0e0e0',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 16px', zIndex: 50,
                boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
            }}>
                <div>
                    <span style={{ fontSize: '12px', color: '#878787', textDecoration: 'line-through', display: 'block' }}>
                        ₹{totalOriginalPrice.toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontSize: '17px', fontWeight: 700, color: '#212121' }}>
                        ₹{totalPrice.toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontSize: '11px', color: '#878787', marginLeft: '4px' }}>ⓘ</span>
                </div>
                <Link href="/checkout" style={{
                    backgroundColor: '#ffc800', color: '#212121', borderRadius: '4px',
                    padding: '12px 32px', fontSize: '15px', fontWeight: 700,
                    textDecoration: 'none', display: 'inline-block',
                }}>
                    Place Order
                </Link>
            </div>
        </div>
    );
}
