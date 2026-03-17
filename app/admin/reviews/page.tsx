"use client";
import React, { useState, useEffect } from 'react';
import { fetchCollection, updateDocument, deleteDocument } from '../../../lib/adminDb';

interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  rating: number;
  comment: string;
  imageUrl?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const r = await fetchCollection('reviews') as Review[];
      setReviews(r.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: Review['status']) => {
    try {
      await updateDocument('reviews', id, { status: newStatus });
      setReviews(reviews.map(r => r.id === id ? { ...r, status: newStatus } : r));
    } catch (err) {
      console.error("Error updating review status", err);
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteDocument('reviews', id);
        setReviews(reviews.filter(r => r.id !== id));
      } catch (err) {
        console.error("Error deleting review", err);
      }
    }
  };

  const filteredReviews = reviews.filter(r => {
    const matchesSearch = r.productName?.toLowerCase().includes(search.toLowerCase()) || 
                          r.customerName?.toLowerCase().includes(search.toLowerCase()) ||
                          r.comment?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? r.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-saffron">
        {[1,2,3,4,5].map(star => (
          <span key={star} className={`material-symbols-outlined text-[16px] ${star <= rating ? 'font-variation-settings-"FILL" 1' : ''}`}>
            star
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Reviews & Ratings</h1>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            type="text" 
            placeholder="Search by product, customer, or keyword..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-forest"
          />
        </div>
        <select 
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 border border-slate-300 rounded-md px-4 py-2 focus:outline-none focus:border-forest bg-white"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 font-bold">Product</th>
                <th className="p-4 font-bold">Customer</th>
                <th className="p-4 font-bold">Rating & Review</th>
                <th className="p-4 font-bold">Date</th>
                <th className="p-4 font-bold text-center">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin"></div>
                      <p>Loading reviews...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                     <span className="material-symbols-outlined text-4xl">reviews</span>
                     <p>No reviews found.</p>
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => (
                  <tr key={review.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-bold text-slate-900">{review.productName}</td>
                    <td className="p-4">{review.customerName}</td>
                    <td className="p-4 max-w-sm">
                      <div className="mb-1">{renderStars(review.rating)}</div>
                      <p className="text-xs text-slate-600 line-clamp-2">{review.comment}</p>
                      {review.imageUrl && (
                         <a href={review.imageUrl} target="_blank" rel="noreferrer" className="text-forest hover:underline text-[11px] flex items-center gap-1 mt-2">
                             <span className="material-symbols-outlined text-[14px]">image</span> View Image
                         </a>
                      )}
                    </td>
                    <td className="p-4 text-xs text-slate-500">{new Date(review.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold rounded-md ${
                        review.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        review.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {review.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                       {review.status === 'Pending' && (
                         <>
                           <button onClick={() => handleUpdateStatus(review.id, 'Approved')} className="text-green-600 hover:text-green-800 bg-green-50 hover:bg-green-100 px-3 py-1.5 rounded text-xs font-bold transition-colors border border-green-200">
                             Approve
                           </button>
                           <button onClick={() => handleUpdateStatus(review.id, 'Rejected')} className="text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded text-xs font-bold transition-colors border border-red-200">
                             Reject
                           </button>
                         </>
                       )}
                       {review.status !== 'Pending' && (
                         <button onClick={() => handleDelete(review.id)} className="text-slate-400 hover:text-red-600 px-2 py-1.5 rounded transition-colors" title="Delete">
                           <span className="material-symbols-outlined text-[18px]">delete</span>
                         </button>
                       )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
