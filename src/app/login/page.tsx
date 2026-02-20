'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = () => {
        const cleaned = phone.replace(/\s/g, '');
        if (!/^[6-9]\d{9}$/.test(cleaned)) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }
        setError('');
        setLoading(true);
        setTimeout(() => {
            localStorage.setItem('fk_user', JSON.stringify({ phone: cleaned, loggedIn: true }));
            router.push('/');
        }, 800);
    };

    return (
        <div style={{ backgroundColor: '#f1f3f6', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            <div className="login-card">
                {/* Left Blue Panel */}
                <div className="login-left">
                    <div>
                        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#fff', marginBottom: '12px' }}>
                            Login
                        </h1>
                        <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', lineHeight: 1.5 }}>
                            Get access to your Orders, Wishlist and Recommendations
                        </p>
                    </div>
                    <div className="login-left-image" style={{ marginTop: '40px' }}>
                        <Image
                            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/login_img_c4a81e.png"
                            alt="Login"
                            width={200}
                            height={140}
                            style={{ objectFit: 'contain', width: '100%', maxWidth: '200px', height: 'auto' }}
                        />
                    </div>
                </div>

                {/* Right Form */}
                <div className="login-right">
                    <div style={{ marginBottom: '20px' }}>
                        <div style={{ position: 'relative' }}>
                            <input
                                type="tel"
                                maxLength={10}
                                value={phone}
                                onChange={e => {
                                    setPhone(e.target.value.replace(/[^0-9]/g, ''));
                                    if (error) setError('');
                                }}
                                onKeyDown={e => { if (e.key === 'Enter') handleLogin(); }}
                                placeholder="Enter Mobile Number"
                                style={{
                                    width: '100%', borderTop: 'none', borderLeft: 'none', borderRight: 'none',
                                    borderBottom: `2px solid ${error ? '#ff6161' : phone ? '#2874f0' : '#e0e0e0'}`,
                                    padding: '10px 0', fontSize: '15px',
                                    color: '#212121', outline: 'none', fontFamily: 'inherit', background: 'transparent',
                                    transition: 'border-color 0.2s',
                                }}
                            />
                        </div>
                        {error && (
                            <p style={{ color: '#ff6161', fontSize: '12px', marginTop: '6px' }}>{error}</p>
                        )}
                    </div>

                    <p style={{ fontSize: '11px', color: '#878787', lineHeight: 1.6, marginBottom: '20px' }}>
                        By continuing, you agree to Flipkart&apos;s{' '}
                        <Link href="#" style={{ color: '#2874f0' }}>Terms of Use</Link> and{' '}
                        <Link href="#" style={{ color: '#2874f0' }}>Privacy Policy</Link>.
                    </p>

                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        style={{
                            width: '100%', backgroundColor: '#fb641b', color: '#fff', fontWeight: 700,
                            padding: '14px', borderRadius: '2px', fontSize: '15px', border: 'none',
                            cursor: loading ? 'not-allowed' : 'pointer', textTransform: 'uppercase',
                            letterSpacing: '0.5px', fontFamily: 'inherit',
                            opacity: loading ? 0.7 : 1,
                            transition: 'opacity 0.2s',
                        }}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <div style={{ textAlign: 'center', margin: '20px 0 0' }}>
                        <span style={{ fontSize: '12px', color: '#878787' }}>OR</span>
                    </div>

                    <Link href="/" style={{
                        display: 'block', textAlign: 'center', marginTop: '16px',
                        color: '#2874f0', fontSize: '13px', fontWeight: 600, textDecoration: 'none',
                    }}>
                        Skip, continue to homepage
                    </Link>
                </div>
            </div>
        </div>
    );
}
