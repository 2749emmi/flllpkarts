'use client';
import { ShoppingCart, Zap } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/data/products';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AddToCartButton({ product }: { product: Product }) {
    const { addToCart } = useCart();
    const router = useRouter();
    const [added, setAdded] = useState(false);

    const handleAddToCart = () => {
        addToCart(product);
        setAdded(true);
        setTimeout(() => setAdded(false), 1500);
    };

    const handleBuyNow = () => {
        addToCart(product);
        router.push('/cart');
    };

    return (
        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
            <button onClick={handleAddToCart} style={{
                flex: 1, backgroundColor: added ? '#388e3c' : '#ff9f00', color: '#fff', padding: '14px', fontWeight: 700, fontSize: '15px',
                borderRadius: '2px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                textTransform: 'uppercase', fontFamily: 'inherit', boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                transition: 'background-color 0.3s',
            }}>
                <ShoppingCart style={{ width: '18px', height: '18px' }} fill="white" />
                {added ? '✓ ADDED!' : 'ADD TO CART'}
            </button>
            <button onClick={handleBuyNow} style={{
                flex: 1, backgroundColor: '#fb641b', color: '#fff', padding: '14px', fontWeight: 700, fontSize: '15px',
                borderRadius: '2px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                textTransform: 'uppercase', fontFamily: 'inherit', boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}>
                <Zap style={{ width: '18px', height: '18px' }} fill="white" /> BUY NOW
            </button>
        </div>
    );
}
