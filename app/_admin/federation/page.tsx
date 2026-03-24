"use client";
import React, { useState, useEffect } from 'react';
import { fetchCollection, updateDocument, deleteDocument } from '../../../lib/adminDb';

interface FederationPost {
  id: string;
  authorName: string;
  title: string;
  content: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: string;
  upvotes?: number;
}

export default function AdminFederation() {
  const [posts, setPosts] = useState<FederationPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  
  // Modal state
  const [selectedPost, setSelectedPost] = useState<FederationPost | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    try {
      const p = await fetchCollection('federation_posts') as FederationPost[];
      setPosts(p.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleUpdateStatus = async (id: string, newStatus: FederationPost['status']) => {
    try {
      await updateDocument('federation_posts', id, { status: newStatus });
      setPosts(posts.map(p => p.id === id ? { ...p, status: newStatus } : p));
      if (selectedPost?.id === id) {
        setSelectedPost({ ...selectedPost, status: newStatus });
      }
    } catch (err) {
      console.error(err);
      alert('Failed to update status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this federation post permanently?")) {
      try {
        await deleteDocument('federation_posts', id);
        setPosts(posts.filter(p => p.id !== id));
        if (selectedPost?.id === id) setSelectedPost(null);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title?.toLowerCase().includes(search.toLowerCase()) || 
                          p.authorName?.toLowerCase().includes(search.toLowerCase()) ||
                          p.content?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? p.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Federation Moderation</h1>
        <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-md font-bold text-sm shadow-sm flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">gavel</span>
          {posts.filter(p => p.status === 'Pending').length} Pending Review
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
          <input 
            type="text" 
            placeholder="Search posts..." 
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
                <th className="p-4 font-bold">Author</th>
                <th className="p-4 font-bold">Post Details</th>
                <th className="p-4 font-bold">Date Published</th>
                <th className="p-4 font-bold text-center">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100 text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin"></div>
                      <p>Loading federation posts...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3">
                     <span className="material-symbols-outlined text-4xl">forum</span>
                     <p>No federation posts found.</p>
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-forest/20 text-forest rounded-full flex items-center justify-center font-bold text-xs uppercase">
                          {post.authorName?.charAt(0) || 'A'}
                        </div>
                        <span className="font-bold text-slate-900">{post.authorName || 'Anonymous'}</span>
                      </div>
                    </td>
                    <td className="p-4 max-w-sm">
                      <p className="font-bold text-slate-800 line-clamp-1">{post.title}</p>
                      <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{post.content}</p>
                    </td>
                    <td className="p-4 text-xs text-slate-500">{new Date(post.createdAt).toLocaleDateString()}</td>
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold rounded-md ${
                        post.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                        post.status === 'Approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {post.status || 'Pending'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                       <button onClick={() => setSelectedPost(post)} className="text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded text-xs font-bold transition-colors border border-blue-200">
                         Review Post
                       </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedPost && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setSelectedPost(null)} />
          <div className="relative z-10 w-full max-w-2xl bg-white rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50 rounded-t-xl">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Post Review</h2>
                <p className="text-sm text-slate-500 mt-1">Submitted on {new Date(selectedPost.createdAt).toLocaleString()}</p>
              </div>
              <button onClick={() => setSelectedPost(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                 <span className="material-symbols-outlined text-2xl">close</span>
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 space-y-6">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <div className="w-12 h-12 bg-forest/20 text-forest rounded-full flex items-center justify-center font-bold text-lg uppercase">
                  {selectedPost.authorName?.charAt(0) || 'A'}
                </div>
                <div>
                  <p className="font-bold text-slate-900">{selectedPost.authorName || 'Anonymous'}</p>
                  <p className="text-xs text-slate-500">Author</p>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">{selectedPost.title}</h3>
                <div className="prose prose-sm max-w-none text-slate-600 space-y-4 whitespace-pre-wrap leading-relaxed">
                  {selectedPost.content}
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                <span className="material-symbols-outlined text-slate-400 text-[18px]">thumb_up</span>
                <span className="text-sm font-bold text-slate-600">{selectedPost.upvotes || 0} Upvotes</span>
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 bg-slate-50 rounded-b-xl flex justify-between items-center">
              <button 
                onClick={() => handleDelete(selectedPost.id)}
                className="text-red-600 hover:text-red-800 px-4 py-2 rounded text-sm font-bold transition-colors flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span> Delete
              </button>

              <div className="flex gap-3">
                {selectedPost.status !== 'Rejected' && (
                  <button 
                    onClick={() => handleUpdateStatus(selectedPost.id, 'Rejected')}
                    className="px-6 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded text-sm font-bold transition-colors"
                  >
                    Reject Post
                  </button>
                )}
                {selectedPost.status !== 'Approved' && (
                  <button 
                    onClick={() => handleUpdateStatus(selectedPost.id, 'Approved')}
                    className="px-6 py-2 bg-green-600 text-white hover:bg-green-700 rounded text-sm font-bold transition-colors shadow-sm"
                  >
                    Approve & Publish
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
