"use client";

import React, { useState, useEffect } from 'react';
import { subscribeToCollection, createDocument, updateDocument, deleteDocument } from '../../../lib/adminDb';

interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  isActive: boolean;
  createdAt?: string;
}

const CouponsPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'fixed',
    discountValue: 0,
    minOrderAmount: 0,
    isActive: true,
  });

  useEffect(() => {
    const unsubscribe = subscribeToCollection('coupons', (data: any[]) => {
      setCoupons(data as Coupon[]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as any;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? Number(value) : 
              value
    }));
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 0,
      minOrderAmount: 0,
      isActive: true,
    });
    setShowModal(true);
  };

  const handleEditClick = (coupon: Coupon) => {
    setEditingId(coupon.id);
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      isActive: coupon.isActive,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this coupon?")) {
      try {
        await deleteDocument('coupons', id);
      } catch (error) {
        console.error("Error deleting coupon:", error);
        alert("Failed to delete coupon.");
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.code || formData.discountValue <= 0) {
      alert("Please provide a valid code and discount value.");
      return;
    }

    try {
      const couponData = {
        code: formData.code.toUpperCase(),
        discountType: formData.discountType,
        discountValue: formData.discountValue,
        minOrderAmount: formData.minOrderAmount,
        isActive: formData.isActive,
        updatedAt: new Date().toISOString()
      };

      if (editingId) {
        await updateDocument('coupons', editingId, couponData);
      } else {
        await createDocument('coupons', {
          ...couponData,
          createdAt: new Date().toISOString()
        });
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error saving coupon:", error);
      alert("Failed to save coupon.");
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateDocument('coupons', id, { isActive: !currentStatus });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="size-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1200px] mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold serif text-forest mb-2">Coupons</h1>
          <p className="text-slate-600">Create and manage discount codes for customers.</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="bg-primary hover:bg-[#c07a28] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Create Coupon
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-cream-dark overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream/30 border-b border-cream-dark">
                <th className="p-4 font-bold text-forest">Code</th>
                <th className="p-4 font-bold text-forest">Type</th>
                <th className="p-4 font-bold text-forest text-center">Value</th>
                <th className="p-4 font-bold text-forest text-center">Min Order (₹)</th>
                <th className="p-4 font-bold text-forest text-center">Status</th>
                <th className="p-4 font-bold text-forest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-500">
                    No coupons found. Create your first discount!
                  </td>
                </tr>
              ) : (
                coupons.map((coupon) => (
                  <tr key={coupon.id} className="border-b border-cream-dark hover:bg-cream/10 transition-colors">
                    <td className="p-4">
                      <span className="font-bold bg-primary/10 text-primary px-3 py-1 rounded-lg border border-primary/20 tracking-wider">
                        {coupon.code}
                      </span>
                    </td>
                    <td className="p-4 capitalize">{coupon.discountType}</td>
                    <td className="p-4 font-bold text-center">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                    </td>
                    <td className="p-4 text-center text-slate-600 font-medium">{coupon.minOrderAmount > 0 ? coupon.minOrderAmount : 'None'}</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleStatus(coupon.id, coupon.isActive)}
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          coupon.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditClick(coupon)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(coupon.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-sm">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
            <div className="p-6 border-b border-cream-dark flex items-center justify-between bg-cream/20">
              <h2 className="text-2xl font-bold serif text-forest">
                {editingId ? 'Edit Coupon' : 'Create Coupon'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Coupon Code</label>
                <input 
                  type="text" 
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="e.g. WELCOME10"
                  className="w-full border-cream-dark rounded-xl h-12 focus:ring-primary uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Discount Type</label>
                  <select 
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleInputChange}
                    className="w-full border-cream-dark rounded-xl h-12 focus:ring-primary"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Discount Value</label>
                  <input 
                    type="number" 
                    name="discountValue"
                    value={formData.discountValue}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full border-cream-dark rounded-xl h-12 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Minimum Order Amount (₹)</label>
                <input 
                  type="number" 
                  name="minOrderAmount"
                  value={formData.minOrderAmount}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full border-cream-dark rounded-xl h-12 focus:ring-primary"
                />
                <p className="text-xs text-slate-500 mt-1">Leave 0 if there's no minimum required.</p>
              </div>

              <div className="flex items-center gap-3 py-2">
                <input 
                  type="checkbox" 
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-5 h-5 text-primary focus:ring-primary border-cream-dark rounded flex-shrink-0"
                />
                <label htmlFor="isActive" className="font-bold text-slate-700 cursor-pointer select-none">
                  Activate Coupon Immediately
                </label>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="bg-primary hover:bg-[#c07a28] text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-md"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponsPage;
