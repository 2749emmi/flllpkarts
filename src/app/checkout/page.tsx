'use client';
import { useState, useEffect, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ShieldCheck, CheckCircle, Package, Zap, Clock, ChevronRight, ChevronDown, Gift, MapPin, Tag, Truck, Check, Banknote } from 'lucide-react';
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { products, Product } from '@/data/products';

type Step = 'address' | 'summary' | 'payment' | 'success' | 'upsell_payment';

const states = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh',
  'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
  'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
];

const paymentMethods = [
  { 
    id: 'phonepe', 
    name: 'PhonePe', 
    desc: 'Pay using PhonePe UPI', 
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTYgMkM4LjI2OCAyIDIgOC4yNjggMiAxNkMyIDIzLjczMiA4LjI2OCAzMCAxNiAzMEMyMy43MzIgMzAgMzAgMjMuNzMyIDMwIDE2QzMwIDguMjY4IDIzLjczMiAyIDE2IDJaIiBmaWxsPSJ3aGl0ZSIvPjxwYXRoIGQ9Ik0xNiA2QzEwLjQ3NyA2IDYgMTAuNDc3IDYgMTZDNiAyMS41MjMgMTAuNDc3IDI2IDE2IDI2QzIxLjUyMyAyNiAyNiAyMS41MjMgMjYgMTZDMjYgMTAuNDc3IDIxLjUyMyA2IDE2IDZaTTE4IDIwSDE0VjEySDE4VjIwWiIgZmlsbD0iIzVGMjU5RiIvPjwvc3ZnPg==',
    disabled: false 
  },
  { 
    id: 'paytm', 
    name: 'Paytm', 
    desc: 'Pay using Paytm UPI', 
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNMTYgNkMxMC40NzcgNiA2IDEwLjQ3NyA2IDE2QzYgMjEuNTIzIDEwLjQ3NyAyNiAxNiAyNkMyMS41MjMgMjYgMjYgMjEuNTIzIDI2IDE2QzI2IDEwLjQ3NyAyMS41MjMgNiAxNiA2Wk0xOCAyMEgxNFYxMkgxOFYyMFoiIGZpbGw9IiMwMEJBRjIiLz48L3N2Zz4=',
    disabled: false 
  },
  { 
    id: 'gpay', 
    name: 'Google Pay', 
    desc: 'Pay using Google Pay', 
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNMTYgNkMxMC40NzcgNiA2IDEwLjQ3NyA2IDE2QzYgMjEuNTIzIDEwLjQ3NyAyNiAxNiAyNkMyMS41MjMgMjYgMjYgMjEuNTIzIDI2IDE2QzI2IDEwLjQ3NyAyMS41MjMgNiAxNiA2Wk0xOSAxOEgxM1YxNEgxOVYxOFoiIGZpbGw9IiM0Mjg1RjQiLz48L3N2Zz4=',
    disabled: false 
  },
  { 
    id: 'upi', 
    name: 'UPI', 
    desc: 'Open any UPI app on your phone', 
    logo: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNCIgZmlsbD0id2hpdGUiLz48cGF0aCBkPSJNMTYgNkMxMC40NzcgNiA2IDEwLjQ3NyA2IDE2QzYgMjEuNTIzIDEwLjQ3NyAyNiAxNiAyNkMyMS41MjMgMjYgMjYgMjEuNTIzIDI2IDE2QzI2IDEwLjQ3NyAyMS41MjMgNiAxNiA2Wk0xOSAxOEgxM1YxNEgxOVYxOFoiIGZpbGw9IiNGRjk5MzMiLz48L3N2Zz4=',
    disabled: false 
  },
  { 
    id: 'cod', 
    name: 'Cash on Delivery', 
    desc: 'Not available in your pincode', 
    logo: null,
    disabled: true 
  },
];

const round1Ids = ['1001', '1002', '1003', '1004', '1005', '1006', '1007', '1008'];
const round2Ids = ['2001', '2002', '2003', '2004'];

function getDealPrice(price: number) {
  return Math.ceil(price / 2) - 1;
}

function getDeliveryDate() {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
}

/* ============ STEPPER COMPONENT ============ */
function StepIndicator({ current }: { current: 'address' | 'summary' | 'payment' }) {
  const steps = [
    { key: 'address', label: 'Address', num: 1 },
    { key: 'summary', label: 'Order Summary', num: 2 },
    { key: 'payment', label: 'Payment', num: 3 },
  ] as const;

  const currentIdx = steps.findIndex(s => s.key === current);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 24px',
      backgroundColor: '#fff',
    }}>
      {steps.map((s, i) => {
        const isDone = i < currentIdx;
        const isActive = i === currentIdx;
        const isUpcoming = i > currentIdx;
        return (
          <div key={s.key} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '56px' }}>
              <div style={{
                width: '28px', height: '28px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backgroundColor: isDone ? '#fff' : isActive ? '#2874f0' : '#fff',
                border: isDone ? '2px solid #388e3c' : isActive ? 'none' : '2px solid #c2c2c2',
                color: isDone ? '#388e3c' : isActive ? '#fff' : '#c2c2c2',
                fontSize: '12px', fontWeight: 700,
              }}>
                {isDone ? <Check size={16} strokeWidth={3} /> : s.num}
              </div>
              <span style={{
                fontSize: '10px', fontWeight: isActive ? 700 : 400, marginTop: '4px',
                color: isDone ? '#388e3c' : isActive ? '#2874f0' : '#878787',
                whiteSpace: 'nowrap',
              }}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div style={{
                width: '40px', height: '2px', margin: '0 4px',
                backgroundColor: isDone ? '#388e3c' : '#e0e0e0',
                marginBottom: '16px',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ============ UPSELL CARD ============ */
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

/* ============ MAIN CHECKOUT PAGE ============ */
export default function CheckoutPage() {
  const { items, totalItems, totalPrice, clearCart, addToCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState<Step>('address');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [processing, setProcessing] = useState(false);
  const [form, setForm] = useState({
    name: '', phone: '', pincode: '', city: '', state: '', house: '', road: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [orderId, setOrderId] = useState('');
  const [savedDiscount, setSavedDiscount] = useState(0);
  const [lottiePreloaded, setLottiePreloaded] = useState(false);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const [upsellRound, setUpsellRound] = useState(0);
  const [upsellTimer, setUpsellTimer] = useState(120);
  const [selectedUpsellItem, setSelectedUpsellItem] = useState<{ product: Product, dealPrice: number } | null>(null);

  const round1Products = round1Ids.map(id => products.find(p => p.id === id)).filter(Boolean) as Product[];
  const round2Products = round2Ids.map(id => products.find(p => p.id === id)).filter(Boolean) as Product[];

  const totalOriginalPrice = items.reduce((sum, i) => sum + i.originalPrice * i.quantity, 0);
  const totalDiscount = totalOriginalPrice - totalPrice;
  const deliveryDate = getDeliveryDate();

  useEffect(() => {
    if (step === 'success' && !orderId) {
      setOrderId(`FK${Date.now().toString(36).toUpperCase()}`);
    }
  }, [step, orderId]);

  const [completedOrderItems, setCompletedOrderItems] = useState<any[]>([]);

  useEffect(() => {
    if ((step !== 'success' && step !== 'upsell_payment') || upsellRound >= 2) return;
    const iv = setInterval(() => setUpsellTimer(p => {
      if (p <= 1) {
        setUpsellRound(r => r + 1);
        if (step === 'upsell_payment') setStep('success');
        return 120;
      }
      return p - 1;
    }), 1000);
    return () => clearInterval(iv);
  }, [step, upsellRound]);

  const [processingUpsell, setProcessingUpsell] = useState(false);

  const handleInitiateUpsellPurchase = useCallback((product: Product) => {
    const dealPrice = getDealPrice(product.price);
    setSelectedUpsellItem({ product, dealPrice });
    setStep('upsell_payment');
    window.scrollTo(0, 0);
  }, []);

  const handleFinalizeUpsellPurchase = useCallback(() => {
    if (!selectedUpsellItem) return;
    
    // Initialize Razorpay payment for upsell
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      const { product, dealPrice } = selectedUpsellItem;
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_3zT42YgMgCfOim',
        amount: dealPrice * 100, // Amount in paise
        currency: 'INR',
        name: 'Flipkart',
        description: `Add-on: ${product.title}`,
        image: 'https://www.flipkart.com/favicon.ico',
        handler: function (response: any) {
          // Payment successful
          console.log('Upsell payment successful:', response);
          setProcessingUpsell(true);
          setStep('success');
          window.scrollTo(0, 0);

          setTimeout(() => {
            setCompletedOrderItems(prev => {
              if (prev.some(item => item.id === product.id)) return prev;
              return [
                ...prev,
                {
                  ...product,
                  price: dealPrice,
                  originalPrice: product.price,
                  quantity: 1
                }
              ];
            });
            setProcessingUpsell(false);
            setSelectedUpsellItem(null);
          }, 1500);
        },
        prefill: {
          name: form.name,
          contact: form.phone,
        },
        theme: {
          color: '#2874f0',
        },
        modal: {
          ondismiss: function() {
            setProcessingUpsell(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert('Payment failed. Please try again.');
        setProcessingUpsell(false);
      });
      
      setProcessingUpsell(true);
      rzp.open();
    } else {
      alert('Payment gateway is loading. Please try again in a moment.');
    }
  }, [selectedUpsellItem, form.name, form.phone]);

  /* ---- Empty cart guard ---- */
  if (items.length === 0 && step !== 'success' && step !== 'upsell_payment' && !processingUpsell) {
    return (
      <div
        suppressHydrationWarning
        style={{
          minHeight: '100vh', display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', backgroundColor: '#f1f3f6', padding: '20px',
        }}
      >
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
    if (!form.phone || !/^\d{10}$/.test(form.phone)) errs.phone = 'Valid 10-digit number required';
    if (!form.pincode || !/^\d{6}$/.test(form.pincode)) errs.pincode = 'Valid 6-digit pincode required';
    if (!form.city.trim()) errs.city = 'City is required';
    if (!form.state) errs.state = 'State is required';
    if (!form.house.trim()) errs.house = 'House/building is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveAddress = () => {
    if (validateForm()) {
      setStep('summary');
      window.scrollTo(0, 0);
    }
  };

  const handleContinueToPayment = () => {
    setStep('payment');
    window.scrollTo(0, 0);
  };

  const handleConfirmOrder = () => {
    if (!selectedMethod) return;
    
    // Initialize Razorpay payment
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_live_3zT42YgMgCfOim',
        amount: totalPrice * 100, // Amount in paise
        currency: 'INR',
        name: 'Flipkart',
        description: `Order for ${totalItems} item(s)`,
        image: 'https://www.flipkart.com/favicon.ico',
        handler: function (response: any) {
          // Payment successful
          console.log('Payment successful:', response);
          setProcessing(true);
          setSavedDiscount(totalDiscount);
          setLottiePreloaded(true);
          setCompletedOrderItems([...items]);
          setTimeout(() => {
            clearCart();
            setStep('success');
            setProcessing(false);
            window.scrollTo(0, 0);
          }, 1500);
        },
        prefill: {
          name: form.name,
          contact: form.phone,
        },
        notes: {
          address: `${form.house}, ${form.road}, ${form.city}, ${form.state} - ${form.pincode}`,
        },
        theme: {
          color: '#2874f0',
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        alert('Payment failed. Please try again.');
        setProcessing(false);
      });
      
      setProcessing(true);
      rzp.open();
    } else {
      // Fallback if Razorpay not loaded
      alert('Payment gateway is loading. Please try again in a moment.');
    }
  };

  const stepTitle = step === 'address' ? 'Add Delivery Address' : step === 'summary' ? 'Order Summary' : step === 'payment' ? 'Payment' : '';

  /* ============ UPSELL PAYMENT SCREEN (unchanged logic) ============ */
  if (step === 'upsell_payment' && selectedUpsellItem) {
    const { product, dealPrice } = selectedUpsellItem;
    return (
      <div suppressHydrationWarning style={{ padding: '20px 0', backgroundColor: '#f1f3f6', minHeight: '100vh' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '4px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#212121', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ backgroundColor: '#2874f0', color: '#fff', width: '24px', height: '24px', borderRadius: '2px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>3</span>
              Complete Payment
            </h2>
            <div style={{ display: 'flex', gap: '16px', padding: '16px', border: '1px solid #f0f0f0', borderRadius: '4px', marginBottom: '20px' }}>
              <div style={{ width: '80px', height: '80px', position: 'relative', flexShrink: 0 }}>
                <Image src={product.image} alt={product.title} fill style={{ objectFit: 'contain' }} sizes="80px" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '16px', color: '#212121', margin: '0 0 8px', fontWeight: 500 }}>{product.title}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '20px', fontWeight: 600, color: '#212121' }}>₹{dealPrice.toLocaleString('en-IN')}</span>
                  <span style={{ fontSize: '14px', color: '#878787', textDecoration: 'line-through' }}>₹{product.price.toLocaleString('en-IN')}</span>
                  <span style={{ fontSize: '13px', color: '#388e3c', fontWeight: 600 }}>99% off</span>
                </div>
              </div>
            </div>
            <div style={{ marginBottom: '24px' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#212121', marginBottom: '12px' }}>Select Payment Method for this item</p>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '4px', cursor: 'pointer', marginBottom: '12px', backgroundColor: selectedMethod === 'upi' ? '#f5faff' : '#fff' }}>
                <input type="radio" name="upsell_payment" value="upi" checked={selectedMethod === 'upi'} onChange={() => setSelectedMethod('upi')} style={{ width: '16px', height: '16px', accentColor: '#2874f0' }} />
                <span style={{ fontSize: '14px', color: '#212121' }}>UPI (Google Pay, PhonePe, Paytm)</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', border: '1px solid #e0e0e0', borderRadius: '4px', cursor: 'pointer', backgroundColor: selectedMethod === 'card' ? '#f5faff' : '#fff' }}>
                <input type="radio" name="upsell_payment" value="card" checked={selectedMethod === 'card'} onChange={() => setSelectedMethod('card')} style={{ width: '16px', height: '16px', accentColor: '#2874f0' }} />
                <span style={{ fontSize: '14px', color: '#212121' }}>Credit / Debit / ATM Card</span>
              </label>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
              <button onClick={() => setStep('success')} style={{ background: 'none', border: 'none', color: '#212121', fontSize: '14px', fontWeight: 600, cursor: 'pointer', padding: '12px 24px' }} disabled={processingUpsell}>Cancel</button>
              <button onClick={handleFinalizeUpsellPurchase} disabled={!selectedMethod || processingUpsell} style={{
                backgroundColor: selectedMethod ? '#fb641b' : '#e0e0e0',
                color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '2px',
                fontSize: '16px', fontWeight: 600, cursor: selectedMethod ? 'pointer' : 'not-allowed',
                boxShadow: selectedMethod ? '0 1px 2px 0 rgba(0,0,0,.2)' : 'none', minWidth: '200px',
              }}>
                {processingUpsell ? 'Processing...' : `Pay ₹${dealPrice.toLocaleString('en-IN')}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ============ SUCCESS / UPSELL SCREEN (unchanged logic) ============ */
  if (step === 'success' || processingUpsell) {
    if (processingUpsell) {
      return (
        <div style={{
          minHeight: '100vh', backgroundColor: '#f1f3f6',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px',
        }}>
          <div style={{
            width: '48px', height: '48px', border: '4px solid #e0e0e0', borderTopColor: '#388e3c',
            borderRadius: '50%', animation: 'spin-slow 0.8s linear infinite',
          }} />
          <p style={{ fontSize: '16px', fontWeight: 600, color: '#212121' }}>Securing Your Deal...</p>
          <p style={{ fontSize: '13px', color: '#878787' }}>Adding flagged items to order {orderId}</p>
          <style>{`@keyframes spin-slow { to { transform: rotate(360deg); } }`}</style>
        </div>
      );
    }

    const timerMin = Math.floor(upsellTimer / 60);
    const timerSec = upsellTimer % 60;
    const timerStr = `${timerMin}:${timerSec < 10 ? '0' : ''}${timerSec}`;

    const isLastRound = upsellRound >= 2;
    const socialProofCount = upsellRound === 0 ? '2,847' : '1,423';
    const roundLabel = upsellRound === 0 ? 'Exclusive Offer Unlocked' : 'One More Surprise For You!';
    const roundSubtext = upsellRound === 0
      ? <>Flagships starting at just <span style={{ fontWeight: 700, color: '#388e3c' }}>₹99</span> — ships with your current order:</>
      : <>Complete your Apple ecosystem at <span style={{ fontWeight: 700, color: '#388e3c' }}>unbelievable prices</span> — last chance:</>;

    const currentRoundProducts = (upsellRound === 0 ? round1Products : round2Products)
      .filter(p => !completedOrderItems.some(ci => ci.id === p.id));

    if (currentRoundProducts.length === 0 && !isLastRound && step === 'success') {
      setTimeout(() => {
        setUpsellRound(p => p + 1);
        setUpsellTimer(120);
      }, 500);
    }

    return (
      <div suppressHydrationWarning style={{ minHeight: '100vh', backgroundColor: '#f1f3f6', padding: '16px 10px 40px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ backgroundColor: '#fff', boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)', textAlign: 'center', padding: '32px 20px 24px' }}>
            <div style={{ width: '100px', height: '100px', margin: '0 auto 8px' }}>
              <DotLottieReact src="https://lottie.host/eecc585e-a8e2-43a6-a066-940cc6cc633e/6WcpcXj4ou.lottie" autoplay loop={false} />
            </div>
            {upsellRound === 0 ? (
              <>
                <div style={{ marginBottom: '16px' }}>
                  <Link href="/" style={{ display: 'inline-block', backgroundColor: '#2874f0', color: '#fff', padding: '8px 24px', borderRadius: '2px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>Continue Shopping</Link>
                </div>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#212121', margin: '8px 0 0' }}>Order Placed Successfully!</h2>
                <p style={{ fontSize: '13px', color: '#878787', marginTop: '6px' }}>Order ID: <span style={{ color: '#212121', fontWeight: 600 }}>{orderId}</span></p>
                <p style={{ fontSize: '13px', color: '#878787', marginTop: '2px' }}>We&apos;ll send updates to your phone &amp; email</p>
              </>
            ) : (
              <>
                <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#212121', margin: '8px 0 0' }}>Items Added to Your Order!</h2>
                <p style={{ fontSize: '13px', color: '#878787', marginTop: '6px' }}>Payment confirmed — shipping with Order <span style={{ color: '#212121', fontWeight: 600 }}>{orderId}</span></p>
                <div style={{ margin: '16px auto 0', padding: '10px 20px', backgroundColor: '#f5fff5', border: '1px solid #e8f5e9', display: 'inline-block' }}>
                  <span style={{ fontSize: '14px', color: '#388e3c', fontWeight: 600 }}>Your deals are locked in — arriving soon!</span>
                </div>
                <p style={{ fontSize: '14px', color: '#212121', marginTop: '12px' }}>Your complete order will arrive within 3-5 business days</p>
                <div style={{ marginTop: '16px' }}>
                  <Link href="/" style={{ display: 'inline-block', backgroundColor: '#2874f0', color: '#fff', padding: '8px 24px', borderRadius: '2px', textDecoration: 'none', fontWeight: 600, fontSize: '14px' }}>Continue Shopping</Link>
                </div>
              </>
            )}
            <div style={{ marginTop: '24px', textAlign: 'left', borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#212121', marginBottom: '12px' }}>Items in this order:</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {completedOrderItems.map((item, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ width: '50px', height: '50px', position: 'relative', flexShrink: 0, border: '1px solid #f0f0f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <Image src={item.image} alt={item.title} fill style={{ objectFit: 'contain' }} sizes="50px" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '13px', color: '#212121', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                      <p style={{ fontSize: '12px', color: '#878787', margin: '2px 0 0' }}>Qty: {item.quantity} | ₹{item.price.toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {upsellRound === 0 && (
              <div style={{ margin: '20px auto 0', padding: '10px 20px', backgroundColor: '#f5fff5', border: '1px solid #e8f5e9', display: 'inline-block' }}>
                <span style={{ fontSize: '14px', color: '#388e3c', fontWeight: 600 }}>You saved ₹{savedDiscount.toLocaleString('en-IN')} on this order</span>
              </div>
            )}
          </div>

          {!isLastRound && (
            <div style={{ backgroundColor: '#fff', boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)', overflow: 'hidden' }}>
              <div style={{ backgroundColor: '#2874f0', color: '#fff', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ backgroundColor: '#fff', color: '#2874f0', width: '22px', height: '22px', borderRadius: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>3</span>
                  <span style={{ fontWeight: 600, fontSize: '14px', textTransform: 'uppercase' }}>{roundLabel}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: 'rgba(255,255,255,0.15)', padding: '4px 10px', borderRadius: '2px' }}>
                  <Clock size={14} />
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '14px' }}>{timerStr}</span>
                </div>
              </div>
              <div style={{ backgroundColor: '#fff3e0', padding: '8px 20px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #ffe0b2' }}>
                <Zap size={14} color="#e65100" fill="#e65100" />
                <span style={{ fontSize: '12px', color: '#e65100', fontWeight: 600 }}>
                  {upsellRound === 0 ? 'This offer is only for you and expires when the timer runs out' : 'You qualified for a second exclusive round — this will not appear again'}
                </span>
              </div>
              <div style={{ padding: '16px 20px' }}>
                <p style={{ fontSize: '13px', color: '#212121', marginBottom: '14px', fontWeight: 400 }}>{roundSubtext}</p>
                {currentRoundProducts.map(p => {
                  const dealPrice = getDealPrice(p.price);
                  return <UpsellCard key={p.id} product={p} dealPrice={dealPrice} added={false} onAdd={() => handleInitiateUpsellPurchase(p)} />;
                })}
                <div style={{ marginTop: '12px', padding: '8px 12px', backgroundColor: '#fafafa', border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#388e3c', flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: '#878787' }}>
                    <span style={{ fontWeight: 600, color: '#212121' }}>{socialProofCount} people</span> added this to their order in the last hour
                  </span>
                </div>
              </div>
              <div style={{ padding: '14px 20px', borderTop: '1px solid #e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'end', backgroundColor: '#fafafa' }}>
                <Link href="/" style={{ backgroundColor: '#2874f0', color: '#fff', padding: '10px 24px', borderRadius: '2px', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>Continue Shopping</Link>
              </div>
            </div>
          )}

          {isLastRound && (
            <div style={{ backgroundColor: '#fff', boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)', padding: '20px', textAlign: 'center' }}>
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

  /* ============ MAIN CHECKOUT FLOW ============ */
  const fieldStyle: React.CSSProperties = {
    padding: '14px', border: '1px solid #e0e0e0', borderRadius: '4px',
    outline: 'none', fontSize: '14px', fontFamily: 'inherit', width: '100%',
    backgroundColor: '#fff', color: '#212121',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '12px', color: '#878787', fontWeight: 500, marginBottom: '6px', display: 'block',
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#fff', paddingBottom: step === 'summary' ? '80px' : step === 'payment' ? '0' : '0' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 16px',
        borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0, backgroundColor: '#fff', zIndex: 10,
      }}>
        <button onClick={() => {
          if (step === 'payment') setStep('summary');
          else if (step === 'summary') setStep('address');
          else router.back();
        }} style={{ display: 'flex', alignItems: 'center' }}>
          <ArrowLeft size={22} color="#212121" />
        </button>
        <span style={{ fontSize: '17px', fontWeight: 600, color: '#212121' }}>{stepTitle}</span>
      </div>

      {/* Step Indicator */}
      <StepIndicator current={step as 'address' | 'summary' | 'payment'} />
      <div style={{ height: '8px', backgroundColor: '#f1f3f6' }} />

      {/* ====== STEP 1: ADDRESS ====== */}
      {step === 'address' && (
        <div style={{ backgroundColor: '#fff', padding: '0 16px 24px' }}>
          {/* Contact Details */}
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#212121', padding: '16px 0 12px', letterSpacing: '0.5px' }}>
            CONTACT DETAILS
          </h3>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Full Name</label>
            <input type="text" placeholder="Full Name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={{ ...fieldStyle, borderColor: errors.name ? '#ff3e6c' : '#e0e0e0' }}
            />
            {errors.name && <p style={{ color: '#ff3e6c', fontSize: '11px', marginTop: '4px' }}>{errors.name}</p>}
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>Mobile Number</label>
            <input type="tel" placeholder="10-digit Mobile Number" value={form.phone}
              onChange={e => setForm({ ...form, phone: e.target.value })}
              style={{ ...fieldStyle, borderColor: errors.phone ? '#ff3e6c' : '#e0e0e0' }}
            />
            {errors.phone && <p style={{ color: '#ff3e6c', fontSize: '11px', marginTop: '4px' }}>{errors.phone}</p>}
          </div>

          {/* Address */}
          <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#212121', padding: '0 0 12px', letterSpacing: '0.5px' }}>
            ADDRESS
          </h3>

          {/* Pincode + City */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>Pincode</label>
              <div style={{ position: 'relative' }}>
                <input type="text" placeholder="Pincode" value={form.pincode}
                  onChange={e => setForm({ ...form, pincode: e.target.value })}
                  style={{ ...fieldStyle, borderColor: errors.pincode ? '#ff3e6c' : form.pincode.length === 6 ? '#388e3c' : '#e0e0e0' }}
                />
                {form.pincode.length === 6 && /^\d{6}$/.test(form.pincode) && (
                  <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}>
                    <CheckCircle size={18} color="#388e3c" />
                  </div>
                )}
              </div>
              {errors.pincode && <p style={{ color: '#ff3e6c', fontSize: '11px', marginTop: '4px' }}>{errors.pincode}</p>}
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>City</label>
              <input type="text" placeholder="City" value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                style={{ ...fieldStyle, borderColor: errors.city ? '#ff3e6c' : '#e0e0e0' }}
              />
              {errors.city && <p style={{ color: '#ff3e6c', fontSize: '11px', marginTop: '4px' }}>{errors.city}</p>}
            </div>
          </div>

          {/* State */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>State</label>
            <select value={form.state} onChange={e => setForm({ ...form, state: e.target.value })}
              style={{ ...fieldStyle, borderColor: errors.state ? '#ff3e6c' : '#e0e0e0', color: form.state ? '#212121' : '#878787', appearance: 'auto' }}
            >
              <option value="">Select State</option>
              {states.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.state && <p style={{ color: '#ff3e6c', fontSize: '11px', marginTop: '4px' }}>{errors.state}</p>}
          </div>

          {/* House No */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>House No., Building Name</label>
            <input type="text" placeholder="House No., Building Name" value={form.house}
              onChange={e => setForm({ ...form, house: e.target.value })}
              style={{ ...fieldStyle, borderColor: errors.house ? '#ff3e6c' : '#e0e0e0' }}
            />
            {errors.house && <p style={{ color: '#ff3e6c', fontSize: '11px', marginTop: '4px' }}>{errors.house}</p>}
          </div>

          {/* Road Name */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Road Name, Area, Colony</label>
            <input type="text" placeholder="Road Name, Area, Colony" value={form.road}
              onChange={e => setForm({ ...form, road: e.target.value })}
              style={fieldStyle}
            />
          </div>

          {/* Save Address Button */}
          <button onClick={handleSaveAddress} style={{
            width: '100%', backgroundColor: '#ffc800', color: '#212121', border: 'none',
            padding: '14px', borderRadius: '4px', fontSize: '15px', fontWeight: 700,
            textTransform: 'uppercase', fontFamily: 'inherit', letterSpacing: '0.5px',
          }}>
            SAVE ADDRESS
          </button>
        </div>
      )}

      {/* ====== STEP 2: ORDER SUMMARY ====== */}
      {step === 'summary' && (
        <div>
          {/* Deliver to card */}
          <div style={{ backgroundColor: '#fff', padding: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <MapPin size={16} color="#212121" style={{ flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#212121' }}>Deliver to</span>
                  <span style={{ fontSize: '14px', fontWeight: 600, color: '#2874f0', marginLeft: '8px', cursor: 'pointer' }}
                    onClick={() => { setStep('address'); window.scrollTo(0, 0); }}
                  >Change</span>
                </div>
              </div>
            </div>
            <div style={{ marginLeft: '24px', marginTop: '4px' }}>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#212121' }}>{form.name}</p>
              <p style={{ fontSize: '13px', color: '#878787', marginTop: '2px' }}>
                {form.house}, {form.road && `${form.road}, `}{form.city}, {form.state} - {form.pincode}
              </p>
              <p style={{ fontSize: '13px', color: '#878787', marginTop: '2px' }}>Phone: {form.phone}</p>
            </div>
          </div>

          <div style={{ height: '8px', backgroundColor: '#f1f3f6' }} />

          {/* Items header */}
          <div style={{ backgroundColor: '#fff', padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#212121' }}>{totalItems} Item{totalItems > 1 ? 's' : ''}</span>
          </div>

          {/* Item cards */}
          {items.map(item => (
            <div key={item.id} style={{ backgroundColor: '#fff', padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '70px', height: '70px', position: 'relative', flexShrink: 0 }}>
                  <Image src={item.image} alt={item.title} fill style={{ objectFit: 'contain' }} sizes="70px" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '14px', color: '#212121', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.title}
                  </p>
                  {item.brand && (
                    <p style={{ fontSize: '12px', color: '#878787', marginBottom: '6px' }}>{item.brand}, {item.category}</p>
                  )}
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: '#212121' }}>₹{item.price.toLocaleString('en-IN')}</span>
                    <span style={{ fontSize: '12px', color: '#878787', textDecoration: 'line-through' }}>₹{item.originalPrice.toLocaleString('en-IN')}</span>
                    <span style={{ fontSize: '12px', color: '#388e3c', fontWeight: 600 }}>{item.discount}% off</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#212121', marginTop: '4px' }}>Qty: {item.quantity}</p>
                </div>
              </div>

              {/* Flipkart Assured */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '10px' }}>
                <span style={{ fontSize: '12px', color: '#2874f0', fontWeight: 600 }}>
                  Flipkart Assured
                </span>
                <CheckCircle size={16} color="#388e3c" />
              </div>

              {/* Delivery */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
                <Truck size={14} color="#878787" />
                <span style={{ fontSize: '12px', color: '#212121' }}>
                  Delivery by Tomorrow <span style={{ color: '#388e3c', fontWeight: 600 }}>FREE</span>
                </span>
              </div>
            </div>
          ))}

          <div style={{ height: '8px', backgroundColor: '#f1f3f6' }} />

          {/* Apply Coupon */}
          <div style={{
            backgroundColor: '#fff', padding: '16px', display: 'flex',
            alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Tag size={16} color="#212121" />
              <span style={{ fontSize: '14px', fontWeight: 500, color: '#212121' }}>Apply Coupon</span>
            </div>
            <ChevronRight size={18} color="#878787" />
          </div>

          <div style={{ height: '8px', backgroundColor: '#f1f3f6' }} />

          {/* Price Details */}
          <div style={{ backgroundColor: '#fff', padding: '16px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#212121', marginBottom: '14px', letterSpacing: '0.5px' }}>PRICE DETAILS</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#212121' }}>
              <span>Price ({totalItems} item{totalItems > 1 ? 's' : ''}) <span style={{ fontSize: '12px', color: '#878787' }}>ⓘ</span></span>
              <span>₹{totalOriginalPrice.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#212121' }}>
              <span>Discount</span>
              <span style={{ color: '#388e3c' }}>− ₹{totalDiscount.toLocaleString('en-IN')}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px', color: '#212121' }}>
              <span>Delivery Charges</span>
              <span style={{ color: '#388e3c', fontWeight: 600 }}>FREE</span>
            </div>
            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 700, color: '#212121' }}>
                <span>Total Amount</span>
                <span>₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#388e3c', fontWeight: 600, marginTop: '12px' }}>
              You will save ₹{totalDiscount.toLocaleString('en-IN')} on this order
            </p>
          </div>

          {/* Sticky Bottom */}
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            backgroundColor: '#fff', borderTop: '1px solid #e0e0e0',
            padding: '10px 16px', zIndex: 50,
            boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div>
              <span style={{ fontSize: '17px', fontWeight: 700, color: '#212121' }}>
                ₹{totalPrice.toLocaleString('en-IN')}
              </span>
              <span style={{ fontSize: '12px', color: '#2874f0', fontWeight: 600, marginLeft: '8px', cursor: 'pointer' }}>
                View Details
              </span>
            </div>
            <button onClick={handleContinueToPayment} style={{
              backgroundColor: '#ffc800', color: '#212121', border: 'none', borderRadius: '4px',
              padding: '12px 20px', fontSize: '14px', fontWeight: 700,
              textTransform: 'uppercase', fontFamily: 'inherit', letterSpacing: '0.5px',
            }}>
              CONTINUE TO PAYMENT
            </button>
          </div>
        </div>
      )}

      {/* ====== STEP 3: PAYMENT ====== */}
      {step === 'payment' && (
        <div style={{ backgroundColor: '#f1f3f6', paddingBottom: '80px' }}>
          {/* Address summary */}
          <div style={{ backgroundColor: '#fff', padding: '16px', borderBottom: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#212121', margin: '0 0 2px' }}>{form.name}</p>
                <p style={{ fontSize: '13px', color: '#878787', margin: 0 }}>
                  {form.house}, {form.road && `${form.road}, `}{form.city}, {form.state} - {form.pincode}
                </p>
                <p style={{ fontSize: '13px', color: '#878787', margin: '2px 0 0' }}>Phone: {form.phone}</p>
              </div>
              <button onClick={() => { setStep('address'); window.scrollTo(0, 0); }}
                style={{ color: '#2874f0', fontSize: '13px', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}
              >CHANGE</button>
            </div>
          </div>

          {/* Item summary */}
          <div style={{ backgroundColor: '#fff', padding: '16px', marginTop: '8px', borderBottom: '1px solid #f0f0f0' }}>
            {items.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '12px', marginBottom: items.indexOf(item) < items.length - 1 ? '12px' : '0' }}>
                <div style={{ width: '50px', height: '50px', position: 'relative', flexShrink: 0 }}>
                  <Image src={item.image} alt={item.title} fill style={{ objectFit: 'contain' }} sizes="50px" />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', color: '#212121', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.title}</p>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#212121', margin: '2px 0 0' }}>₹{item.price.toLocaleString('en-IN')}</p>
                  <p style={{ fontSize: '12px', color: '#878787', margin: '2px 0 0' }}>Qty: {item.quantity}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Select Payment Method */}
          <div style={{ backgroundColor: '#fff', marginTop: '8px' }}>
            <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #f0f0f0' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#212121', margin: 0 }}>Select Payment Method</h3>
            </div>

            {/* Payment options */}
            {paymentMethods.map(pm => {
              return (
                <div key={pm.id}
                  onClick={() => !pm.disabled && setSelectedMethod(pm.id)}
                  style={{
                    padding: '14px 16px', borderBottom: '1px solid #f0f0f0',
                    cursor: pm.disabled ? 'not-allowed' : 'pointer',
                    backgroundColor: selectedMethod === pm.id ? '#f5faff' : '#fff',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    opacity: pm.disabled ? 0.6 : 1,
                  }}
                >
                  {/* Radio */}
                  <div style={{
                    width: '20px', height: '20px', borderRadius: '50%',
                    border: pm.disabled ? '2px solid #e0e0e0' : selectedMethod === pm.id ? '6px solid #2874f0' : '2px solid #c2c2c2',
                    boxSizing: 'border-box', flexShrink: 0,
                  }} />

                  {/* Logo/Icon */}
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '6px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    overflow: 'hidden',
                    backgroundColor: pm.id === 'phonepe' ? '#5F259F' : 
                                   pm.id === 'paytm' ? '#00BAF2' : 
                                   pm.id === 'gpay' ? '#4285F4' : 
                                   pm.id === 'upi' ? '#FF9933' : '#f5f5f5',
                  }}>
                    {pm.logo ? (
                      <img 
                        src={pm.logo} 
                        alt={pm.name}
                        style={{ 
                          width: '100%', 
                          height: '100%',
                          objectFit: 'contain' 
                        }}
                        onError={(e) => {
                          // Show first letter if image fails
                          const target = e.currentTarget;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `<span style="color: white; font-weight: 700; font-size: 16px;">${pm.name.charAt(0)}</span>`;
                          }
                        }}
                      />
                    ) : (
                      <Banknote size={20} color={pm.disabled ? '#bababa' : '#2874f0'} />
                    )}
                  </div>

                  {/* Text */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      fontSize: '14px', fontWeight: 500, margin: 0,
                      color: pm.disabled ? '#bababa' : '#212121',
                    }}>{pm.name}</p>
                    <p style={{
                      fontSize: '12px', margin: '2px 0 0',
                      color: pm.disabled ? '#ff4444' : '#878787',
                      fontStyle: pm.disabled ? 'italic' : 'normal',
                  }}>{pm.desc}</p>
                </div>

                {/* Chevron */}
                {!pm.disabled && (
                  <ChevronRight size={16} color="#c2c2c2" />
                )}
              </div>
            );
            })}
          </div>

          {/* Trust Badge */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '8px', padding: '14px 16px',
            backgroundColor: '#fff', marginTop: '8px',
          }}>
            <ShieldCheck size={18} color="#878787" />
            <span style={{ fontSize: '12px', color: '#878787' }}>100% Secure Payments. All transactions are encrypted.</span>
          </div>

          {/* Sticky bottom PAY button */}
          <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0,
            backgroundColor: '#fff', borderTop: '1px solid #e0e0e0',
            padding: '12px 16px', zIndex: 50,
            boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
          }}>
            <button disabled={!selectedMethod || processing}
              onClick={handleConfirmOrder}
              style={{
                width: '100%',
                backgroundColor: (!selectedMethod || processing) ? '#e0e0e0' : '#ffc800',
                color: (!selectedMethod || processing) ? '#878787' : '#212121',
                border: 'none', padding: '14px', fontWeight: 700, borderRadius: '24px',
                cursor: (!selectedMethod || processing) ? 'not-allowed' : 'pointer',
                textTransform: 'uppercase', fontSize: '15px', fontFamily: 'inherit',
                letterSpacing: '0.5px',
              }}
            >
              {processing ? 'Processing...' : `PAY ₹${totalPrice.toLocaleString('en-IN')}`}
            </button>
          </div>
        </div>
      )}

      {/* Preload Lottie during Processing */}
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
  );
}
