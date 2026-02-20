'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';

const categories = [
  { name: 'Top Offers', slug: 'offers', image: 'https://rukminim1.flixcart.com/fk-p-flap/128/128/image/698ba0cebe456aaf.jpg?q=100' },
  { name: 'Mobiles', slug: 'mobiles', image: 'https://rukminim1.flixcart.com/fk-p-flap/128/128/image/44e10b16e649b691.jpg?q=100' },
  { name: 'Fashion', slug: 'fashion', image: 'https://rukminim1.flixcart.com/fk-p-flap/196/196/image/f03c562321e764bb.jpg?q=90' },
  { name: 'Electronics', slug: 'electronics', image: 'https://rukminim1.flixcart.com/fk-p-flap/196/196/image/a080ac3397f3612d.png?q=90' },
  { name: 'Home & Furniture', slug: 'home', image: 'https://rukminim1.flixcart.com/fk-p-flap/196/196/image/9be859f78d39cc22.jpg?q=90' },
  { name: 'Appliances', slug: 'appliances', image: 'https://rukminim1.flixcart.com/fk-p-flap/196/196/image/51b0d5f9aabc2462.jpg?q=90' },
  { name: 'Travel', slug: '#', image: 'https://rukminim1.flixcart.com/fk-p-flap/196/196/image/d7eae409dc461a54.jpg?q=90' },
  { name: 'Beauty, Toys & More', slug: 'beauty', image: 'https://rukminim1.flixcart.com/fk-p-flap/128/128/image/a5e656672d0548dd.jpg?q=100' },
  { name: 'Grocery', slug: 'grocery', image: 'https://rukminim1.flixcart.com/fk-p-flap/128/128/image/25f400c36bc3487d.jpg?q=100' },
];

const CategoryBar = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div style={{
      backgroundColor: '#fff',
      boxShadow: '0 1px 1px 0 rgba(0,0,0,0.08)',
    }}>
      <div style={{ maxWidth: '1248px', margin: '0 auto', padding: '0 8px' }}>
        <div
          ref={scrollRef}
          className="hide-scrollbar"
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            overflowX: 'auto',
            padding: '8px 0',
            gap: '0',
          }}
        >
          {categories.map((cat, index) => (
            <Link
              href={cat.slug === '#' ? '#' : cat.slug === 'offers' ? '/offers' : `/category/${cat.slug}`}
              key={index}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer',
                flexShrink: 0,
                padding: '4px 16px',
                textDecoration: 'none',
                minWidth: '80px',
              }}
            >
              <div style={{ width: '56px', height: '56px', position: 'relative' }}>
                <Image
                  src={cat.image}
                  alt={cat.name}
                  width={56}
                  height={56}
                  style={{ objectFit: 'contain' }}
                />
              </div>
              <span style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#212121',
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}>
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
