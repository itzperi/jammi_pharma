"use client";
import React from 'react';
import { useFederationStore } from '../../store/federationStore';

export default function AdminBar() {
    const { isAdminLoggedIn, logoutAdmin } = useFederationStore();

    if (!isAdminLoggedIn) return null;

    return (
        <div className="fixed top-20 left-0 w-full z-[45] bg-[#1C1411] border-b border-[#C9A84C]/30 py-2 px-6 shadow-md flex justify-between items-center">
            <p className="font-['Cinzel',serif] text-[#C9A84C] text-[11px] tracking-[0.2em] font-bold">
                ⬡ SANCTUM MODE · FEDERATION ADMIN ACTIVE
            </p>
            <button 
                onClick={logoutAdmin}
                className="font-['Cinzel',serif] text-[#9E8E7E] text-[10px] tracking-widest hover:text-white transition-colors"
            >
                LOGOUT
            </button>
        </div>
    );
}
