"use client";
import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import AdminGuard from '@/components/admin/AdminGuard';
import { ToastProvider } from '../../components/Toast';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [adminName, setAdminName] = useState('Admin');
  const [currentPath, setCurrentPath] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('jammi_admin_name');
    if (name) setAdminName(name);
    
    setCurrentPath(window.location.pathname);
  }, []);

  const getPageTitle = () => {
    const path = currentPath.replace('/admin/', '');
    if (!path || path === 'dashboard') return 'Dashboard';
    return path.charAt(0).toUpperCase() + path.slice(1);
  };

  return (
    <AdminGuard>
      <ToastProvider>
        <div className="flex h-screen bg-[#0a0a0f] text-[#f1f5f9] overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
          <AdminSidebar />
          <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 relative bg-[#0a0a0f]">
            <div className="max-w-7xl mx-auto">
              <header className="mb-8 flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-[#f1f5f9]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>{getPageTitle()}</h1>
                  <p className="text-[#94a3b8] text-sm mt-1">Welcome back, {adminName}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-[#111118] px-4 py-2 rounded-lg border border-[#22c55e]/20">
                    <p className="text-[#94a3b8] text-xs">Session Active</p>
                    <p className="text-[#22c55e] text-sm font-semibold flex items-center gap-1">
                      <span className="w-2 h-2 bg-[#22c55e] rounded-full animate-pulse"></span>
                      Verified
                    </p>
                  </div>
                </div>
              </header>
              {children}
            </div>
          </main>
        </div>
      </ToastProvider>
    </AdminGuard>
  );
}
