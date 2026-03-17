"use client";
import React, { useState, useEffect } from 'react';
import { subscribeToCollection, deleteDocument, createDocument, updateDocument } from '../../../lib/adminDb';
import { useFederationStore } from '../../../store/federationStore';
import ImageUploader from '../../../components/ImageUploader';

interface Category {
  id: string;
  name: string;
  slug: string;
  parentCategory?: string | null;
  description?: string;
  image?: string;
  productCount?: number;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatParent, setNewCatParent] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  
  const { products } = useFederationStore();

  useEffect(() => {
    const unsub = subscribeToCollection('categories', (data) => {
      const cats = data as Category[];
      setCategories(cats);
      setIsLoading(false);
      
      // Auto-select first category if none is selected
      if (cats.length > 0) {
        setActiveCategoryId(prev => {
           if (!prev || !cats.find(c => c.id === prev)) return cats[0].id;
           return prev;
        });
      } else {
        setActiveCategoryId(null);
      }
    });
    return () => unsub();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete the category "${name}"?`)) {
      try {
        await deleteDocument('categories', id);
        // Products in this category will remain, but their category won't match anymore
        // It's a good idea to reset them if needed, but for now just delete the category
      } catch (err) {
        console.error("Error deleting category", err);
      }
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatSlug) return;
    try {
      const categoryData = {
        name: newCatName,
        slug: newCatSlug,
        parentCategory: newCatParent || null,
        description: newCatDesc,
        image: newCatImage,
      };
      
      let finalCategoryId = editingCategoryId;

      if (editingCategoryId) {
        await updateDocument('categories', editingCategoryId, categoryData);
      } else {
        const id = await createDocument('categories', { ...categoryData, productCount: 0 });
        finalCategoryId = id;
        setActiveCategoryId(id);
      }

      const promises = [];
      const originalCategoryName = editingCategoryId ? categories.find(c => c.id === editingCategoryId)?.name || '' : '';
      
      for (const pId of selectedProductIds) {
          promises.push(updateDocument('products', pId, { category: newCatName }));
      }
      
      if (editingCategoryId && originalCategoryName) {
          const originallyAssigned = products.filter(p => p.category === originalCategoryName);
          for (const p of originallyAssigned) {
              if (!selectedProductIds.includes(p.id)) {
                  promises.push(updateDocument('products', p.id, { category: 'Uncategorized' }));
              }
          }
      }

      await Promise.all(promises);

      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Error saving category", err);
    }
  };

  const resetForm = () => {
      setEditingCategoryId(null);
      setNewCatName('');
      setNewCatSlug('');
      setNewCatParent('');
      setNewCatDesc('');
      setNewCatImage('');
      setSelectedProductIds([]);
  };

  const handleCreateNew = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (cat: Category) => {
    setEditingCategoryId(cat.id);
    setNewCatName(cat.name);
    setNewCatSlug(cat.slug);
    setNewCatParent(cat.parentCategory || '');
    setNewCatDesc(cat.description || '');
    setNewCatImage(cat.image || '');
    setSelectedProductIds(products.filter(p => p.category === cat.name).map(p => p.id));
    setIsModalOpen(true);
  };

  const toggleProduct = (productId: string) => {
    setSelectedProductIds(prev => 
        prev.includes(productId) 
            ? prev.filter(id => id !== productId)
            : [...prev, productId]
    );
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setNewCatName(val);
    const generatedSlug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    if (!newCatSlug || newCatSlug === newCatName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')) {
      setNewCatSlug(generatedSlug);
    }
  };

  const activeCategory = categories.find(c => c.id === activeCategoryId);
  const activeCategoryProducts = activeCategory ? products.filter(p => p.category === activeCategory.name) : [];

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Category management</h1>
          <p className="text-slate-500 mt-1">Organize your products and group them into categories.</p>
        </div>
        <button 
          onClick={handleCreateNew}
          className="bg-forest text-white px-6 py-2.5 rounded-md font-bold hover:bg-forest/90 transition-colors shadow-sm flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          New Category
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1 min-h-0">
        {/* Sidebar: Categories List */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 bg-slate-50 shrink-0">
                <h2 className="font-bold text-slate-800 text-sm uppercase tracking-wider flex items-center gap-2">
                    <span className="material-symbols-outlined text-forest text-[18px]">folder</span>
                    All Categories
                </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto">
                {isLoading ? (
                    <div className="p-8 text-center text-slate-400">Loading...</div>
                ) : categories.length === 0 ? (
                    <div className="p-8 text-center text-slate-400 text-sm">No categories yet.</div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategoryId(cat.id)}
                                className={`w-full text-left p-4 transition-colors flex items-center justify-between group ${activeCategoryId === cat.id ? 'bg-forest/5 border-l-4 border-l-forest' : 'hover:bg-slate-50 border-l-4 border-l-transparent'}`}
                            >
                                <div>
                                    <div className={`font-bold text-sm ${activeCategoryId === cat.id ? 'text-forest' : 'text-slate-700'}`}>
                                        {cat.name}
                                    </div>
                                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">{cat.slug}</div>
                                </div>
                                <span className={`text-xs py-0.5 px-2 rounded-full ${activeCategoryId === cat.id ? 'bg-forest text-white' : 'bg-slate-100 text-slate-500'}`}>
                                    {products.filter(p => p.category === cat.name).length}
                               </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>

        {/* Main Content: Active Category Details */}
        <div className="w-full md:w-2/3 lg:w-3/4 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            {activeCategory ? (
                <>
                    <div className="p-6 border-b border-slate-100 shrink-0 bg-white sticky top-0 z-10">
                        <div className="flex justify-between items-start gap-4">
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight">{activeCategory.name}</h2>
                                {activeCategory.description && (
                                    <p className="text-slate-500 text-sm mt-1">{activeCategory.description}</p>
                                )}
                                {activeCategory.parentCategory && (
                                    <span className="inline-block mt-2 text-[10px] bg-slate-100 text-slate-600 px-2 py-1 rounded font-medium border border-slate-200">
                                        Subcategory of {activeCategory.parentCategory}
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(activeCategory)}
                                    className="bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                    Edit & Add Products
                                </button>
                                <button
                                    onClick={() => handleDelete(activeCategory.id, activeCategory.name)}
                                    className="bg-white border border-slate-200 text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 p-2 rounded-lg transition-all shadow-sm flex items-center justify-center cursor-pointer"
                                    title="Delete Category"
                                >
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">inventory_2</span>
                            Products in "{activeCategory.name}" ({activeCategoryProducts.length})
                        </h3>
                        
                        {activeCategoryProducts.length === 0 ? (
                            <div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center">
                                <span className="material-symbols-outlined text-4xl text-slate-300 mb-3">category</span>
                                <h4 className="text-slate-700 font-bold mb-1">No products assigned</h4>
                                <p className="text-slate-500 text-sm mb-4">You haven't added any products to this category yet.</p>
                                <button 
                                    onClick={() => handleEdit(activeCategory)}
                                    className="text-forest font-bold text-sm bg-forest/10 px-4 py-2 rounded-lg hover:bg-forest/20 transition-colors"
                                >
                                    Add Products Now
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {activeCategoryProducts.map(prod => (
                                    <div key={prod.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md hover:border-forest/30 transition-all flex flex-col group">
                                        <div className="aspect-[4/3] bg-slate-100 overflow-hidden relative">
                                            {prod.image ? (
                                                <img src={prod.image} alt={prod.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="material-symbols-outlined text-slate-300 text-3xl">image</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-3 flex-1 flex flex-col">
                                            <h4 className="font-bold text-slate-800 text-sm line-clamp-2 leading-tight mb-1">{prod.name}</h4>
                                            <div className="mt-auto pt-2 flex items-center justify-between">
                                                <span className="text-forest font-bold text-sm">₹{prod.price}</span>
                                                <span className="text-[10px] text-slate-400 border border-slate-200 bg-slate-50 px-1.5 py-0.5 rounded">{prod.label || 'Standard'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className="flex-1 flex items-center justify-center p-8 bg-slate-50">
                    <div className="text-center max-w-sm">
                        <span className="material-symbols-outlined text-6xl text-slate-200 mb-4 block">swipe_right</span>
                        <h3 className="text-lg font-bold text-slate-700 mb-2">Select a category</h3>
                        <p className="text-slate-500 text-sm">Choose a category from the sidebar to view and manage its products, or create a new one.</p>
                    </div>
                </div>
            )}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4">
          <div className="absolute inset-0 cursor-pointer" onClick={() => { setIsModalOpen(false); resetForm(); }} />
          <div className="relative z-10 w-full max-w-2xl bg-white p-8 rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <h2 className="text-2xl font-black mb-6 text-slate-800 shrink-0">{editingCategoryId ? 'Edit Category' : 'Add new category'}</h2>
            
            <form onSubmit={handleSaveCategory} className="flex flex-col gap-5 overflow-y-auto flex-1 pr-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Category name</label>
                  <input 
                    type="text" 
                    value={newCatName}
                    onChange={handleNameChange}
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest/50 transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Slug</label>
                  <input 
                    type="text" 
                    value={newCatSlug}
                    onChange={e => setNewCatSlug(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest/50 transition-all font-mono text-sm bg-slate-50 text-slate-600"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Parent category</label>
                  <select 
                    value={newCatParent}
                    onChange={e => setNewCatParent(e.target.value)}
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest/50 transition-all bg-white"
                  >
                    <option value="">None (Top Level)</option>
                    {categories.filter(c => !c.parentCategory && c.id !== editingCategoryId).map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Description (Optional)</label>
                  <textarea 
                    value={newCatDesc}
                    onChange={e => setNewCatDesc(e.target.value)}
                    rows={2}
                    className="w-full border border-slate-200 rounded-lg px-4 py-3 focus:outline-none focus:border-forest focus:ring-1 focus:ring-forest/50 transition-all resize-none"
                    placeholder="Briefly describe this category..."
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-1.5">Category Image</label>
                  <ImageUploader 
                    bucket="category-images"
                    folder="categories"
                    currentUrl={newCatImage}
                    onUpload={(url) => setNewCatImage(url)}
                    label="Upload Category Image"
                  />
                </div>
                
                <div className="md:col-span-2 border-t border-slate-100 pt-4 mt-2">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-bold text-slate-800">Assign Products to "{newCatName || 'Category'}"</label>
                    <span className="text-xs font-bold bg-forest text-white px-2 py-0.5 rounded-full">{selectedProductIds.length} selected</span>
                  </div>
                  <div className="border border-slate-200 rounded-xl p-4 max-h-[250px] overflow-y-auto bg-slate-50 gap-2 grid grid-cols-1 sm:grid-cols-2">
                    {products.length === 0 ? (
                      <p className="text-sm text-slate-500 italic col-span-2 text-center py-4">No products available in the store.</p>
                    ) : (
                      products.map(prod => (
                        <label key={prod.id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${selectedProductIds.includes(prod.id) ? 'bg-white border-forest/30 shadow-sm ring-1 ring-forest/10' : 'bg-transparent border-transparent hover:bg-white hover:border-slate-200'}`}>
                          <div className="mt-0.5">
                              <input 
                                type="checkbox" 
                                checked={selectedProductIds.includes(prod.id)}
                                onChange={() => toggleProduct(prod.id)}
                                className="w-4 h-4 text-forest focus:ring-forest rounded border-slate-300"
                              />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium truncate ${selectedProductIds.includes(prod.id) ? 'text-forest' : 'text-slate-700'}`}>
                              {prod.name}
                            </p>
                            <p className="text-[10px] text-slate-400 truncate mt-0.5">Current: {prod.category || 'None'}</p>
                          </div>
                        </label>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-5 border-t border-slate-100 shrink-0 bg-white">
                <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" className="bg-forest text-white px-8 py-2.5 rounded-lg font-bold hover:bg-forest/90 transition-all shadow-md hover:shadow-lg">
                  {editingCategoryId ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

