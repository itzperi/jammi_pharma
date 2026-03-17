"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  images?: string[];
  discountPrice?: number;
}

export default function AdminProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<{id: string, name: string}[]>([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState('');

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const q = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search,
        category: categoryFilter,
        status: statusFilter
      });
      const res = await fetch(`/api/admin/products?${q.toString()}`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      // Temporarily mock or fetch from your generic firebase helper
      // Replace with actual categories endpoint if you make one, or use subscribeToCollection
      const res = await fetch('/api/admin/categories'); // Assuming this exists or falls back
      // Using firebase directly for categories to reuse the existing code snippet if possible
    } catch (e) {}
  };

  useEffect(() => {
    fetchProducts();
  }, [page, search, categoryFilter, statusFilter]);

  const toggleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(products.map(p => p.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedIds.size === 0) return;
    
    if (bulkAction === 'delete') {
      if (confirm(`Are you sure you want to delete ${selectedIds.size} products?`)) {
        for (const id of Array.from(selectedIds)) {
          await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
        }
        setSelectedIds(new Set());
        fetchProducts();
      }
    } else if (bulkAction === 'publish' || bulkAction === 'draft') {
      const status = bulkAction === 'publish' ? 'Published' : 'Draft';
      for (const id of Array.from(selectedIds)) {
        await fetch(`/api/admin/products/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
      }
      setSelectedIds(new Set());
      fetchProducts();
    }
    setBulkAction('');
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete '${name}'? This cannot be undone.`)) {
      await fetch(`/api/admin/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Product Management</h1>
        <Link 
          href="/admin/products/new" 
          className="bg-forest text-white px-6 py-2.5 rounded-md font-bold hover:bg-forest/90 transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add New Product
        </Link>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 flex-col md:flex-row gap-4 w-full">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-forest"
            />
          </div>
          <select 
            className="border border-slate-300 rounded-md px-4 py-2 focus:outline-none focus:border-forest w-full md:w-auto bg-white"
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Categories</option>
            <option value="Wellness">Wellness</option>
            <option value="Skin & Hair Care">Skin & Hair Care</option>
            {/* Realistically loaded from DB */}
          </select>
          <select 
            className="border border-slate-300 rounded-md px-4 py-2 focus:outline-none focus:border-forest w-full md:w-auto bg-white"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Statuses</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
        
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 w-full md:w-auto bg-blue-50 px-4 py-2 rounded-md border border-blue-100">
            <span className="text-sm font-bold text-blue-800 whitespace-nowrap">{selectedIds.size} selected</span>
            <select 
              className="border border-slate-300 rounded-md px-2 py-1 text-sm focus:outline-none"
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
            >
              <option value="">Bulk Actions</option>
              <option value="delete">Delete Selected</option>
              <option value="publish">Mark as Published</option>
              <option value="draft">Mark as Draft</option>
            </select>
            <button 
              onClick={handleBulkAction}
              disabled={!bulkAction}
              className="bg-blue-600 text-white px-3 py-1 text-sm rounded disabled:opacity-50 font-bold"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 w-12">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.size === products.length && products.length > 0} 
                    onChange={toggleSelectAll}
                    className="rounded border-slate-300 w-4 h-4 cursor-pointer"
                  />
                </th>
                <th className="p-4 font-bold">Image</th>
                <th className="p-4 font-bold">Product Name</th>
                <th className="p-4 font-bold">Category</th>
                <th className="p-4 font-bold">Price</th>
                <th className="p-4 font-bold">Stock</th>
                <th className="p-4 font-bold">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-500">
                    <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-slate-500">No products found.</td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.has(p.id)}
                        onChange={() => toggleSelect(p.id)}
                        className="rounded border-slate-300 w-4 h-4 cursor-pointer"
                      />
                    </td>
                    <td className="p-4">
                      <div className="w-12 h-12 bg-slate-100 rounded overflow-hidden">
                        {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-slate-400"><span className="material-symbols-outlined">image</span></div>}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-slate-800">
                      <Link href={`/admin/products/${p.id}/edit`} className="hover:text-forest transition-colors">
                        {p.name}
                      </Link>
                    </td>
                    <td className="p-4 text-slate-600">{p.category}</td>
                    <td className="p-4 font-medium">
                        {p.discountPrice ? (
                            <div className="flex flex-col">
                                <span className="text-red-600">₹{p.discountPrice}</span>
                                <span className="text-slate-400 line-through text-xs">₹{p.price}</span>
                            </div>
                        ) : (
                            <span>₹{p.price}</span>
                        )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${p.stock <= 10 ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${p.status === 'Published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {p.status || 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link href={`/admin/products/${p.id}/edit`} className="inline-block text-slate-400 hover:text-forest transition-colors" title="Edit">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </Link>
                      <button onClick={() => handleDelete(p.id, p.name)} className="text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                      <Link href={`/product/${p.id}`} target="_blank" className="inline-block text-slate-400 hover:text-blue-600 transition-colors" title="View on Site">
                        <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Info */}
        {!isLoading && total > 0 && (
          <div className="p-4 border-t border-slate-200 flex justify-between items-center text-sm text-slate-600">
            <div>
              Showing <span className="font-bold">{(page - 1) * limit + 1}</span> to <span className="font-bold">{Math.min(page * limit, total)}</span> of <span className="font-bold">{total}</span> products
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50"
              >
                Prev
              </button>
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={page * limit >= total}
                className="px-3 py-1 border border-slate-300 rounded hover:bg-slate-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
