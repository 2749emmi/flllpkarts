'use client';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback } from 'react';

const slides = [
  'https://rukminim1.flixcart.com/fk-p-flap/1620/790/image/8ad7fcc3ba408fd7.jpg?q=90',
  'https://rukminim1.flixcart.com/fk-p-flap/1620/790/image/5a5ae8a1780baaef.jpg?q=90',
  'https://rukminim1.flixcart.com/fk-p-flap/1620/790/image/dbc2936aff7c71c8.png?q=90',
];

const HeroCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 4000, stopOnInteraction: false }),
  ]);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <div className="hover-container" style={{
      position: 'relative', overflow: 'hidden',
      boxShadow: '0 1px 1px 0 rgba(0,0,0,.16)',
    }}>
      <div style={{ overflow: 'hidden' }} ref={emblaRef}>
        <div style={{ display: 'flex' }}>
          {slides.map((src, index) => (
            <div key={index} style={{
              flex: '0 0 100%', minWidth: 0, position: 'relative',
              paddingBottom: 'clamp(140px, 24vw, 270px)',
            }}>
              <Image
                src={src}
                alt={`Banner ${index + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                priority={index === 0}
                sizes="100vw"
              />
            </div>
          ))}
        </div>
      </div>

      <button onClick={scrollPrev} className="hover-show" style={{
        position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)',
        width: '40px', height: '70px', backgroundColor: 'rgba(255,255,255,0.9)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '2px', border: 'none', cursor: 'pointer',
        boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
      }}>
        <ChevronLeft size={20} color="#212121" />
      </button>
      <button onClick={scrollNext} className="hover-show" style={{
        position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
        width: '40px', height: '70px', backgroundColor: 'rgba(255,255,255,0.9)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: '2px', border: 'none', cursor: 'pointer',
        boxShadow: '0 1px 4px rgba(0,0,0,0.15)',
      }}>
        <ChevronRight size={20} color="#212121" />
      </button>
    </div>
  );
};

export default HeroCarousel;
