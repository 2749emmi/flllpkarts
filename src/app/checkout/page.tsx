'use client';
import { useState, useEffect, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, CheckCircle, Package, Zap, Clock, ChevronRight, CreditCard, Gift } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { products, Product } from '@/data/products';

type Step = 'address' | 'payment' | 'success';

const paymentMethods = [
  { id: 'upi', name: 'UPI', desc: 'Pay by any UPI app' },
  { id: 'card', name: 'Credit / Debit / ATM Card', desc: 'Add and secure cards as per RBI guidelines' },
  { id: 'netbanking', name: 'Net Banking', desc: 'Pay using net banking' },
  { id: 'emi', name: 'EMI', desc: 'Pay in easy instalments' },
  { id: 'cod', name: 'Cash on Delivery', desc: 'Pay at your doorstep' },
];

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const inputStyle: React.CSSProperties = {
  padding: '12px 14px', border: '1px solid #e0e0e0', borderRadius: '2px',
  outline: 'none', fontSize: '14px', fontFamily: 'inherit', width: '100%',
  backgroundColor: '#fff', color: '#212121',
};

const round1Ids = ['1001', '1002', '1003', '1004', '1005', '1006', '1007', '1008'];
const round2Ids = ['2001', '2002', '2003', '2004'];

function getDealPrice(price: number) {
  return Math.ceil(price / 2) - 1;
}

function UpsellCard({ product, dealPrice, added, onAdd }: {
  product: Product; dealPrice: number; added: boolean; onAdd: () => void;
}) {
  return (
    <div style={{
      display: 'flex', gap: '14px', padding: '14px 0',
      borderTop: '1px solid #f0f0f0', alignItems: 'center',
    }}>
      <div style={{ width: '80px', height: '80px', position: 'relative', flexShrink: 0 }}>
        <Image src={product.image} alt={product.title} fill style={{ objectFit: 'contain' }} sizes="80px" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          fontSize: '14px', color: '#212121', fontWeight: 500, margin: 0,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {product.title}
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '4px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '18px', fontWeight: 700, color: '#212121' }}>₹{dealPrice}</span>
          {dealPrice < product.price && (
            <span style={{ fontSize: '12px', color: '#878787', textDecoration: 'line-through' }}>₹{product.price}</span>
          )}
          <span style={{ fontSize: '12px', color: '#878787', textDecoration: 'line-through' }}>
            ₹{product.originalPrice.toLocaleString('en-IN')}
          </span>
          <span style={{ fontSize: '12px', color: '#388e3c', fontWeight: 600 }}>99% off</span>
        </div>
        {dealPrice < product.price && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '4px',
            backgroundColor: '#fff8e1', padding: '2px 6px', borderRadius: '2px',
          }}>
            <Gift size={10} color="#e65100" />
            <span style={{ fontSize: '10px', color: '#e65100', fontWeight: 700 }}>
              EXTRA ₹{product.price - dealPrice} OFF — Order Celebration
            </span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
          <span style={{
            backgroundColor: '#388e3c', color: '#fff', fontSize: '11px', fontWeight: 700,
            padding: '0 4px', borderRadius: '2px',
          }}>{product.rating} ★</span>
          <span style={{ fontSize: '11px', color: '#878787' }}>({product.ratingCount})</span>
        </div>
      </div>
      <button
        onClick={() => !added && onAdd()}
        style={{
          flexShrink: 0,
          backgroundColor: added ? '#388e3c' : '#fb641b',
          color: '#fff', border: 'none', borderRadius: '2px',
          padding: '10px 14px', fontWeight: 600, fontSize: '13px',
          cursor: added ? 'default' : 'pointer', fontFamily: 'inherit',
          display: 'flex', alignItems: 'center', gap: '4px',
          whiteSpace: 'nowrap',
        }}
      >
        {added ? (
          <><CheckCircle size={14} /> Added</>
        ) : (
          <>Add @ ₹{dealPrice}</>
        )}
      </button>
    </div>
  );
}

export default function CheckoutPage() {
  const { items, totalItems, totalPrice, clearCart, addToCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<Step>('address');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', email: '', address: '', locality: '', city: '', state: '', pincode: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderId, setOrderId] = useState('');
  const [savedDiscount, setSavedDiscount] = useState(0);
  const [lottiePreloaded, setLottiePreloaded] = useState(false);

  const [upsellRound, setUpsellRound] = useState(0);
  const [upsellAdded, setUpsellAdded] = useState<string[]>([]);
  const [upsellTimer, setUpsellTimer] = useState(120);
  const [upsellProcessing, setUpsellProcessing] = useState(false);

  const round1Products = round1Ids.map(id => products.find(p => p.id === id)).filter(Boolean) as Product[];
  const round2Products = round2Ids.map(id => products.find(p => p.id === id)).filter(Boolean) as Product[];
  const currentRoundProducts = upsellRound === 0 ? round1Products : round2Products;

  const totalOriginalPrice = items.reduce((sum, i) => sum + i.originalPrice * i.quantity, 0);
  const totalDiscount = totalOriginalPrice - totalPrice;

  const upsellTotalDealPrice = upsellAdded.reduce((sum, id) => {
    const p = products.find(pr => pr.id === id);
    return p ? sum + getDealPrice(p.price) : sum;
  }, 0);

  useEffect(() => {
    if (step === 'success' && !orderId) {
      setOrderId(`FK${Date.now().toString(36).toUpperCase()}`);
    }
  }, [step, orderId]);

  useEffect(() => {
    if (step !== 'success') return;
    const iv = setInterval(() => setUpsellTimer(p => (p > 0 ? p - 1 : 0)), 1000);
    return () => clearInterval(iv);
  }, [step, upsellRound]);

  const handleUpsellPay = useCallback(() => {
    if (upsellAdded.length === 0) return;
    setUpsellProcessing(true);

    // Add selected upsell items to the main cart with the discounted deal price
    upsellAdded.forEach(id => {
      const product = products.find(p => p.id === id);
      if (product) {
        const dealPrice = getDealPrice(product.price);
        addToCart({
          ...product,
          price: dealPrice,
          originalPrice: product.price // Show original price as the pre-discount price in cart? Or keep original.
          // Actually, let's keep originalPrice as originalPrice, and price as dealPrice.
        });
      }
    });

    setTimeout(() => {
      setUpsellProcessing(false);
      setUpsellAdded([]);
      setUpsellTimer(120);
      setUpsellRound(0); // Reset round logic
      setStep('address'); // Restart checkout
      window.scrollTo(0, 0);
    }, 1500);
  }, [upsellAdded, addToCart]);

  if (items.length === 0 && step !== 'success') {
    return (
      <div style={{
        minHeight: '80vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f3f6', padding: '20px',
      }}>
        <Package size={64} color="#e0e0e0" strokeWidth={1} />
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#212121', marginTop: '16px' }}>
          No items to checkout
        </h2>
        <Link href="/" style={{
          marginTop: '16px', backgroundColor: '#2874f0', color: '#fff',
          padding: '12px 32px', borderRadius: '2px', textDecoration: 'none', fontWeight: 600, fontSize: '14px',
        }}>
          Continue Shopping
        </Link>
      </div>
    );
  }

  const validateForm = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.phone || !/^\d{10}$/.test(form.phone)) errs.phone = 'Valid 10-digit phone required';
    if (!form.address.trim()) errs.address = 'Address is required';
    if (!form.pincode || !/^\d{6}$/.test(form.pincode)) errs.pincode = 'Valid 6-digit pincode required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.state) errs.state = 'State is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleProceedToPayment = () => {
    if (validateForm()) setStep('payment');
  };

  const handleConfirmOrder = () => {
    if (!selectedMethod) return;
    setProcessing(true);
    setSavedDiscount(totalDiscount);
    setLottiePreloaded(true);
    setTimeout(() => {
      clearCart();
      setStep('success');
      setProcessing(false);
      window.scrollTo(0, 0);
    }, 1500);
  };

  if (step === 'success') {
    const timerMin = Math.floor(upsellTimer / 60);
    const timerSec = upsellTimer % 60;
    const timerStr = `${timerMin}:${timerSec < 10 ? '0' : ''}${timerSec}`;

    const isLastRound = upsellRound >= 2;
    const socialProofCount = upsellRound === 0 ? '2,847' : '1,423';
    const roundLabel = upsellRound === 0 ? 'Exclusive Offer Unlocked' : 'One More Surprise For You!';
    const roundSubtext = upsellRound === 0
      ? <>Flagships starting at just <span style={{ fontWeight: 700, color: '#388e3c' }}>₹99</span> — ships with your current order:</>
      : <>Complete your Apple ecosystem at <span style={{ fontWeight: 700, color: '#388e3c' }}>unbelievable prices</span> — last chance:</>

    if (upsellProcessing) {
      return (
        <div style={{
          minHeight: '100vh', backgroundColor: '#f1f3f6',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px',
        }}>
          <div style={{
            width: '48px', height: '48px', border: '4px solid #e0e0e0', borderTopColor: '#2874f0',
            borderRadius: '50%', animation: 'spin-slow 0.8s linear infinite',
          }} />
          <p style={{ fontSize: '16px', fontWeight: 600, color: '#212121' }}>Processing Payment...</p>
          <p style={{ fontSize: '13px', color: '#878787' }}>Adding items to your order</p>
          <style>{`@keyframes spin-slow { to { transform: rotate(360deg); } }`}</style>
        </div>
      );
    }

    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f1f3f6', padding: '16px 10px 40px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* Order Success Card */}
          <div style={{
            backgroundColor: '#fff', boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)',
            textAlign: 'center', padding: '32px 20px 24px',
          }}>
            <div style={{ width: '100px', height: '100px', margin: '0 auto 8px' }}>
              <DotLottieReact
                src="https://lottie.host/eecc585e-a8e2-43a6-a066-940cc6cc633e/6WcpcXj4ou.lottie"
                autoplay
                loop={false}
              />
            </div>
            {upsellRound === 0 ? (
              <>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#212121', margin: '8px 0 0' }}>
                  Order Placed Successfully!
                </h2>
                <p style={{ fontSize: '13px', color: '#878787', marginTop: '6px' }}>
                  Order ID: <span style={{ color: '#212121', fontWeight: 600 }}>{orderId}</span>
                </p>
                <p style={{ fontSize: '13px', color: '#878787', marginTop: '2px' }}>
                  We&apos;ll send updates to your phone &amp; email
                </p>
                <div style={{
                  margin: '16px auto 0', padding: '10px 20px', backgroundColor: '#f5fff5',
                  border: '1px solid #e8f5e9', display: 'inline-block',
                }}>
                  <span style={{ fontSize: '14px', color: '#388e3c', fontWeight: 600 }}>
                    You saved ₹{savedDiscount.toLocaleString('en-IN')} on this order
                  </span>
                </div>
              </>
            ) : (
              <>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#212121', margin: '8px 0 0' }}>
                  Items Added to Your Order!
                </h2>
                <p style={{ fontSize: '13px', color: '#878787', marginTop: '6px' }}>
                  Payment confirmed — shipping with Order <span style={{ color: '#212121', fontWeight: 600 }}>{orderId}</span>
                </p>
                <div style={{
                  margin: '16px auto 0', padding: '10px 20px', backgroundColor: '#f5fff5',
                  border: '1px solid #e8f5e9', display: 'inline-block',
                }}>
                  <span style={{ fontSize: '14px', color: '#388e3c', fontWeight: 600 }}>
                    Your deals are locked in — arriving soon!
                  </span>
                </div>
              </>
            )}
          </div>

          {/* Upsell section — only show if not past last round */}
          {!isLastRound && (
            <div style={{ backgroundColor: '#fff', boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)', overflow: 'hidden' }}>
              {/* Header */}
              <div style={{
                backgroundColor: '#2874f0', color: '#fff', padding: '12px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{
                    backgroundColor: '#fff', color: '#2874f0', width: '22px', height: '22px',
                    borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 700,
                  }}>3</span>
                  <span style={{ fontWeight: 600, fontSize: '14px', textTransform: 'uppercase' }}>
                    {roundLabel}
                  </span>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  backgroundColor: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '2px',
                }}>
                  <Clock size={14} />
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '14px' }}>
                    {timerStr}
                  </span>
                </div>
              </div>

              {/* Urgency bar */}
              <div style={{
                backgroundColor: '#fff3e0', padding: '8px 20px',
                display: 'flex', alignItems: 'center', gap: '8px',
                borderBottom: '1px solid #ffe0b2',
              }}>
                <Zap size={14} color="#e65100" fill="#e65100" />
                <span style={{ fontSize: '12px', color: '#e65100', fontWeight: 600 }}>
                  {upsellRound === 0
                    ? 'This offer is only for you and expires when the timer runs out'
                    : 'You qualified for a second exclusive round — this will not appear again'}
                </span>
              </div>

              {/* Product cards */}
              <div style={{ padding: '16px 20px' }}>
                <p style={{ fontSize: '13px', color: '#212121', marginBottom: '14px', fontWeight: 400 }}>
                  {roundSubtext}
                </p>

                {currentRoundProducts.map(p => {
                  const dealPrice = getDealPrice(p.price);
                  const added = upsellAdded.includes(p.id);
                  return (
                    <UpsellCard
                      key={p.id}
                      product={p}
                      dealPrice={dealPrice}
                      added={added}
                      onAdd={() => setUpsellAdded(prev => [...prev, p.id])}
                    />
                  );
                })}

                {/* Social proof */}
                <div style={{
                  marginTop: '12px', padding: '8px 12px', backgroundColor: '#fafafa',
                  border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '8px',
                }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#388e3c', flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: '#878787' }}>
                    <span style={{ fontWeight: 600, color: '#212121' }}>{socialProofCount} people</span> added this to their order in the last hour
                  </span>
                </div>
              </div>

              {/* Bottom action */}
              <div style={{
                padding: '14px 20px', borderTop: '1px solid #e0e0e0',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                backgroundColor: '#fafafa',
              }}>
                <Link href="/" style={{
                  fontSize: '12px', color: '#878787', textDecoration: 'none',
                }}>
                  Skip, continue to homepage
                </Link>
                {upsellAdded.length > 0 ? (
                  <button onClick={handleUpsellPay} style={{
                    backgroundColor: '#fb641b', color: '#fff', padding: '10px 24px',
                    borderRadius: '2px', fontSize: '14px', fontWeight: 600,
                    border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                    display: 'flex', alignItems: 'center', gap: '6px',
                  }}>
                    <CreditCard size={16} /> Pay ₹{upsellTotalDealPrice.toLocaleString('en-IN')} Now
                  </button>
                ) : (
                  <Link href="/" style={{
                    backgroundColor: '#2874f0', color: '#fff', padding: '10px 24px',
                    borderRadius: '2px', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
                  }}>
                    Continue Shopping
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Final round — just go home */}
          {isLastRound && (
            <div style={{
              backgroundColor: '#fff', boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)',
              padding: '20px', textAlign: 'center',
            }}>
              <p style={{ fontSize: '14px', color: '#212121', marginBottom: '16px' }}>
                Your complete order will arrive within <span style={{ fontWeight: 700, color: '#388e3c' }}>3-5 business days</span>
              </p>
              <Link href="/" style={{
                backgroundColor: '#2874f0', color: '#fff', padding: '12px 32px',
                borderRadius: '2px', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
                display: 'inline-flex', alignItems: 'center', gap: '6px',
              }}>
                Continue Shopping <ChevronRight size={16} />
              </Link>
            </div>
          )}

        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#f1f3f6', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '16px 10px' }}>
        <div className="checkout-layout">
          {/* Left Column: Steps */}
          <div className="checkout-left">
            {/* Step 1: Address */}
            <div style={{ backgroundColor: '#fff', boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)', marginBottom: '8px' }}>
              <div style={{
                backgroundColor: step === 'address' ? '#2874f0' : '#fff',
                color: step === 'address' ? '#fff' : '#878787',
                padding: '14px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                borderBottom: step !== 'address' ? '1px solid #f0f0f0' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{
                    backgroundColor: step === 'address' ? '#fff' : '#f0f0f0',
                    color: step === 'address' ? '#2874f0' : '#878787',
                    width: '22px', height: '22px', borderRadius: '2px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 600,
                  }}>1</span>
                  <span style={{ fontWeight: 600, fontSize: '14px', textTransform: 'uppercase' }}>
                    Delivery Address
                  </span>
                </div>
                {step !== 'address' && <CheckCircle size={18} color="#388e3c" />}
              </div>

              {step === 'address' && (
                <div style={{ padding: '20px' }}>
                  <div className="checkout-form-grid">
                    <div>
                      <input type="text" placeholder="Name" value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        style={{ ...inputStyle, borderColor: errors.name ? '#ff3e6c' : '#e0e0e0' }}
                      />
                      {errors.name && <p style={{ color: '#ff3e6c', fontSize: '12px', marginTop: '4px' }}>{errors.name}</p>}
                    </div>
                    <div>
                      <input type="text" placeholder="10-digit Mobile Number" value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        style={{ ...inputStyle, borderColor: errors.phone ? '#ff3e6c' : '#e0e0e0' }}
                      />
                      {errors.phone && <p style={{ color: '#ff3e6c', fontSize: '12px', marginTop: '4px' }}>{errors.phone}</p>}
                    </div>
                    <div>
                      <input type="text" placeholder="Pincode" value={form.pincode}
                        onChange={e => setForm({ ...form, pincode: e.target.value })}
                        style={{ ...inputStyle, borderColor: errors.pincode ? '#ff3e6c' : '#e0e0e0' }}
                      />
                      {errors.pincode && <p style={{ color: '#ff3e6c', fontSize: '12px', marginTop: '4px' }}>{errors.pincode}</p>}
                    </div>
                    <div>
                      <input type="text" placeholder="Locality" value={form.locality}
                        onChange={e => setForm({ ...form, locality: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                    <div className="checkout-form-full">
                      <textarea placeholder="Address (Area and Street)" value={form.address}
                        onChange={e => setForm({ ...form, address: e.target.value })}
                        style={{ ...inputStyle, resize: 'none', height: '76px', borderColor: errors.address ? '#ff3e6c' : '#e0e0e0' }}
                      />
                      {errors.address && <p style={{ color: '#ff3e6c', fontSize: '12px', marginTop: '4px' }}>{errors.address}</p>}
                    </div>
                    <div>
                      <input type="text" placeholder="City/District/Town" value={form.city}
                        onChange={e => setForm({ ...form, city: e.target.value })}
                        style={{ ...inputStyle, borderColor: errors.city ? '#ff3e6c' : '#e0e0e0' }}
                      />
                      {errors.city && <p style={{ color: '#ff3e6c', fontSize: '12px', marginTop: '4px' }}>{errors.city}</p>}
                    </div>
                    <div>
                      <select value={form.state} onChange={e => setForm({ ...form, state: e.target.value })}
                        style={{ ...inputStyle, borderColor: errors.state ? '#ff3e6c' : '#e0e0e0', color: form.state ? '#212121' : '#878787' }}
                      >
                        <option value="">Select State</option>
                        {states.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {errors.state && <p style={{ color: '#ff3e6c', fontSize: '12px', marginTop: '4px' }}>{errors.state}</p>}
                    </div>
                    <div>
                      <input type="email" placeholder="Email (optional)" value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  <button onClick={handleProceedToPayment} style={{
                    marginTop: '20px', backgroundColor: '#fb641b', color: '#fff', border: 'none',
                    padding: '14px 40px', fontWeight: 600, borderRadius: '2px', cursor: 'pointer',
                    textTransform: 'uppercase', fontSize: '14px', fontFamily: 'inherit',
                  }}>
                    Deliver Here
                  </button>
                </div>
              )}

              {step !== 'address' && (
                <div style={{ padding: '14px 20px', fontSize: '14px', color: '#212121' }}>
                  <span style={{ fontWeight: 600 }}>{form.name}</span>
                  <span style={{ marginLeft: '12px', color: '#878787' }}>{form.phone}</span>
                  <p style={{ color: '#878787', marginTop: '4px', fontSize: '13px' }}>
                    {form.address}, {form.locality && `${form.locality}, `}{form.city}, {form.state} - {form.pincode}
                  </p>
                </div>
              )}
            </div>

            {/* Step 2: Payment */}
            <div style={{ backgroundColor: '#fff', boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)' }}>
              <div style={{
                backgroundColor: step === 'payment' ? '#2874f0' : '#fff',
                color: step === 'payment' ? '#fff' : '#878787',
                padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '14px',
                borderBottom: step !== 'payment' ? '1px solid #f0f0f0' : 'none',
              }}>
                <span style={{
                  backgroundColor: step === 'payment' ? '#fff' : '#f0f0f0',
                  color: step === 'payment' ? '#2874f0' : '#878787',
                  width: '22px', height: '22px', borderRadius: '2px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '12px', fontWeight: 600,
                }}>2</span>
                <span style={{ fontWeight: 600, fontSize: '14px', textTransform: 'uppercase' }}>
                  Payment Options
                </span>
              </div>

              {step === 'payment' && (
                <div>
                  {paymentMethods.map(pm => (
                    <div key={pm.id}
                      onClick={() => setSelectedMethod(pm.id)}
                      style={{
                        padding: '16px 20px', borderBottom: '1px solid #f0f0f0', cursor: 'pointer',
                        backgroundColor: selectedMethod === pm.id ? '#f5faff' : '#fff',
                        display: 'flex', alignItems: 'center', gap: '14px',
                      }}
                    >
                      <div style={{
                        width: '18px', height: '18px', borderRadius: '50%',
                        border: selectedMethod === pm.id ? '5px solid #2874f0' : '2px solid #c2c2c2',
                        boxSizing: 'border-box', flexShrink: 0,
                      }} />
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: 500, color: '#212121', margin: 0 }}>{pm.name}</p>
                        <p style={{ fontSize: '12px', color: '#878787', margin: '2px 0 0' }}>{pm.desc}</p>
                      </div>
                    </div>
                  ))}
                  <div style={{ padding: '20px' }}>
                    <button disabled={!selectedMethod || processing}
                      onClick={handleConfirmOrder}
                      style={{
                        backgroundColor: processing ? '#bababa' : '#fb641b', color: '#fff', border: 'none',
                        padding: '14px 40px', fontWeight: 600, borderRadius: '2px',
                        cursor: processing ? 'not-allowed' : 'pointer',
                        textTransform: 'uppercase', fontSize: '14px', fontFamily: 'inherit',
                      }}
                    >
                      {processing ? 'Processing...' : 'Confirm Order'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Price Details */}
          <div className="checkout-right">
            <div style={{
              backgroundColor: '#fff', boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)',
              position: 'sticky', top: '106px',
            }}>
              <div style={{
                padding: '14px 20px', borderBottom: '1px solid #e0e0e0',
                fontSize: '14px', fontWeight: 600, color: '#878787', textTransform: 'uppercase',
              }}>
                Price Details
              </div>
              <div style={{ padding: '16px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '14px' }}>
                  <span>Price ({totalItems} item{totalItems > 1 ? 's' : ''})</span>
                  <span>₹{totalOriginalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '14px' }}>
                  <span>Discount</span>
                  <span style={{ color: '#388e3c' }}>− ₹{totalDiscount.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px', fontSize: '14px' }}>
                  <span>Delivery Charges</span>
                  <span style={{ color: '#388e3c' }}>Free</span>
                </div>
                <div style={{ borderTop: '1px dashed #e0e0e0', paddingTop: '14px', marginTop: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 700 }}>
                    <span>Total Amount</span>
                    <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
              <div style={{
                padding: '14px 20px', borderTop: '1px solid #e0e0e0',
                color: '#388e3c', fontSize: '14px', fontWeight: 600,
              }}>
                You will save ₹{totalDiscount.toLocaleString('en-IN')} on this order
              </div>
            </div>

            <div style={{
              marginTop: '8px', display: 'flex', alignItems: 'center', gap: '12px',
              padding: '14px 20px', backgroundColor: '#fff',
              boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)',
            }}>
              <ShieldCheck size={28} color="#878787" />
              <div>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#878787', margin: 0 }}>Safe and Secure Payments</p>
                <p style={{ fontSize: '11px', color: '#878787', margin: '2px 0 0' }}>100% Authentic Products</p>
              </div>
            </div>
          </div>
        </div>

        {/* Preload Lottie off-screen during "Processing..." so it's instant on success */}
        {lottiePreloaded && (
          <div style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}>
            <DotLottieReact
              src="https://lottie.host/eecc585e-a8e2-43a6-a066-940cc6cc633e/6WcpcXj4ou.lottie"
              autoplay={false}
              loop={false}
            />
          </div>
        )}
      </div>
    </div>
  );
}
