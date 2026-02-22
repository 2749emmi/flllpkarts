'use client';
import Link from 'next/link';
import Image from 'next/image';
import CategoryBar from '@/components/CategoryBar';
import HeroCarousel from '@/components/HeroCarousel';
import { products } from '@/data/products';
import { getProductUrl } from '@/utils/url';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

const dealSections = [
  { title: 'Best Deals on Smartphones', subtitle: 'Up to 99% Off', category: 'mobiles', bgColor: '#f2f8ff' },
  { title: 'Best of Electronics', subtitle: 'Up to 99% Off', category: 'electronics', bgColor: '#fef6e6' },
  { title: 'Fashion Top Deals', subtitle: 'Up to 99% Off', category: 'fashion', bgColor: '#fff5f5' },
  { title: 'Home & Furniture Deals', subtitle: 'Up to 99% Off', category: 'home', bgColor: '#f0faf4' },
  { title: 'Top Deals on Appliances', subtitle: 'Up to 99% Off', category: 'appliances', bgColor: '#fef0f5' },
  { title: 'Beauty, Toys & More', subtitle: 'Up to 99% Off', category: 'beauty', bgColor: '#f5f0ff' },
];

function LazySection({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { rootMargin: '200px 0px', threshold: 0.01 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref}>{visible ? children : <div style={{ height: '300px' }} />}</div>;
}

function DealRow({
  title, subtitle, category, bgColor, sectionProducts,
}: {
  title: string;
  subtitle: string;
  category: string;
  bgColor: string;
  sectionProducts: typeof products;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -600 : 600, behavior: 'smooth' });
    }
  };

  if (sectionProducts.length === 0) return null;

  return (
    <div className="hover-container" style={{
      backgroundColor: '#fff',
      boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)',
      marginTop: '10px',
    }}>
      <div className="deal-row">
        {/* Desktop: Left promo panel */}
        <div className="deal-row-promo" style={{
          width: '240px',
          flexShrink: 0,
          backgroundColor: bgColor,
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '28px 20px',
          textAlign: 'center',
          borderRight: '1px solid #e0e0e0',
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#212121', marginBottom: '6px', lineHeight: 1.3 }}>
            {title}
          </h2>
          <p style={{ fontSize: '14px', color: '#212121', marginBottom: '20px', fontWeight: 400 }}>
            {subtitle}
          </p>
          <Link href={`/category/${category}`} style={{
            backgroundColor: '#2874f0',
            color: '#fff',
            padding: '10px 36px',
            borderRadius: '2px',
            fontSize: '14px',
            fontWeight: 600,
            textDecoration: 'none',
            display: 'inline-block',
          }}>
            View All
          </Link>
        </div>

        {/* Mobile: Simple header */}
        <div className="deal-row-header-mobile" style={{
          padding: '12px 16px',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid #e0e0e0',
        }}>
          <div>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#212121', margin: 0 }}>{title}</h2>
            <p style={{ fontSize: '12px', color: '#388e3c', fontWeight: 600, margin: 0 }}>{subtitle}</p>
          </div>
          <Link href={`/category/${category}`} style={{
            backgroundColor: '#2874f0', color: '#fff', padding: '6px 16px',
            borderRadius: '2px', fontSize: '12px', fontWeight: 600, textDecoration: 'none',
          }}>
            VIEW ALL
          </Link>
        </div>

        {/* Products scroll */}
        <div className="deal-row-scroll" style={{ position: 'relative', overflow: 'hidden' }}>
          <div ref={scrollRef} className="hide-scrollbar" style={{
            display: 'flex', overflowX: 'auto',
          }}>
            {sectionProducts.map((product, i) => (
              <Link href={getProductUrl(product.title, product.id)} key={product.id} style={{
                flexShrink: 0,
                width: '188px',
                padding: '20px 16px 16px',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRight: i < sectionProducts.length - 1 ? '1px solid #e0e0e0' : 'none',
                textAlign: 'center',
              }}>
                <div style={{ width: '140px', height: '140px', position: 'relative', marginBottom: '14px' }}>
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    style={{ objectFit: 'contain' }}
                    sizes="140px"
                    loading="lazy"
                  />
                </div>
                <p style={{
                  fontSize: '14px', color: '#212121', fontWeight: 500, marginBottom: '6px',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%',
                }}>
                  {product.title.split('(')[0].trim()}
                </p>
                <p style={{ fontSize: '13px', color: '#388e3c', fontWeight: 600, marginBottom: '2px' }}>
                  From ₹{product.price.toLocaleString('en-IN')}
                </p>
                {product.discount > 0 && (
                  <p style={{ fontSize: '12px', color: '#212121', fontWeight: 400 }}>
                    {product.discount}% Off
                  </p>
                )}
              </Link>
            ))}
          </div>

          <button onClick={() => scroll('left')} className="hover-show" style={{
            position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
            width: '40px', height: '80px', backgroundColor: 'rgba(255,255,255,0.95)',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '2px 0 4px rgba(0,0,0,0.1)', borderRadius: '0 6px 6px 0', zIndex: 2,
          }}>
            <ChevronLeft size={20} color="#212121" />
          </button>
          <button onClick={() => scroll('right')} className="hover-show" style={{
            position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
            width: '40px', height: '80px', backgroundColor: 'rgba(255,255,255,0.95)',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '-2px 0 4px rgba(0,0,0,0.1)', borderRadius: '6px 0 0 6px', zIndex: 2,
          }}>
            <ChevronRight size={20} color="#212121" />
          </button>
        </div>
      </div>
    </div>
  );
}

function DealsOfTheDay() {
  const [time, setTime] = useState({ h: 5, m: 42, s: 18 });
  useEffect(() => {
    const iv = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const pad = (n: number) => n.toString().padStart(2, '0');
  const topDeals = products.filter(p => p.discount >= 80).slice(0, 10);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -600 : 600, behavior: 'smooth' });
    }
  };

  return (
    <div className="hover-container" style={{
      backgroundColor: '#fff',
      boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)',
      marginTop: '10px',
    }}>
      <div className="deal-row">
        {/* Desktop: Left promo */}
        <div className="deal-row-promo" style={{
          width: '240px',
          flexShrink: 0,
          backgroundColor: '#fff',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '28px 20px',
          textAlign: 'center',
          borderRight: '1px solid #e0e0e0',
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#212121', marginBottom: '12px' }}>
            Deals of the Day
          </h2>
          <div style={{ display: 'flex', gap: '4px', alignItems: 'center', marginBottom: '20px' }}>
            {[pad(time.h), pad(time.m), pad(time.s)].map((v, i) => (
              <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{
                  backgroundColor: '#212121', color: '#fff', fontWeight: 700, fontSize: '16px',
                  padding: '4px 8px', borderRadius: '2px', fontFamily: 'monospace', minWidth: '36px',
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                }}>{v}</span>
                {i < 2 && <span style={{ color: '#212121', fontWeight: 700, fontSize: '16px' }}>:</span>}
              </span>
            ))}
          </div>
          <Link href="/offers" style={{
            backgroundColor: '#2874f0', color: '#fff', padding: '10px 36px',
            borderRadius: '2px', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
          }}>
            View All
          </Link>
        </div>

        {/* Mobile header */}
        <div className="deal-row-header-mobile" style={{
          padding: '12px 16px', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid #e0e0e0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#212121', margin: 0 }}>Deals of the Day</h2>
            <div style={{ display: 'flex', gap: '2px' }}>
              {[pad(time.h), pad(time.m), pad(time.s)].map((v, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <span style={{
                    backgroundColor: '#212121', color: '#fff', fontWeight: 700, fontSize: '11px',
                    padding: '2px 4px', borderRadius: '2px', fontFamily: 'monospace',
                  }}>{v}</span>
                  {i < 2 && <span style={{ color: '#212121', fontWeight: 700, fontSize: '11px' }}>:</span>}
                </span>
              ))}
            </div>
          </div>
          <Link href="/offers" style={{
            backgroundColor: '#2874f0', color: '#fff', padding: '6px 16px',
            borderRadius: '2px', fontSize: '12px', fontWeight: 600, textDecoration: 'none',
          }}>
            VIEW ALL
          </Link>
        </div>

        {/* Products */}
        <div className="deal-row-scroll" style={{ position: 'relative', overflow: 'hidden' }}>
          <div ref={scrollRef} className="hide-scrollbar" style={{ display: 'flex', overflowX: 'auto' }}>
            {topDeals.map((product, i) => (
              <Link href={getProductUrl(product.title, product.id)} key={product.id} style={{
                flexShrink: 0, width: '188px', padding: '20px 16px 16px', textDecoration: 'none',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                borderRight: i < topDeals.length - 1 ? '1px solid #e0e0e0' : 'none',
                textAlign: 'center',
              }}>
                <div style={{ width: '140px', height: '140px', position: 'relative', marginBottom: '14px' }}>
                  <Image src={product.image} alt={product.title} fill style={{ objectFit: 'contain' }} sizes="140px" loading="lazy" />
                </div>
                <p style={{
                  fontSize: '14px', color: '#212121', fontWeight: 500, marginBottom: '6px',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%',
                }}>
                  {product.title.split('(')[0].trim()}
                </p>
                <p style={{ fontSize: '13px', color: '#388e3c', fontWeight: 600, marginBottom: '2px' }}>
                  From ₹{product.price.toLocaleString('en-IN')}
                </p>
                <p style={{ fontSize: '12px', color: '#212121', fontWeight: 400 }}>
                  {product.discount}% Off
                </p>
              </Link>
            ))}
          </div>
          <button onClick={() => scroll('left')} className="hover-show" style={{
            position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
            width: '40px', height: '80px', backgroundColor: 'rgba(255,255,255,0.95)',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '2px 0 4px rgba(0,0,0,0.1)', borderRadius: '0 6px 6px 0', zIndex: 2,
          }}>
            <ChevronLeft size={20} color="#212121" />
          </button>
          <button onClick={() => scroll('right')} className="hover-show" style={{
            position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
            width: '40px', height: '80px', backgroundColor: 'rgba(255,255,255,0.95)',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '-2px 0 4px rgba(0,0,0,0.1)', borderRadius: '6px 0 0 6px', zIndex: 2,
          }}>
            <ChevronRight size={20} color="#212121" />
          </button>
        </div>
      </div>
    </div>
  );
}

function SuggestedGrid() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -600 : 600, behavior: 'smooth' });
    }
  };
  const items = products.slice(0, 14);

  return (
    <div className="hover-container" style={{
      marginTop: '10px', backgroundColor: '#fff',
      boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)',
    }}>
      <div className="deal-row">
        {/* Desktop left panel */}
        <div className="deal-row-promo" style={{
          width: '240px', flexShrink: 0, backgroundColor: '#fff',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '28px 20px', textAlign: 'center', borderRight: '1px solid #e0e0e0',
        }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#212121', marginBottom: '20px', lineHeight: 1.3 }}>
            Recently Viewed &amp; More
          </h2>
          <Link href="/offers" style={{
            backgroundColor: '#2874f0', color: '#fff', padding: '10px 36px',
            borderRadius: '2px', fontSize: '14px', fontWeight: 600, textDecoration: 'none',
          }}>
            View All
          </Link>
        </div>

        {/* Mobile header */}
        <div className="deal-row-header-mobile" style={{
          padding: '12px 16px', alignItems: 'center', justifyContent: 'space-between',
          borderBottom: '1px solid #e0e0e0',
        }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#212121', margin: 0 }}>
            Recently Viewed &amp; More
          </h2>
          <Link href="/offers" style={{
            backgroundColor: '#2874f0', color: '#fff', padding: '6px 16px',
            borderRadius: '2px', fontSize: '12px', fontWeight: 600, textDecoration: 'none',
          }}>
            VIEW ALL
          </Link>
        </div>

        {/* Scroll */}
        <div className="deal-row-scroll" style={{ position: 'relative', overflow: 'hidden' }}>
          <div ref={scrollRef} className="hide-scrollbar" style={{ display: 'flex', overflowX: 'auto' }}>
            {items.map((product, i) => (
              <Link href={getProductUrl(product.title, product.id)} key={product.id} style={{
                flexShrink: 0, width: '188px', padding: '20px 16px 16px', textDecoration: 'none',
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                borderRight: i < items.length - 1 ? '1px solid #e0e0e0' : 'none',
                textAlign: 'center',
              }}>
                <div style={{ width: '140px', height: '140px', position: 'relative', marginBottom: '14px' }}>
                  <Image src={product.image} alt={product.title} fill style={{ objectFit: 'contain' }} sizes="140px" loading="lazy" />
                </div>
                <p style={{
                  fontSize: '14px', color: '#212121', fontWeight: 500, marginBottom: '6px',
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%',
                }}>
                  {product.title.split('(')[0].trim()}
                </p>
                <p style={{ fontSize: '13px', color: '#388e3c', fontWeight: 600, marginBottom: '2px' }}>
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
                <p style={{ fontSize: '12px', color: '#878787', fontWeight: 400 }}>
                  {product.discount}% Off
                </p>
              </Link>
            ))}
          </div>
          <button onClick={() => scroll('left')} className="hover-show" style={{
            position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
            width: '40px', height: '80px', backgroundColor: 'rgba(255,255,255,0.95)',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '2px 0 4px rgba(0,0,0,0.1)', borderRadius: '0 6px 6px 0', zIndex: 2,
          }}>
            <ChevronLeft size={20} color="#212121" />
          </button>
          <button onClick={() => scroll('right')} className="hover-show" style={{
            position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)',
            width: '40px', height: '80px', backgroundColor: 'rgba(255,255,255,0.95)',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '-2px 0 4px rgba(0,0,0,0.1)', borderRadius: '6px 0 0 6px', zIndex: 2,
          }}>
            <ChevronRight size={20} color="#212121" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div style={{ backgroundColor: '#f1f3f6', minHeight: '100vh' }}>
      <CategoryBar />

      <div style={{ maxWidth: '1248px', margin: '0 auto', padding: '0 10px 32px' }}>
        <div style={{ marginTop: '10px' }}>
          <HeroCarousel />
        </div>

        <DealsOfTheDay />

        {dealSections.map((section, index) => (
          <LazySection key={index}>
            <DealRow
              title={section.title}
              subtitle={section.subtitle}
              category={section.category}
              bgColor={section.bgColor}
              sectionProducts={products.filter(p => p.category === section.category)}
            />
          </LazySection>
        ))}

        <LazySection>
          <SuggestedGrid />
        </LazySection>
      </div>
    </div>
  );
}
