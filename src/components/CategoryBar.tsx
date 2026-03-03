'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRef } from 'react';

const categories = [
  { name: 'Top Offers', slug: 'offers', image: 'https://rukminim1.flixcart.com/fk-p-flap/128/128/image/698ba0cebe456aaf.jpg?q=100', type: 'category' },
  { name: 'Mobiles', slug: 'phone', image: 'https://rukminim1.flixcart.com/fk-p-flap/128/128/image/44e10b16e649b691.jpg?q=100', type: 'q' },
  { name: 'Laptops', slug: 'laptop', image: 'https://rukminim1.flixcart.com/fk-p-flap/196/196/image/a080ac3397f3612d.png?q=90', type: 'q' },
  { name: 'Earbuds', slug: 'earbud', image: 'https://rukminim1.flixcart.com/fk-p-flap/128/128/image/a5e656672d0548dd.jpg?q=100', type: 'q' },
  { name: 'Fashion', slug: 'fashion', image: 'https://rukminim1.flixcart.com/fk-p-flap/196/196/image/f03c562321e764bb.jpg?q=90', type: 'q' },
  { name: 'Electronics', slug: 'electronics', image: 'https://rukminim1.flixcart.com/fk-p-flap/196/196/image/a080ac3397f3612d.png?q=90', type: 'q' },
  { name: 'Home & Furniture', slug: 'home', image: 'https://rukminim1.flixcart.com/fk-p-flap/196/196/image/9be859f78d39cc22.jpg?q=90', type: 'q' },
  { name: 'Appliances', slug: 'appliances', image: 'https://rukminim1.flixcart.com/fk-p-flap/196/196/image/51b0d5f9aabc2462.jpg?q=90', type: 'q' },
  { name: 'Beauty', slug: 'beauty', image: 'https://rukminim1.flixcart.com/fk-p-flap/128/128/image/a5e656672d0548dd.jpg?q=100', type: 'q' },
  { name: 'Grocery', slug: 'grocery', image: 'https://rukminim1.flixcart.com/fk-p-flap/128/128/image/29327f40e9c4d26b.png?q=100', type: 'q' },
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
          {categories.map((cat, index) => {
            const href = cat.slug === 'offers' 
              ? '/offers' 
              : cat.type === 'q' 
                ? `/q/${cat.slug}` 
                : `/category/${cat.slug}`;
            
            return (
              <Link
                href={href}
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
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryBar;
