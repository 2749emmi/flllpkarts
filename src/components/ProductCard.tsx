'use client';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import { Product } from '@/data/products';

interface ProductProps {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
  rating: number;
}

const ProductCard = ({ id, title, price, originalPrice, discount, image, rating }: ProductProps) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({ id, title, price, originalPrice, discount, image, rating } as Product);
  };

  return (
    <Link
      href={`/product/${id}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#fff',
        padding: '12px',
        position: 'relative',
        height: '100%',
        textDecoration: 'none',
        transition: 'box-shadow 0.2s',
        boxShadow: '0 1px 1px 0 rgba(0,0,0,0.08)',
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 2px 8px 0 rgba(0,0,0,0.12)')}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 1px 0 rgba(0,0,0,0.08)')}
    >
      {/* Image */}
      <div style={{
        position: 'relative', height: '160px', width: '100%', marginBottom: '12px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Image
          src={image}
          alt={title}
          fill
          style={{ objectFit: 'contain', padding: '4px' }}
          sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 200px"
          loading="lazy"
        />
      </div>

      {/* Title */}
      <p style={{
        fontSize: '14px', fontWeight: 400, color: '#212121',
        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        marginBottom: '6px',
      }}>
        {title}
      </p>

      {/* Rating */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
        <span style={{
          backgroundColor: '#388e3c', color: '#fff', fontSize: '12px', fontWeight: 700,
          padding: '1px 5px', borderRadius: '2px', display: 'inline-flex', alignItems: 'center', gap: '2px',
        }}>
          {rating} ★
        </span>
        <span style={{ color: '#878787', fontSize: '12px' }}>(1,234)</span>
      </div>

      {/* Price */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '16px', fontWeight: 700, color: '#212121' }}>
          ₹{price.toLocaleString('en-IN')}
        </span>
        <span style={{ color: '#878787', fontSize: '13px', textDecoration: 'line-through' }}>
          ₹{originalPrice.toLocaleString('en-IN')}
        </span>
        <span style={{ color: '#388e3c', fontSize: '13px', fontWeight: 600 }}>
          {discount}% off
        </span>
      </div>

      {/* Free delivery */}
      <p style={{ fontSize: '12px', color: '#212121', marginTop: '6px', fontWeight: 400 }}>
        Free delivery
      </p>

      {/* Add to Cart */}
      <button
        onClick={handleAddToCart}
        style={{
          marginTop: 'auto',
          paddingTop: '8px',
          width: '100%',
          backgroundColor: '#ff9f00',
          color: '#fff',
          border: 'none',
          borderRadius: '2px',
          padding: '8px 0',
          fontSize: '13px',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          transition: 'background-color 0.2s',
        }}
        onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#e68a00')}
        onMouseLeave={e => (e.currentTarget.style.backgroundColor = '#ff9f00')}
      >
        <ShoppingCart size={14} /> ADD TO CART
      </button>
    </Link>
  );
};

export default ProductCard;
