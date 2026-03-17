"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminSidebar from '../../components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const session = sessionStorage.getItem("jammi_admin_session");
    if (session === "true") {
      setIsAuthenticated(true);
    } else {
      router.push('/');
    }
  }, [router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-saffron border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="tracking-widest text-saffron uppercase font-bold text-sm">Verifying Access...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 overflow-hidden font-body">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10 relative">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
