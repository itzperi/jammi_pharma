
"use client";
import React, { useState, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useFederationStore } from '../store/federationStore';
import AdminLoginModal from './admin/AdminLoginModal';

const Footer: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const isMahanarayana = pathname === '/product/mahanarayana';
  const { incrementFooterClick } = useFederationStore();

  const [adminClicks, setAdminClicks] = useState(0);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [modalRole, setModalRole] = useState<'editor' | 'admin'>('admin');
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleLogoClick = () => {
    // Thresholds: Home (5), Founders (3), Heritage (3), Federation (3)
    const threshold = pathname === '/' ? 5 : (pathname === '/founders' || pathname === '/heritage' || pathname === '/federation') ? 3 : null;
    
    // Check if it's a product page (starts with /product/)
    const isProductPage = pathname?.startsWith('/product/');
    const finalThreshold = isProductPage ? 3 : threshold;

    if (finalThreshold === null) return;

    const newClicks = adminClicks + 1;
    setAdminClicks(newClicks);

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }

    if (newClicks >= finalThreshold) {
      // Determine role: editor for federation and product pages, admin for others
      const role = (pathname === '/federation' || isProductPage) ? 'editor' : 'admin';
      setIsAdminModalOpen(true);
      setModalRole(role); // Need to add this state
      setAdminClicks(0);
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        setAdminClicks(0);
      }, 2000);
    }
  };

  return (
    <footer className={`${isMahanarayana ? 'bg-white text-slate-800 border-t border-slate-200' : 'bg-forest text-white/80 border-t-2 border-saffron'} py-16 relative`}>
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">

        {/* Column 1: Brand */}
        <div className="space-y-6">
          <div className={`flex items-center gap-2 ${isMahanarayana ? 'text-primary' : 'text-saffron'} cursor-pointer group select-none`} onClick={handleLogoClick}>
            <h4 className="text-3xl font-extrabold tracking-tight uppercase">JAMMI</h4>
          </div>
          <blockquote className={`${isMahanarayana ? 'text-slate-600' : 'text-white'} italic text-lg leading-relaxed font-serif`}>
            "Medicine is not an experiment. It is a legacy. 128 years of proof that authentic healthcare belongs to the practitioners of India."
          </blockquote>
          <div className="flex gap-4 pt-4">
            <a className={`w-10 h-10 rounded-full ${isMahanarayana ? 'bg-slate-100 hover:bg-primary text-slate-600 hover:text-white' : 'bg-white/10 hover:bg-saffron hover:text-white'} flex items-center justify-center transition-colors`} href="#" aria-label="Facebook">
              <span className="font-bold">f</span>
            </a>
            <a className={`w-10 h-10 rounded-full ${isMahanarayana ? 'bg-slate-100 hover:bg-primary text-slate-600 hover:text-white' : 'bg-white/10 hover:bg-saffron hover:text-white'} flex items-center justify-center transition-colors`} href="#" aria-label="Instagram">
              <span className="font-bold">in</span>
            </a>
            <a className={`w-10 h-10 rounded-full ${isMahanarayana ? 'bg-slate-100 hover:bg-primary text-slate-600 hover:text-white' : 'bg-white/10 hover:bg-saffron hover:text-white'} flex items-center justify-center transition-colors`} href="#" aria-label="LinkedIn">
              <span className="font-bold">li</span>
            </a>
            <a className={`w-10 h-10 rounded-full ${isMahanarayana ? 'bg-slate-100 hover:bg-primary text-slate-600 hover:text-white' : 'bg-white/10 hover:bg-saffron hover:text-white'} flex items-center justify-center transition-colors`} href="#" aria-label="YouTube">
              <span className="font-bold">yt</span>
            </a>
          </div>
        </div>

        {/* Column 2: Navigation */}
        <div className="space-y-6">
          <h5 className={`${isMahanarayana ? 'text-slate-400' : 'text-white/50'} font-bold uppercase tracking-widest text-xs`}>NAVIGATION</h5>
          <ul className={`space-y-4 text-base font-serif ${isMahanarayana ? 'text-slate-700' : 'text-white'}`}>
            <li><Link className={`${isMahanarayana ? 'hover:text-primary' : 'hover:text-saffron'} transition-colors`} href="/heritage">Heritage</Link></li>
            <li><Link className={`${isMahanarayana ? 'hover:text-primary' : 'hover:text-saffron'} transition-colors`} href="/founders">Founders</Link></li>
            <li><Link className={`${isMahanarayana ? 'hover:text-primary' : 'hover:text-saffron'} transition-colors`} href="/shop">Pharmacy</Link></li>
            <li><Link className={`${isMahanarayana ? 'hover:text-primary' : 'hover:text-saffron'} transition-colors`} href="/partners">Partner With Us (NEW)</Link></li>
            <li><Link className={`${isMahanarayana ? 'hover:text-primary' : 'hover:text-saffron'} transition-colors`} href="/federation">Federation</Link></li>
            <li><Link className={`${isMahanarayana ? 'hover:text-primary' : 'hover:text-saffron'} transition-colors`} href="/journal">Journal</Link></li>
          </ul>
        </div>

        {/* Column 3: The Fortress */}
        <div className="space-y-6">
          <h5 className={`${isMahanarayana ? 'text-slate-400' : 'text-white/50'} font-bold uppercase tracking-widest text-xs`}>THE FORTRESS</h5>
          <div className={`space-y-2 font-serif ${isMahanarayana ? 'text-slate-700' : 'text-white'}`}>
            <p className="font-bold leading-relaxed">
              ABHIRAMI 2B, DR. NAIR ROAD,<br />
              T. NAGAR, CHENNAI - 600 017
            </p>
            <p className={`pt-2 ${isMahanarayana ? 'hover:text-primary' : 'hover:text-saffron'} transition-colors cursor-pointer`}>+91 90430 20764</p>
            <p className={`${isMahanarayana ? 'hover:text-primary' : 'hover:text-saffron'} transition-colors cursor-pointer`}>frontdesk@jammi.org</p>
          </div>
        </div>

      </div>

      {/* Bottom bar */}
      <div className={`max-w-7xl mx-auto px-6 mt-16 pt-8 border-t ${isMahanarayana ? 'border-slate-200 text-slate-400' : 'border-white/10 text-white/50'} flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] sm:text-xs tracking-widest uppercase font-bold`}>
        <p className="cursor-pointer select-none" onClick={incrementFooterClick}>© 2025 JAMMI PHARMACEUTICALS. ALL RIGHTS RESERVED.</p>
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
          <a className={`${isMahanarayana ? 'hover:text-slate-600' : 'hover:text-white'} transition-colors`} href="#">Quality Protocols</a>
          <span className="hidden sm:inline">|</span>
          <a className={`${isMahanarayana ? 'hover:text-slate-600' : 'hover:text-white'} transition-colors`} href="#">Legal Charter</a>
          <span className="hidden sm:inline">|</span>
          <a className={`${isMahanarayana ? 'hover:text-slate-600' : 'hover:text-white'} transition-colors`} href="#">Wholesale Policy</a>
        </div>
      </div>
      <AdminLoginModal 
        isOpen={isAdminModalOpen} 
        onClose={() => setIsAdminModalOpen(false)} 
        roleToGrant={modalRole}
      />
    </footer>
  );
};

export default Footer;
