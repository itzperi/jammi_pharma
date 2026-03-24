"use client";
import React, { useState, useEffect } from 'react';
import { fetchCollection, updateDocument } from '../../../lib/adminDb';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  threshold: number;
  updatedAt: string;
}

export default function AdminInventory() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterLowStock, setFilterLowStock] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // temporary edit states
  const [editStock, setEditStock] = useState<number>(0);
  const [editThreshold, setEditThreshold] = useState<number>(0);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const p = await fetchCollection('products') as Product[];
      // ensure defaults
      const mapped = p.map(prod => ({
        ...prod,
        sku: prod.sku || `SKU-${prod.id.substring(0, 6).toUpperCase()}`,
        threshold: prod.threshold || 10
      }));
      setProducts(mapped);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleEditClick = (product: Product) => {
    setEditingId(product.id);
    setEditStock(product.stock);
    setEditThreshold(product.threshold);
  };

  const handleSaveEdit = async (id: string) => {
    try {
      await updateDocument('products', id, { stock: editStock, threshold: editThreshold });
      setProducts(products.map(p => p.id === id ? { 
        ...p, 
        stock: editStock, 
        threshold: editThreshold,
        updatedAt: new Date().toISOString()
      } : p));
      setEditingId(null);
    } catch (err) {
      console.error("Error updating stock", err);
      alert('Failed to update stock.');
    }
  };

  const exportCSV = () => {
    const headers = ['Product Name', 'SKU', 'Category', 'Current Stock', 'Threshold', 'Last Updated'];
    const rows = products.map(p => [
      `"${p.name}"`, 
      p.sku, 
      p.category, 
      p.stock, 
      p.threshold, 
      new Date(p.updatedAt).toLocaleDateString()
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `inventory_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase());
    const matchesStock = filterLowStock ? Number(p.stock) <= Number(p.threshold) : true;
    return matchesSearch && matchesStock;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Inventory Management</h1>
        <button 
          onClick={exportCSV}
          className="bg-forest text-white px-4 py-2 rounded-md font-bold hover:bg-forest/90 transition-colors shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          Export Report
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex-1 relative w-full sm:w-auto">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            type="text" 
            placeholder="Search by product name or SKU..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:max-w-md pl-10 pr-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:border-forest"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer bg-slate-50 px-4 py-2 rounded border border-slate-200 hover:bg-slate-100 transition-colors">
          <input 
            type="checkbox" 
            checked={filterLowStock}
            onChange={(e) => setFilterLowStock(e.target.checked)}
            className="w-4 h-4 text-forest focus:ring-forest rounded border-slate-300"
          />
          <span className="text-sm font-bold text-slate-700">Show Low Stock Only</span>
        </label>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                <th className="p-4 font-bold">Product Name</th>
                <th className="p-4 font-bold">SKU</th>
                <th className="p-4 font-bold">Category</th>
                <th className="p-4 font-bold text-center">Current Stock</th>
                <th className="p-4 font-bold text-center">Threshold</th>
                <th className="p-4 font-bold">Last Updated</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin"></div>
                      <p>Loading inventory...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                     <span className="material-symbols-outlined text-4xl">warehouse</span>
                     <p>No products match your inventory search.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isEditing = editingId === product.id;
                  const isLow = Number(product.stock) <= Number(product.threshold);
                  
                  return (
                    <tr key={product.id} className={`hover:bg-slate-50 transition-colors ${isLow && !isEditing ? 'bg-red-50/50' : ''}`}>
                      <td className="p-4 font-bold text-slate-900">{product.name}</td>
                      <td className="p-4 font-mono text-xs text-slate-500">{product.sku}</td>
                      <td className="p-4">{product.category}</td>
                      <td className="p-4 text-center">
                        {isEditing ? (
                          <input 
                            type="number" 
                            value={editStock}
                            onChange={(e) => setEditStock(Number(e.target.value))}
                            className="w-20 border border-slate-300 rounded px-2 py-1 text-center focus:outline-none focus:border-forest"
                            min="0"
                          />
                        ) : (
                          <span className={`inline-flex items-center justify-center w-10 h-6 font-bold rounded ${isLow ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'}`}>
                            {product.stock}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-center text-slate-500">
                        {isEditing ? (
                          <input 
                            type="number" 
                            value={editThreshold}
                            onChange={(e) => setEditThreshold(Number(e.target.value))}
                            className="w-20 border border-slate-300 rounded px-2 py-1 text-center focus:outline-none focus:border-forest"
                            min="0"
                          />
                        ) : (
                          product.threshold
                        )}
                      </td>
                      <td className="p-4 text-slate-500 text-xs">{product.updatedAt ? new Date(product.updatedAt).toLocaleString() : 'N/A'}</td>
                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                        {isEditing ? (
                          <>
                            <button onClick={() => handleSaveEdit(product.id)} className="text-sm bg-forest text-white hover:bg-forest/90 px-3 py-1 rounded font-bold transition-colors">Save</button>
                            <button onClick={() => setEditingId(null)} className="text-sm bg-slate-200 text-slate-700 hover:bg-slate-300 px-3 py-1 rounded font-bold transition-colors">Cancel</button>
                          </>
                        ) : (
                          <button onClick={() => handleEditClick(product)} className="text-blue-600 hover:text-blue-800 border border-blue-200 hover:bg-blue-50 px-3 py-1 rounded text-xs font-bold transition-colors">
                            Edit Stock
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
