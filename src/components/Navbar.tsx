'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingCart, User, ChevronDown, Store, Menu, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useRouter, usePathname } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Reset search state on route change (fixes broken search after navigation)
  useEffect(() => {
    setShowDropdown(false);
    setSearchQuery('');
    setSearchResults([]);
    setSearchSuggestions([]);
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchRef]);

  // Handle live search
  useEffect(() => {
    const fetchResults = async () => {
      try {
        const queryVal = searchQuery.trim();
        const res = await fetch(`/api/search?q=${encodeURIComponent(queryVal)}`);
        const data = await res.json();
        setSearchResults(data.results || []);
        setSearchSuggestions(data.suggestions || []);
      } catch (e) {
        console.error("Search failed", e);
      }
    };

    const timeoutId = setTimeout(fetchResults, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 50 }}>
      {/* PRIMARY HEADER */}
      <div style={{ backgroundColor: '#2874f0' }}>
        <div style={{ maxWidth: '1248px', margin: '0 auto', padding: '0 16px' }}>

          {/* DESKTOP NAV */}
          <div className="desktop-only" style={{ height: '56px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Logo */}
            <Link href="/" style={{ flexShrink: 0, marginRight: '4px', textDecoration: 'none', display: 'block' }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <Image
                  src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png"
                  alt="Flipkart"
                  width={75}
                  height={20}
                  style={{ objectFit: 'contain' }}
                  priority
                />
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginTop: '1px' }}>
                  <span style={{ color: '#f0f0f0', fontSize: '11px', fontStyle: 'italic' }}>Explore</span>
                  <span style={{ color: '#ffe500', fontSize: '11px', fontStyle: 'italic', fontWeight: 600 }}>Plus</span>
                  <Image
                    src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/plus_aef861.png"
                    alt="Plus"
                    width={10}
                    height={10}
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </div>
            </Link>

            {/* Search Bar */}
            <div style={{ flex: 1, maxWidth: '560px' }} ref={searchRef}>
              <form
                onSubmit={handleSearchSubmit}
                style={{
                  display: 'flex', alignItems: 'center', backgroundColor: '#fff',
                  borderRadius: '2px', height: '36px', overflow: 'hidden', position: 'relative'
                }}
              >
                <input
                  type="text"
                  placeholder="Search for Products, Brands and More"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                  style={{
                    flex: 1, border: 'none', outline: 'none', padding: '0 16px',
                    fontSize: '14px', color: '#212121', background: 'transparent', fontFamily: 'inherit',
                  }}
                />
                <button
                  type="submit"
                  style={{
                    width: '42px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', border: 'none', background: 'none'
                  }}
                >
                  <Search style={{ width: '18px', height: '18px', color: '#2874f0' }} />
                </button>

                {/* Search Dropdown Desktop */}
                {showDropdown && (
                  <div style={{
                    position: 'absolute', top: '100%', left: 0, right: 0,
                    backgroundColor: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                    zIndex: 100, borderRadius: '0 0 2px 2px', maxHeight: '480px', overflowY: 'auto'
                  }}>
                    {/* "Discover More" header when empty */}
                    {searchQuery.trim() === '' && searchResults.length > 0 && (
                      <div style={{ padding: '10px 16px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#f5f5f6' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#878787', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Discover More</span>
                      </div>
                    )}

                    {/* Keyword Suggestions (like Flipkart/Amazon) */}
                    {searchQuery.trim().length > 0 && searchSuggestions.length > 0 && (
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {searchSuggestions.map((suggestion, i) => (
                          <li key={`sug-${i}`} style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <button
                              type="button"
                              onClick={() => {
                                setSearchQuery(suggestion);
                                setShowDropdown(false);
                                router.push(`/search?q=${encodeURIComponent(suggestion)}`);
                              }}
                              style={{
                                display: 'flex', alignItems: 'center', padding: '10px 16px',
                                gap: '12px', textDecoration: 'none', color: '#212121',
                                width: '100%', border: 'none', background: 'none',
                                cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', fontSize: '14px'
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f6')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                              <Search style={{ width: '16px', height: '16px', color: '#878787', flexShrink: 0 }} />
                              <span style={{ textTransform: 'capitalize' }}>{suggestion}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* Product thumbnails */}
                    {searchResults.length > 0 && (
                      <>
                        {searchQuery.trim().length > 0 && searchSuggestions.length > 0 && (
                          <div style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#f5f5f6' }}>
                            <span style={{ fontSize: '12px', fontWeight: 700, color: '#878787', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Products</span>
                          </div>
                        )}
                        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                          {searchResults.map((product) => (
                            <li key={product.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                              <Link
                                href={`/${product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/p/${product.id}`}
                                onClick={() => setShowDropdown(false)}
                                style={{
                                  display: 'flex', alignItems: 'center', padding: '10px 16px',
                                  gap: '12px', textDecoration: 'none', color: '#212121'
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f5f5f6')}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                              >
                                <div style={{ width: '32px', height: '32px', position: 'relative', flexShrink: 0 }}>
                                  <Image src={product.image || product.images?.[0] || '/images/placeholder.png'} alt={product.title} fill style={{ objectFit: 'contain' }} />
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {product.title}
                                  </div>
                                  <div style={{ fontSize: '12px', color: '#878787' }}>
                                    in {product.category}
                                  </div>
                                </div>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}

                    {/* No results state */}
                    {searchQuery.trim().length > 0 && searchResults.length === 0 && searchSuggestions.length === 0 && (
                      <div style={{ padding: '16px', textAlign: 'center', color: '#878787', fontSize: '14px' }}>
                        No results found for &ldquo;{searchQuery}&rdquo;
                      </div>
                    )}
                  </div>
                )}
              </form>
            </div>

            {/* Right Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginLeft: 'auto' }}>
              {/* Login */}
              <div className="hover-parent" style={{ position: 'relative' }}>
                <Link href="/login" style={{
                  display: 'flex', alignItems: 'center', gap: '4px', padding: '5px 32px',
                  fontSize: '16px', fontWeight: 500, color: '#2874f0', backgroundColor: '#fff',
                  borderRadius: '2px', cursor: 'pointer', textDecoration: 'none', whiteSpace: 'nowrap',
                }}>
                  Login
                </Link>
                <div className="hover-dropdown" style={{
                  position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)',
                  width: '240px', backgroundColor: '#fff', borderRadius: '2px',
                  zIndex: 50, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                  marginTop: '10px',
                }}>
                  <div style={{
                    position: 'absolute', top: '-8px', left: '50%', marginLeft: '-8px',
                    borderLeft: '8px solid transparent', borderRight: '8px solid transparent',
                    borderBottom: '8px solid #fff',
                  }} />
                  <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0' }}>
                    <span style={{ fontSize: '14px', fontWeight: 600, color: '#212121' }}>New Customer?</span>
                    <Link href="/login" style={{ color: '#2874f0', fontSize: '14px', fontWeight: 600, textDecoration: 'none' }}>Sign Up</Link>
                  </div>
                  <ul style={{ listStyle: 'none', padding: '0', margin: 0 }}>
                    <li style={{ padding: '12px 16px', fontSize: '14px', color: '#212121', display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}>
                      <User size={16} color="#2874f0" /> My Profile
                    </li>
                    <li style={{ padding: '12px 16px', fontSize: '14px', color: '#212121', display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer' }}>
                      <Image src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/plus_aef861.png" width={16} height={16} alt="" /> Flipkart Plus Zone
                    </li>
                  </ul>
                </div>
              </div>

              {/* Become a Seller */}
              <Link href="#" style={{
                display: 'flex', alignItems: 'center',
                fontSize: '16px', fontWeight: 500, color: '#fff', whiteSpace: 'nowrap', textDecoration: 'none',
              }}>
                Become a Seller
              </Link>

              {/* More */}
              <div className="hover-parent" style={{ position: 'relative' }}>
                <button style={{
                  display: 'flex', alignItems: 'center', gap: '4px',
                  fontSize: '16px', fontWeight: 500, color: '#fff', background: 'none',
                  border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  More <ChevronDown style={{ width: '12px', height: '12px' }} />
                </button>
                <div className="hover-dropdown" style={{
                  position: 'absolute', top: '100%', right: 0,
                  width: '200px', backgroundColor: '#fff', borderRadius: '2px',
                  zIndex: 50, overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                  marginTop: '10px',
                }}>
                  <div style={{
                    position: 'absolute', top: '-8px', right: '16px',
                    borderLeft: '8px solid transparent', borderRight: '8px solid transparent',
                    borderBottom: '8px solid #fff',
                  }} />
                  <ul style={{ listStyle: 'none', padding: '0', margin: 0 }}>
                    <li style={{ padding: '12px 16px', fontSize: '14px', color: '#212121', cursor: 'pointer', borderBottom: '1px solid #f0f0f0' }}>
                      Notification Preferences
                    </li>
                    <li style={{ padding: '12px 16px', fontSize: '14px', color: '#212121', cursor: 'pointer' }}>
                      24x7 Customer Care
                    </li>
                  </ul>
                </div>
              </div>

              {/* Cart */}
              <Link href="/cart" style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                fontSize: '16px', fontWeight: 500, color: '#fff', textDecoration: 'none', position: 'relative',
              }}>
                <div style={{ position: 'relative' }}>
                  <ShoppingCart style={{ width: '20px', height: '20px' }} />
                  {totalItems > 0 && (
                    <span style={{
                      position: 'absolute', top: '-8px', right: '-10px',
                      backgroundColor: '#ff3e6c', color: '#fff', fontSize: '10px', fontWeight: 700,
                      width: '18px', height: '18px', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>{totalItems}</span>
                  )}
                </div>
                Cart
              </Link>
            </div>
          </div>

          {/* MOBILE NAV */}
          <div className="mobile-only" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '10px 0', gap: '12px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }}>
                {mobileMenuOpen
                  ? <X style={{ width: '24px', height: '24px', color: '#fff' }} />
                  : <Menu style={{ width: '24px', height: '24px', color: '#fff' }} />
                }
              </button>
              <Link href="/" style={{ flexShrink: 0, textDecoration: 'none' }}>
                <Image
                  src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png"
                  alt="Flipkart"
                  width={75}
                  height={20}
                  style={{ objectFit: 'contain' }}
                />
              </Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <Link href="/login" style={{
                fontSize: '14px', fontWeight: 500, textDecoration: 'none',
                background: '#fff', color: '#2874f0', padding: '4px 12px', borderRadius: '2px',
              }}>
                Login
              </Link>
              <Link href="/cart" style={{ padding: '4px', position: 'relative' }}>
                <ShoppingCart style={{ width: '22px', height: '22px', color: '#fff' }} />
                {totalItems > 0 && (
                  <span style={{
                    position: 'absolute', top: '-4px', right: '-6px',
                    backgroundColor: '#ff3e6c', color: '#fff', fontSize: '10px', fontWeight: 700,
                    width: '18px', height: '18px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>{totalItems}</span>
                )}
              </Link>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="mobile-only" style={{ paddingBottom: '10px' }}>
            <form
              onSubmit={handleSearchSubmit}
              style={{
                display: 'flex', alignItems: 'center', backgroundColor: '#fff',
                borderRadius: '2px', height: '40px', overflow: 'hidden', width: '100%',
                position: 'relative'
              }}
            >
              <button
                type="submit"
                style={{
                  width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'none', border: 'none', cursor: 'pointer'
                }}
              >
                <Search style={{ width: '18px', height: '18px', color: '#717478' }} />
              </button>
              <input
                type="text"
                placeholder="Search for Products, Brands and More"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                style={{
                  flex: 1, border: 'none', outline: 'none', paddingRight: '12px',
                  fontSize: '14px', color: '#212121', background: 'transparent', fontFamily: 'inherit',
                }}
              />

              {/* Search Dropdown Mobile */}
              {showDropdown && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  backgroundColor: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
                  zIndex: 100, borderRadius: '0 0 2px 2px', maxHeight: '350px', overflowY: 'auto'
                }}>
                  {searchQuery.trim() === '' && searchResults.length > 0 && (
                    <div style={{ padding: '10px 16px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#f5f5f6' }}>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#878787', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Discover More</span>
                    </div>
                  )}
                  {/* Keyword Suggestions */}
                  {searchQuery.trim().length > 0 && searchSuggestions.length > 0 && (
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {searchSuggestions.map((suggestion, i) => (
                        <li key={`msug-${i}`} style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <button
                            type="button"
                            onClick={() => {
                              setSearchQuery(suggestion);
                              setShowDropdown(false);
                              router.push(`/search?q=${encodeURIComponent(suggestion)}`);
                            }}
                            style={{
                              display: 'flex', alignItems: 'center', padding: '10px 16px',
                              gap: '12px', width: '100%', border: 'none', background: 'none',
                              cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', fontSize: '14px', color: '#212121'
                            }}
                          >
                            <Search style={{ width: '16px', height: '16px', color: '#878787', flexShrink: 0 }} />
                            <span style={{ textTransform: 'capitalize' }}>{suggestion}</span>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                  {/* Product thumbnails */}
                  {searchResults.length > 0 && (
                    <>
                      {searchQuery.trim().length > 0 && searchSuggestions.length > 0 && (
                        <div style={{ padding: '8px 16px', borderBottom: '1px solid #f0f0f0', backgroundColor: '#f5f5f6' }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: '#878787', textTransform: 'uppercase' }}>Products</span>
                        </div>
                      )}
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {searchResults.map((product) => (
                          <li key={product.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                            <Link
                              href={`/${product.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}/p/${product.id}`}
                              onClick={() => setShowDropdown(false)}
                              style={{
                                display: 'flex', alignItems: 'center', padding: '10px 16px',
                                gap: '12px', textDecoration: 'none', color: '#212121'
                              }}
                            >
                              <div style={{ width: '32px', height: '32px', position: 'relative', flexShrink: 0 }}>
                                <Image src={product.image || product.images?.[0] || '/images/placeholder.png'} alt={product.title} fill style={{ objectFit: 'contain' }} />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {product.title}
                                </div>
                                <div style={{ fontSize: '12px', color: '#878787' }}>
                                  in {product.category}
                                </div>
                              </div>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  {searchQuery.trim().length > 0 && searchResults.length === 0 && searchSuggestions.length === 0 && (
                    <div style={{ padding: '16px', textAlign: 'center', color: '#878787', fontSize: '14px' }}>
                      No results found for &ldquo;{searchQuery}&rdquo;
                    </div>
                  )}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* SECONDARY NAV (Desktop) */}
      <div className="desktop-only-block" style={{
        backgroundColor: '#fff', boxShadow: '0 1px 1px 0 rgba(0,0,0,0.16)', height: '40px',
      }}>
        <div style={{ maxWidth: '1248px', margin: '0 auto', padding: '0 16px', height: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%' }}>
            {[
              { label: 'Electronics', slug: 'electronics' },
              { label: 'TVs & Appliances', slug: 'appliances' },
              { label: 'Men', slug: 'fashion' },
              { label: 'Women', slug: 'fashion' },
              { label: 'Baby & Kids', slug: 'beauty' },
              { label: 'Home & Furniture', slug: 'home' },
              { label: 'Sports, Books & More', slug: 'beauty' },
              { label: 'Flights', slug: '#' },
              { label: 'Offer Zone', slug: 'offers' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.slug === '#' ? '#' : item.slug === 'offers' ? '/offers' : `/category/${item.slug}`}
                style={{
                  fontSize: '14px', fontWeight: 500, color: '#212121',
                  whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px',
                  textDecoration: 'none', cursor: 'pointer', height: '100%',
                  padding: '0 4px',
                }}
              >
                {item.label}
                <ChevronDown style={{ width: '10px', height: '10px', color: '#c2c2c2' }} />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Side Menu */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 100, display: 'flex',
          }}
        >
          <div onClick={e => e.stopPropagation()} style={{
            width: '280px', backgroundColor: '#fff', height: '100%',
            display: 'flex', flexDirection: 'column', overflowY: 'auto',
          }}>
            <div style={{
              padding: '16px', background: '#2874f0', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <User size={20} />
                <span style={{ fontWeight: 600 }}>Login &amp; Signup</span>
              </div>
              <Image
                src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png"
                width={60} height={15} alt="Flipkart"
                style={{ background: '#fff', padding: '2px 4px', borderRadius: '2px' }}
              />
            </div>
            <ul style={{ listStyle: 'none', padding: '0', margin: 0, flex: 1 }}>
              <li style={{ padding: '16px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: '16px', alignItems: 'center' }} onClick={() => setMobileMenuOpen(false)}>
                <Store size={18} color="#717478" /> SuperCoin Zone
              </li>
              <li style={{ padding: '16px', borderBottom: '1px solid #f0f0f0', display: 'flex', gap: '16px', alignItems: 'center' }} onClick={() => setMobileMenuOpen(false)}>
                <Store size={18} color="#717478" /> Flipkart Plus Zone
              </li>
              <li style={{ padding: '12px 16px', backgroundColor: '#f5f5f5', fontWeight: 600, color: '#878787', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Categories
              </li>
              {[
                { label: 'Top Offers', slug: 'offers' },
                { label: 'Mobiles', slug: 'mobiles' },
                { label: 'Fashion', slug: 'fashion' },
                { label: 'Electronics', slug: 'electronics' },
                { label: 'Home', slug: 'home' },
                { label: 'Appliances', slug: 'appliances' },
                { label: 'Toys & Beauty', slug: 'beauty' },
              ].map(item => (
                <Link key={item.label} href={item.slug === 'offers' ? '/offers' : `/category/${item.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <li style={{ padding: '14px 16px', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '14px' }} onClick={() => setMobileMenuOpen(false)}>
                    {item.label}
                    <ChevronDown style={{ width: '12px', height: '12px', color: '#c2c2c2', transform: 'rotate(-90deg)' }} />
                  </li>
                </Link>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
