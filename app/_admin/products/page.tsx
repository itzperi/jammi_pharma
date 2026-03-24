"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { productsApi, categoriesApi } from '@/lib/adminApi';
import { useToast } from '@/components/Toast';

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
  const { addToast } = useToast();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [bulkAction, setBulkAction] = useState('');

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productsApi.list({
        page: page.toString(),
        limit: limit.toString(),
        search,
        category: categoryFilter,
        status: statusFilter
      });
      setProducts(data.data || []);
      setTotal(data.total || 0);
    } catch (err: any) {
      addToast?.(err.message || 'Failed to load products', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await categoriesApi.list();
      setCategories(data.data || []);
    } catch (e) {
      console.error('Failed to load categories', e);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
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
          await productsApi.delete(id);
        }
        setSelectedIds(new Set());
        addToast?.(`Deleted ${selectedIds.size} products`, 'success');
        fetchProducts();
      }
    } else if (bulkAction === 'publish' || bulkAction === 'draft') {
      const status = bulkAction === 'publish' ? 'Published' : 'Draft';
      for (const id of Array.from(selectedIds)) {
        await productsApi.update(id, { status });
      }
      setSelectedIds(new Set());
      addToast?.(`Updated ${selectedIds.size} products to ${status}`, 'success');
      fetchProducts();
    }
    setBulkAction('');
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Delete '${name}'? This cannot be undone.`)) {
      try {
        await productsApi.delete(id);
        addToast?.('Product deleted successfully', 'success');
        fetchProducts();
      } catch (err: any) {
        addToast?.(err.message || 'Failed to delete product', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#f1f5f9]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>Product Management</h2>
          <p className="text-[#94a3b8] text-sm mt-1">{total} total products</p>
        </div>
        <Link 
          href="/admin/products/new" 
          className="bg-[#22c55e] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#16a34a] transition-colors flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add New Product
        </Link>
      </div>

      <div className="bg-[#111118] p-4 rounded-xl border border-[#16161f] flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-1 flex-col md:flex-row gap-4 w-full">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]">search</span>
            <input 
              type="text" 
              placeholder="Search products..." 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 bg-[#0a0a0f] border border-[#16161f] rounded-lg text-[#f1f5f9] focus:outline-none focus:border-[#22c55e]"
            />
          </div>
          <select 
            className="bg-[#0a0a0f] border border-[#16161f] rounded-lg px-4 py-2 focus:outline-none focus:border-[#22c55e] w-full md:w-auto text-[#f1f5f9]"
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <select 
            className="bg-[#0a0a0f] border border-[#16161f] rounded-lg px-4 py-2 focus:outline-none focus:border-[#22c55e] w-full md:w-auto text-[#f1f5f9]"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          >
            <option value="">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
          </select>
        </div>
        
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2 w-full md:w-auto bg-[#22c55e]/10 px-4 py-2 rounded-lg border border-[#22c55e]/20">
            <span className="text-sm font-semibold text-[#22c55e] whitespace-nowrap">{selectedIds.size} selected</span>
            <select 
              className="bg-[#0a0a0f] border border-[#16161f] rounded px-2 py-1 text-sm text-[#f1f5f9]"
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
              className="bg-[#22c55e] text-white px-3 py-1 text-sm rounded font-semibold disabled:opacity-50"
            >
              Apply
            </button>
          </div>
        )}
      </div>

      <div className="bg-[#111118] rounded-xl border border-[#16161f] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#16161f] text-[#94a3b8] text-xs uppercase tracking-wider border-b border-[#22c55e]/10">
                <th className="p-4 w-12">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.size === products.length && products.length > 0} 
                    onChange={toggleSelectAll}
                    className="rounded border-[#16161f] w-4 h-4 cursor-pointer accent-[#22c55e]"
                  />
                </th>
                <th className="p-4 font-semibold">Image</th>
                <th className="p-4 font-semibold">Product Name</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Price</th>
                <th className="p-4 font-semibold">Stock</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#16161f]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center">
                    <div className="w-8 h-8 border-4 border-[#22c55e]/20 border-t-[#22c55e] rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-12 text-center text-[#94a3b8]">
                    <span className="material-symbols-outlined text-4xl mb-2">inventory_2</span>
                    <p className="mt-2">No products found</p>
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr key={p.id} className="hover:bg-[#16161f] transition-colors">
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        checked={selectedIds.has(p.id)}
                        onChange={() => toggleSelect(p.id)}
                        className="rounded border-[#16161f] w-4 h-4 cursor-pointer accent-[#22c55e]"
                      />
                    </td>
                    <td className="p-4">
                      <div className="w-12 h-12 bg-[#0a0a0f] rounded-lg overflow-hidden">
                        {p.images?.[0] ? <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover"/> : <div className="w-full h-full flex items-center justify-center text-[#94a3b8]"><span className="material-symbols-outlined">image</span></div>}
                      </div>
                    </td>
                    <td className="p-4 font-medium text-[#f1f5f9]">
                      <Link href={`/admin/products/${p.id}/edit`} className="hover:text-[#22c55e] transition-colors">
                        {p.name}
                      </Link>
                    </td>
                    <td className="p-4 text-[#94a3b8]">{p.category || 'Uncategorized'}</td>
                    <td className="p-4 font-medium">
                        {p.discountPrice ? (
                            <div className="flex flex-col">
                                <span className="text-[#ef4444]">₹{p.discountPrice}</span>
                                <span className="text-[#94a3b8] line-through text-xs">₹{p.price}</span>
                            </div>
                        ) : (
                            <span className="text-[#f1f5f9]">₹{p.price}</span>
                        )}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        p.stock === 0 ? 'bg-red-500/20 text-red-400' : 
                        p.stock <= 10 ? 'bg-orange-500/20 text-orange-400' : 
                        'bg-green-500/20 text-green-400'
                      }`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${
                        p.status === 'published' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {p.status || 'draft'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <Link href={`/admin/products/${p.id}/edit`} className="inline-block text-[#94a3b8] hover:text-[#22c55e] transition-colors" title="Edit">
                        <span className="material-symbols-outlined text-[20px]">edit</span>
                      </Link>
                      <button onClick={() => handleDelete(p.id, p.name)} className="text-[#94a3b8] hover:text-red-500 transition-colors" title="Delete">
                        <span className="material-symbols-outlined text-[20px]">delete</span>
                      </button>
                      <Link href={`/product/${p.id}`} target="_blank" className="inline-block text-[#94a3b8] hover:text-blue-400 transition-colors" title="View on Site">
                        <span className="material-symbols-outlined text-[20px]">open_in_new</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {!isLoading && total > 0 && (
          <div className="p-4 border-t border-[#16161f] flex justify-between items-center text-sm text-[#94a3b8]">
            <div>
              Showing <span className="font-semibold text-[#f1f5f9]">{(page - 1) * limit + 1}</span> to <span className="font-semibold text-[#f1f5f9]">{Math.min(page * limit, total)}</span> of <span className="font-semibold text-[#f1f5f9]">{total}</span> products
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1 bg-[#16161f] rounded hover:bg-[#22c55e]/20 disabled:opacity-50 transition-colors"
              >
                Prev
              </button>
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={page * limit >= total}
                className="px-3 py-1 bg-[#16161f] rounded hover:bg-[#22c55e]/20 disabled:opacity-50 transition-colors"
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
