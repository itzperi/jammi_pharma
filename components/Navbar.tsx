"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../hooks/useCart';

const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems: cartCount } = useCart();

  return (
    <>
      {/* Top accent: thin orange/saffron stripe across the very top of the page */}
      <div className="h-1 w-full bg-saffron fixed top-0 left-0 z-[60]"></div>
      <header className="fixed top-1 z-50 w-full glass-header shadow-sm bg-white/95 backdrop-blur-md border-b border-slate-200/50 transition-all">
        <div className="max-w-7xl mx-auto px-4 lg:px-10 h-20 flex items-center justify-between">
          <Link href="/" className="flex flex-col items-center justify-center group relative" onClick={() => setMobileMenuOpen(false)}>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight uppercase text-forest leading-none">
              JAMMI
            </h1>
            <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-forest mt-0.5">SINCE 1897</span>
            <div className="w-full h-0.5 bg-saffron mt-1 transition-transform origin-left scale-x-100 group-hover:scale-x-110"></div>
          </Link>

          <nav className="hidden lg:flex items-center gap-8 text-sm font-bold text-forest tracking-wide">
            <Link className="hover:text-saffron transition-colors uppercase" href="/heritage">The Legacy</Link>
            <Link className="hover:text-saffron transition-colors uppercase" href="/founders">The Founders</Link>
            <Link className="hover:text-saffron transition-colors uppercase" href="/shop">Shop</Link>
            <Link className="hover:text-saffron transition-colors uppercase relative" href="/federation">
              The Federation
              <span className="absolute -top-3 -right-4 bg-saffron text-white text-[9px] px-1.5 py-0.5 rounded-sm shadow-sm animate-pulse">NEW</span>
            </Link>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/consultation" className="hidden lg:flex bg-saffron text-white px-6 py-2.5 rounded-full font-bold text-sm tracking-wide hover:bg-forest transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200">
              CONSULT NOW
            </Link>
            <Link href="/checkout" className="p-2 hover:bg-forest/10 rounded-full transition-all relative text-forest group">
              <span className="material-symbols-outlined text-[28px] group-hover:scale-110 transition-transform">shopping_cart</span>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-[11px] flex justify-center items-center rounded-full font-bold shadow-sm border border-white">
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

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 bg-white/95 backdrop-blur-xl transition-all duration-300 transform ${mobileMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}>
        <div className="flex flex-col h-full pt-28 pb-10 px-6">
          <nav className="flex flex-col gap-6 text-xl font-bold text-forest tracking-wide">
            <Link className="hover:text-saffron transition-colors uppercase border-b border-slate-100 pb-2" href="/heritage" onClick={() => setMobileMenuOpen(false)}>The Legacy</Link>
            <Link className="hover:text-saffron transition-colors uppercase border-b border-slate-100 pb-2" href="/founders" onClick={() => setMobileMenuOpen(false)}>The Founders</Link>
            <Link className="hover:text-saffron transition-colors uppercase border-b border-slate-100 pb-2" href="/shop" onClick={() => setMobileMenuOpen(false)}>Shop</Link>
            <Link className="hover:text-saffron transition-colors uppercase border-b border-slate-100 pb-2 relative inline-flex items-center gap-3 w-fit" href="/federation" onClick={() => setMobileMenuOpen(false)}>
              The Federation
              <span className="bg-saffron text-white text-[10px] px-2 py-0.5 rounded-sm">NEW</span>
            </Link>
            <Link className="hover:text-saffron transition-colors uppercase border-b border-slate-100 pb-2" href="/journal" onClick={() => setMobileMenuOpen(false)}>The Journal</Link>
            <Link className="hover:text-saffron transition-colors uppercase border-b border-slate-100 pb-2" href="/consultation" onClick={() => setMobileMenuOpen(false)}>Book Consultation</Link>
          </nav>

          <div className="mt-auto space-y-4">
            <Link href="/consultation" className="flex justify-center w-full bg-saffron text-white px-6 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:bg-forest transition-colors shadow-lg" onClick={() => setMobileMenuOpen(false)}>
              CONSULT EXPERT VAIDYAS
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
