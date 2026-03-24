"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      // 1. Check localStorage first for quick UI skip (optional but helps)
      const sessionFlag = localStorage.getItem("jammi_admin_session");
      if (sessionFlag !== 'true') {
        router.push('/');
        return;
      }

      // 2. Verify with Supabase Auth
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        localStorage.removeItem("jammi_admin_session");
        router.push('/');
        return;
      }

      // 3. Verify admin record in DB
      const { data: adminRecord, error } = await supabase
        .from('admin_users')
        .select('status')
        .eq('auth_user_id', session.user.id)
        .eq('status', 'active')
        .single();

      if (error || !adminRecord) {
        localStorage.removeItem("jammi_admin_session");
        router.push('/');
        return;
      }

      setAuthorized(true);
    }

    checkAuth();
  }, [router]);

  if (authorized === null) {
    return (
      <div className="fixed inset-0 bg-[#0a0a0f] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-green-500/20 border-t-green-500 rounded-full animate-spin" />
          <p className="text-slate-400 font-medium tracking-widest text-xs uppercase">Authenticating Secure Session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
