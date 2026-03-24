"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '../hooks/useCart';
import LiveEditable from './admin/LiveEditable';

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { cartCount } = useCart();

  // Hydration-safe mounting
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Cart icon bounce animation when count increases
  const prevCount = useRef(cartCount);
  const [bouncing, setBouncing] = useState(false);
  useEffect(() => {
    if (mounted && cartCount > prevCount.current) {
      setBouncing(true);
      const t = setTimeout(() => setBouncing(false), 500);
      return () => clearTimeout(t);
    }
    prevCount.current = cartCount;
  }, [cartCount, mounted]);

  return (
    <>
      {/* Top accent: thin orange/saffron stripe across the very top of the page */}
      <div className="h-1 w-full bg-saffron fixed top-0 left-0 z-[60]"></div>
      <header className="fixed top-1 z-50 w-full glass-header shadow-sm bg-white/95 backdrop-blur-md border-b border-slate-200/50 transition-all">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 h-20 flex items-center justify-between">
          <Link href="/" className="flex flex-col items-center justify-center group relative" onClick={() => setMobileMenuOpen(false)}>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase text-forest leading-none">
              <LiveEditable cmsKey={{ page: 'navbar', section: 'brand', content_key: 'name' }}>JAMMI</LiveEditable>
            </h1>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-forest mt-0.5">
              <LiveEditable cmsKey={{ page: 'navbar', section: 'brand', content_key: 'subtitle' }}>SINCE 1897</LiveEditable>
            </span>
            <div className="w-full h-0.5 bg-saffron mt-1 transition-transform origin-left scale-x-100 group-hover:scale-x-110"></div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-forest tracking-wide">
            <Link className="hover:text-saffron transition-colors uppercase" href="/heritage">
              <LiveEditable cmsKey={{ page: 'navbar', section: 'links', content_key: 'legacy' }}>The Legacy</LiveEditable>
            </Link>
            <Link className="hover:text-saffron transition-colors uppercase" href="/founders">
              <LiveEditable cmsKey={{ page: 'navbar', section: 'links', content_key: 'founders' }}>The Founders</LiveEditable>
            </Link>
            <Link className="hover:text-saffron transition-colors uppercase" href="/shop">
              <LiveEditable cmsKey={{ page: 'navbar', section: 'links', content_key: 'shop' }}>Shop</LiveEditable>
            </Link>
            <Link className="hover:text-saffron transition-colors uppercase relative" href="/federation">
              <LiveEditable cmsKey={{ page: 'navbar', section: 'links', content_key: 'federation' }}>The Federation</LiveEditable>
              <span className="absolute -top-3 -right-4 bg-saffron text-white text-[9px] px-1.5 py-0.5 rounded-sm shadow-sm animate-pulse">NEW</span>
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/consultation" className="hidden lg:flex bg-saffron text-white px-6 py-2.5 rounded-full font-bold text-sm tracking-wide hover:bg-forest transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200">
              CONSULT NOW
            </Link>

            {/* Cart icon — with live badge and bounce */}
            <Link href="/checkout" className="p-2 hover:bg-forest/10 rounded-full transition-all relative text-forest group">
              <span
                className={`material-symbols-outlined text-[28px] transition-transform inline-block ${bouncing ? 'cart-bounce' : 'group-hover:scale-110'}`}
              >
                shopping_cart
              </span>
              {mounted && cartCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[11px] flex justify-center items-center rounded-full font-bold shadow-sm border border-white transition-all">
                  {cartCount}
                </span>
              )}
            </Link>

            <button className="p-2 hover:bg-forest/10 rounded-full transition-colors text-forest hidden sm:block">
              <span className="material-symbols-outlined text-[28px]">account_circle</span>
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden p-2 hover:bg-forest/10 rounded-full transition-colors text-forest"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              <span className="material-symbols-outlined text-[28px]">
                {mobileMenuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Cart bounce keyframe */}
      <style>{`
        @keyframes cartBounce {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.35); }
          70%  { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .cart-bounce { animation: cartBounce 0.45s cubic-bezier(.36,.07,.19,.97) both; }
      `}</style>

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-white/95 backdrop-blur-xl transition-all duration-300 transform ${mobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}>
        <div className="flex flex-col h-full pt-28 pb-10 px-6">
          <nav className="flex flex-col gap-6 text-xl font-bold text-forest tracking-wide">
            <Link className="hover:text-saffron transition-colors uppercase border-b border-slate-100 pb-2" href="/heritage" onClick={() => setMobileMenuOpen(false)}>
              <LiveEditable cmsKey={{ page: 'navbar', section: 'links', content_key: 'legacy' }}>The Legacy</LiveEditable>
            </Link>
            <Link className="hover:text-saffron transition-colors uppercase border-b border-slate-100 pb-2" href="/founders" onClick={() => setMobileMenuOpen(false)}>
              <LiveEditable cmsKey={{ page: 'navbar', section: 'links', content_key: 'founders' }}>The Founders</LiveEditable>
            </Link>
            <Link className="hover:text-saffron transition-colors uppercase border-b border-slate-100 pb-2" href="/shop" onClick={() => setMobileMenuOpen(false)}>
              <LiveEditable cmsKey={{ page: 'navbar', section: 'links', content_key: 'shop' }}>Shop</LiveEditable>
            </Link>
            <Link className="hover:text-saffron transition-colors uppercase border-b border-slate-100 pb-2 relative inline-flex items-center gap-3 w-fit" href="/federation" onClick={() => setMobileMenuOpen(false)}>
              <LiveEditable cmsKey={{ page: 'navbar', section: 'links', content_key: 'federation' }}>The Federation</LiveEditable>
              <span className="bg-saffron text-white text-[10px] px-2 py-0.5 rounded-sm">NEW</span>
            </Link>
            <Link className="hover:text-saffron transition-colors uppercase border-b border-slate-100 pb-2" href="/journal" onClick={() => setMobileMenuOpen(false)}>
              <LiveEditable cmsKey={{ page: 'navbar', section: 'links', content_key: 'journal' }}>The Journal</LiveEditable>
            </Link>
            <Link className="hover:text-saffron transition-colors uppercase border-b border-slate-100 pb-2" href="/consultation" onClick={() => setMobileMenuOpen(false)}>
              <LiveEditable cmsKey={{ page: 'navbar', section: 'links', content_key: 'consultation' }}>Book Consultation</LiveEditable>
            </Link>
          </nav>

          <div className="mt-auto space-y-4">
            <Link href="/consultation" className="flex justify-center w-full bg-saffron text-white px-6 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-forest transition-colors shadow-lg" onClick={() => setMobileMenuOpen(false)}>
              <LiveEditable cmsKey={{ page: 'navbar', section: 'links', content_key: 'consult_cta' }}>CONSULT EXPERT VAIDYAS</LiveEditable>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
