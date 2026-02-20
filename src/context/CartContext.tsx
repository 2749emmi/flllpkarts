'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/data/products';
import Link from 'next/link';

interface CartItem extends Product {
    quantity: number;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [toast, setToast] = useState<{ msg: string, action?: boolean } | null>(null);

    // Load from localStorage on mount
    useEffect(() => {
        const savedCart = localStorage.getItem('fk_cart');
        if (savedCart) {
            try {
                setItems(JSON.parse(savedCart));
            } catch (e) {
                console.error('Failed to parse cart', e);
            }
        }
    }, []);

    // Save to localStorage whenever items change
    useEffect(() => {
        localStorage.setItem('fk_cart', JSON.stringify(items));
    }, [items]);

    const showToast = (msg: string, action = false) => {
        setToast({ msg, action });
        setTimeout(() => setToast(null), 3000);
    };

    const addToCart = (product: Product) => {
        setItems(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
        showToast(`Added ${product.title} to Cart`, true);
    };

    const removeFromCart = (id: string) => {
        setItems(prev => prev.filter(item => item.id !== id));
    };

    const updateQuantity = (id: string, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(id);
            return;
        }
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => {
        setItems([]);
        localStorage.removeItem('fk_cart');
    };

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice }}>
            {children}
            {/* Best Practice: Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
                    backgroundColor: '#212121', color: '#fff', padding: '12px 24px', borderRadius: '4px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '16px',
                    minWidth: '300px', justifyContent: 'space-between', animation: 'fadeIn 0.3s'
                }}>
                    <span style={{ fontSize: '14px', fontWeight: 500 }}>{toast.msg}</span>
                    {toast.action && (
                        <Link href="/cart" style={{ color: '#ffd700', fontWeight: 700, textDecoration: 'none', fontSize: '13px', textTransform: 'uppercase' }}>
                            GO TO CART
                        </Link>
                    )}
                </div>
            )}
            <style jsx global>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translate(-50%, 20px); }
                    to { opacity: 1; transform: translate(-50%, 0); }
                }
            `}</style>
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) throw new Error('useCart must be used within CartProvider');
    return context;
}
