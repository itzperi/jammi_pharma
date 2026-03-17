"use client";

import React, { useState, useEffect } from 'react';
import { useFederationStore } from '../../../store/federationStore';
import { subscribeToCollection, createDocument, updateDocument, deleteDocument } from '../../../lib/adminDb';
import ImageUploader from '../../../components/ImageUploader';

interface Bundle {
  id: string;
  name: string;
  productIds: string[];
  discountPercentage: number;
  isActive: boolean;
  imageUrl?: string;
  createdAt: string;
}

const BundlesPage = () => {
  const products = useFederationStore(state => state.products);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    discountPercentage: 0,
    isActive: true,
    imageUrl: '',
  });
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToCollection('bundles', (data: any[]) => {
      setBundles(data as Bundle[]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : 
              type === 'number' ? Number(value) : 
              value
    }));
  };

  const toggleProduct = (productId: string) => {
    setSelectedProductIds(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddClick = () => {
    setEditingId(null);
    setFormData({
      name: '',
      discountPercentage: 0,
      isActive: true,
      imageUrl: '',
    });
    setSelectedProductIds([]);
    setShowModal(true);
  };

  const handleEditClick = (bundle: Bundle) => {
    setEditingId(bundle.id);
    setFormData({
      name: bundle.name,
      discountPercentage: bundle.discountPercentage,
      isActive: bundle.isActive,
      imageUrl: bundle.imageUrl || '',
    });
    setSelectedProductIds(bundle.productIds || []);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this bundle?")) {
      try {
        await deleteDocument('bundles', id);
      } catch (error) {
        console.error("Error deleting bundle:", error);
        alert("Failed to delete bundle.");
      }
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.discountPercentage <= 0) {
      alert("Please provide a valid name and discount percentage.");
      return;
    }
    if (selectedProductIds.length < 2) {
      alert("A bundle must contain at least 2 products.");
      return;
    }

    try {
      const bundleData = {
        name: formData.name,
        discountPercentage: formData.discountPercentage,
        productIds: selectedProductIds,
        isActive: formData.isActive,
        imageUrl: formData.imageUrl,
        updatedAt: new Date().toISOString()
      };

      if (editingId) {
        await updateDocument('bundles', editingId, bundleData);
      } else {
        await createDocument('bundles', {
          ...bundleData,
          createdAt: new Date().toISOString()
        });
      }
      setShowModal(false);
    } catch (error) {
      console.error("Error saving bundle:", error);
      alert("Failed to save bundle.");
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateDocument('bundles', id, { isActive: !currentStatus });
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
          <h1 className="text-3xl font-bold serif text-forest mb-2">Product Bundles</h1>
          <p className="text-slate-600">Group items to create combo discounts and suggestions.</p>
        </div>
        <button 
          onClick={handleAddClick}
          className="bg-primary hover:bg-[#c07a28] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add_circle</span>
          Create Bundle
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-cream-dark overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-cream/30 border-b border-cream-dark">
                <th className="p-4 font-bold text-forest">Bundle Name</th>
                <th className="p-4 font-bold text-forest">Products Included</th>
                <th className="p-4 font-bold text-forest text-center">Discount</th>
                <th className="p-4 font-bold text-forest text-center">Status</th>
                <th className="p-4 font-bold text-forest text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bundles.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No bundles found. Create your first product bundle!
                  </td>
                </tr>
              ) : (
                bundles.map((bundle) => (
                  <tr key={bundle.id} className="border-b border-cream-dark hover:bg-cream/10 transition-colors">
                    <td className="p-4 font-bold text-primary">{bundle.name}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {bundle.productIds.map(id => {
                          const prod = products.find(p => p.id === id);
                          return (
                            <span key={id} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200" title={prod?.name}>
                              {prod ? (prod.name.length > 20 ? prod.name.substring(0,20)+'...' : prod.name) : 'Unknown Product'}
                            </span>
                          );
                        })}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-center text-green-700">{bundle.discountPercentage}%</td>
                    <td className="p-4 text-center">
                      <button 
                        onClick={() => toggleStatus(bundle.id, bundle.isActive)}
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          bundle.isActive ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {bundle.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleEditClick(bundle)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button 
                          onClick={() => handleDelete(bundle.id)}
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
          <div className="bg-white rounded-2xl w-full max-w-2xl overflow-hidden shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-cream-dark flex items-center justify-between bg-cream/20 flex-shrink-0">
              <h2 className="text-2xl font-bold serif text-forest">
                {editingId ? 'Edit Bundle' : 'Create Bundle'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-700 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              <form id="bundleForm" onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Bundle Name</label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Skin Essentials Kit"
                      className="w-full border-cream-dark rounded-xl h-12 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Discount Percentage (%)</label>
                    <input 
                      type="number" 
                      name="discountPercentage"
                      value={formData.discountPercentage}
                      onChange={handleInputChange}
                      min="1"
                      placeholder="e.g. 10"
                      className="w-full border-cream-dark rounded-xl h-12 focus:ring-primary"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Bundle Image</label>
                    <ImageUploader 
                      bucket="bundle-images"
                      folder="bundles"
                      currentUrl={formData.imageUrl}
                      onUpload={(url) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                      label="Upload Bundle Image"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <input 
                    type="checkbox" 
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="w-5 h-5 text-primary focus:ring-primary border-cream-dark rounded"
                  />
                  <label htmlFor="isActive" className="font-bold text-slate-700 cursor-pointer">
                    Activate Bundle Immediately
                  </label>
                </div>

                <div className="border-t border-cream-dark pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-bold text-slate-700">Select Products for Bundle</label>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-bold">
                      {selectedProductIds.length} selected
                    </span>
                  </div>
                  
                  <div className="bg-slate-50 border border-cream-dark rounded-xl p-4 max-h-[300px] overflow-y-auto">
                    {products.length === 0 ? (
                      <p className="text-sm text-slate-500 text-center py-4">No products available in the store.</p>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {products.map(product => {
                          const isSelected = selectedProductIds.includes(product.id);
                          return (
                            <div 
                              key={product.id}
                              onClick={() => toggleProduct(product.id)}
                              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                                isSelected ? 'bg-primary/5 border-primary shadow-sm' : 'bg-white border-cream-dark hover:border-primary/30'
                              }`}
                            >
                              <div className={`w-5 h-5 rounded flex items-center justify-center border flex-shrink-0 ${
                                isSelected ? 'bg-primary border-primary text-white' : 'border-slate-300 bg-white'
                              }`}>
                                {isSelected && <span className="material-symbols-outlined text-[14px]">check</span>}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className={`text-sm font-bold truncate ${isSelected ? 'text-primary' : 'text-slate-700'}`}>
                                  {product.name}
                                </p>
                                <p className="text-xs text-slate-500 truncate">{product.category}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </form>
            </div>

            <div className="p-6 border-t border-cream-dark bg-cream/20 flex items-center justify-end gap-3 flex-shrink-0">
              <button 
                type="button"
                onClick={() => setShowModal(false)}
                className="px-6 py-2.5 rounded-xl text-slate-600 font-medium hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                form="bundleForm"
                className="bg-primary hover:bg-[#c07a28] text-white px-8 py-2.5 rounded-xl font-bold transition-all shadow-md"
              >
                Save Bundle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BundlesPage;
