import Link from 'next/link';
import { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#f1f3f6', display: 'flex', flexDirection: 'column' }}>
            <nav style={{
                backgroundColor: '#2874f0',
                color: '#fff',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                zIndex: 10,
                position: 'sticky',
                top: 0
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Link 
                        href="/admin" 
                        style={{ 
                            fontSize: '20px', 
                            fontWeight: 700, 
                            fontStyle: 'italic', 
                            letterSpacing: '0.025em', 
                            display: 'flex', 
                            alignItems: 'center', 
                            textDecoration: 'none', 
                            color: '#fff' 
                        }}
                    >
                        Flipkart <span style={{ color: '#ffe500', marginLeft: '6px', fontSize: '14px', fontStyle: 'normal', fontWeight: 500 }}>Admin</span>
                    </Link>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                        backgroundColor: 'rgba(255,255,255,0.1)', 
                        padding: '4px 10px', 
                        borderRadius: '4px', 
                        fontSize: '10px', 
                        fontWeight: 600, 
                        letterSpacing: '0.05em', 
                        textTransform: 'uppercase', 
                        border: '1px solid rgba(255,255,255,0.2)' 
                    }}>
                        Manager
                    </div>
                </div>
            </nav>

            <div style={{ 
                flexGrow: 1, 
                padding: '12px 16px', 
                maxWidth: '1400px', 
                margin: '0 auto', 
                width: '100%' 
            }}>
                {children}
            </div>
        </div>
    );
}
