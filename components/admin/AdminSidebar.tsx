"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const navItems = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: 'dashboard' },
  { name: 'Products', path: '/admin/products', icon: 'inventory_2' },
  { name: 'Categories', path: '/admin/categories', icon: 'category' },
  { name: 'Orders', path: '/admin/orders', icon: 'shopping_cart' },
  { name: 'Customers', path: '/admin/customers', icon: 'group' },
  { name: 'Payments', path: '/admin/payments', icon: 'payments' },
  { name: 'Coupons', path: '/admin/coupons', icon: 'local_offer' },
  { name: 'Shipping', path: '/admin/shipping', icon: 'local_shipping' },
  { name: 'Reviews', path: '/admin/reviews', icon: 'reviews' },
  { name: 'Reports', path: '/admin/reports', icon: 'analytics' },
  { name: 'Bundles', path: '/admin/bundles', icon: 'loyalty' },
  { name: 'Federation', path: '/admin/federation', icon: 'forum' },
  { name: 'Partners', path: '/admin/partners', icon: 'handshake' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("jammi_admin_session");
    router.push('/');
  };

  return (
    <aside className="w-64 bg-slate-900 h-full flex flex-col shadow-xl flex-shrink-0 z-50">
      <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
        <h2 className="text-xl font-bold text-saffron tracking-wider select-none">JAMMI ADMIN</h2>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
            return (
              <li key={item.path}>
                <Link 
                  href={item.path}
                  className={`flex items-center gap-3 px-6 py-2.5 transition-all outline-none ${isActive ? 'bg-saffron/10 text-saffron border-r-4 border-saffron font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
                >
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
      <div className="p-4 border-t border-slate-700/50">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-slate-800 text-slate-300 hover:bg-red-600 hover:text-white px-4 py-2.5 rounded transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span className="font-bold text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
