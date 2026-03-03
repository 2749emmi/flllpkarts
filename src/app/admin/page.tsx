'use client';

import { getProducts } from './actions';
import DeleteButton from './DeleteButton';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<any[]>([]);

  React.useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <div style={{ backgroundColor: '#fff', borderRadius: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
      <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: '12px', backgroundColor: '#f9fafb' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: '18px', fontWeight: 600, color: '#1f2937', margin: 0 }}>Product List</h1>
            <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>Manage your store products</p>
          </div>
          <Link
            href="/admin/add"
            style={{
              backgroundColor: '#2874f0',
              color: '#fff',
              fontWeight: 500,
              padding: '8px 16px',
              borderRadius: '4px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              textDecoration: 'none',
              fontSize: '14px',
              whiteSpace: 'nowrap',
              display: 'inline-block',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1e5bb8'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#2874f0'}
          >
            + Add Product
          </Link>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', minWidth: '600px' }}>
          <thead>
            <tr style={{ backgroundColor: 'rgba(243, 244, 246, 0.5)', color: '#6b7280', fontSize: '11px', letterSpacing: '0.05em', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ padding: '12px 16px', fontWeight: 600, textTransform: 'uppercase' }}>Product</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, textTransform: 'uppercase' }}>Price</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, textTransform: 'uppercase' }}>Original</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, textTransform: 'uppercase' }}>Discount</th>
              <th style={{ padding: '12px 16px', fontWeight: 600, textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody style={{ backgroundColor: '#fff' }}>
            {products.map((p: any) => (
              <tr key={p.id} style={{ borderBottom: '1px solid #e5e7eb', transition: 'background-color 0.2s' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fff'}
              >
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', maxWidth: '400px' }}>
                    <div style={{ width: '48px', height: '48px', position: 'relative', flexShrink: 0, backgroundColor: '#fff', border: '1px solid #f3f4f6', borderRadius: '4px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)', padding: '4px' }}>
                      <Image
                        src={p.image || p.images?.[0] || '/images/placeholder.png'}
                        alt={p.title}
                        fill
                        sizes="48px"
                        style={{ objectFit: 'contain' }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/images/placeholder.png';
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                      <span style={{ fontWeight: 600, color: '#1f2937', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '14px' }} title={p.title}>{p.title}</span>
                      <span style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>ID: {p.id}</span>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', color: '#111827', fontWeight: 700, whiteSpace: 'nowrap', fontSize: '14px' }}>
                  ₹{p.price?.toLocaleString() || 0}
                </td>
                <td style={{ padding: '12px 16px', color: '#9ca3af', fontWeight: 500, textDecoration: 'line-through', whiteSpace: 'nowrap', fontSize: '13px' }}>
                  ₹{(p.originalPrice || 0).toLocaleString()}
                </td>
                <td style={{ padding: '12px 16px', whiteSpace: 'nowrap' }}>
                  <span style={{ backgroundColor: 'rgba(56, 142, 60, 0.1)', color: '#388e3c', fontSize: '11px', fontWeight: 700, padding: '4px 8px', borderRadius: '4px', display: 'inline-block' }}>
                    {p.discount || 0}% OFF
                  </span>
                </td>
                <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <DeleteButton id={p.id} />
                </td>
              </tr>
            ))}

            {products.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '48px 24px', textAlign: 'center', backgroundColor: 'rgba(249, 250, 251, 0.5)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '48px', color: '#d1d5db' }}>📦</span>
                    <span style={{ fontWeight: 500, color: '#4b5563' }}>Your catalogue is empty</span>
                    <span style={{ fontSize: '14px', color: '#9ca3af' }}>Click Add Product to get started</span>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
