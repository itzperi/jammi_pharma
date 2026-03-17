"use client";
import React, { useState, useEffect } from 'react';
import { fetchCollection, createDocument, updateDocument, deleteDocument } from '../../../lib/adminDb';
import ImageUploader from '../../../components/ImageUploader';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  status: 'Draft' | 'Published';
  createdAt: string;
}

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link?: string;
  isActive: boolean;
}

export default function AdminCMS() {
  const [activeTab, setActiveTab] = useState<'banners' | 'blogs' | 'site_content'>('banners');

  // Site Content
  const [siteContent, setSiteContent] = useState<any>(null);
  const [isSiteContentLoading, setIsSiteContentLoading] = useState(false);
  
  // Site Content Form States
  const [heroBadge, setHeroBadge] = useState('');
  const [heroTitleLines, setHeroTitleLines] = useState(['', '', '']);
  const [heroSubtext, setHeroSubtext] = useState('');
  const [claimHeadline, setClaimHeadline] = useState(['', '', '']);
  const [claimQuote, setClaimQuote] = useState('');
  const [fedHeadline, setFedHeadline] = useState(['', '', '', '']);
  const [fedSubtext, setFedSubtext] = useState('');
  const [partnerQuote, setPartnerQuote] = useState('');

  // Banners
  const [banners, setBanners] = useState<Banner[]>([]);
  const [isBannerLoading, setIsBannerLoading] = useState(true);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  
  // Blogs
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [isBlogLoading, setIsBlogLoading] = useState(true);
  const [isBlogModalOpen, setIsBlogModalOpen] = useState(false);

  // Form States - Banner
  const [bannerTitle, setBannerTitle] = useState('');
  const [bannerSubtitle, setBannerSubtitle] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const [bannerLink, setBannerLink] = useState('');

  // Form States - Blog
  const [blogTitle, setBlogTitle] = useState('');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogImage, setBlogImage] = useState('');

  useEffect(() => {
    loadBanners();
    loadBlogs();
    loadSiteContent();
  }, []);

  async function loadSiteContent() {
    setIsSiteContentLoading(true);
    try {
      const data = await fetchCollection('site_content');
      const homepage = data.find((d: any) => d.id === 'homepage') as any;
      if (homepage) {
        setSiteContent(homepage);
        setHeroBadge(homepage.heroBadge || '');
        setHeroTitleLines(homepage.heroTitleLines || ['', '', '']);
        setHeroSubtext(homepage.heroSubtext || '');
        setClaimHeadline(homepage.claimHeadline || ['', '', '']);
        setClaimQuote(homepage.claimQuote || '');
        setFedHeadline(homepage.fedHeadline || ['', '', '', '']);
        setFedSubtext(homepage.fedSubtext || '');
        setPartnerQuote(homepage.partnerQuote || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSiteContentLoading(false);
    }
  }

  const handleUpdateSiteContent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedData = {
        heroBadge,
        heroTitleLines,
        heroSubtext,
        claimHeadline,
        claimQuote,
        fedHeadline,
        fedSubtext,
        partnerQuote,
      };
      await updateDocument('site_content', 'homepage', updatedData);
      setSiteContent({ ...siteContent, ...updatedData });
      alert("Site content updated successfully!");
    } catch (err) {
      console.error("Error updating site content", err);
    }
  };

  async function loadBanners() {
    setIsBannerLoading(true);
    try {
      const b = await fetchCollection('banners') as Banner[];
      setBanners(b);
    } catch (err) {
      console.error(err);
    } finally {
      setIsBannerLoading(false);
    }
  }

  async function loadBlogs() {
    setIsBlogLoading(true);
    try {
      const b = await fetchCollection('blogs') as BlogPost[];
      setBlogs(b.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    } catch (err) {
      console.error(err);
    } finally {
      setIsBlogLoading(false);
    }
  }

  const handleCreateBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newBanner = { title: bannerTitle, subtitle: bannerSubtitle, imageUrl: bannerImage, link: bannerLink, isActive: true };
      const id = await createDocument('banners', newBanner);
      setBanners([...banners, { ...newBanner, id }]);
      setIsBannerModalOpen(false);
      setBannerTitle(''); setBannerSubtitle(''); setBannerImage(''); setBannerLink('');
    } catch (err) {
      console.error("Error creating banner", err);
    }
  };

  const handleCreateBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const newBlog = { title: blogTitle, excerpt: blogExcerpt, content: blogContent, imageUrl: blogImage, status: 'Published' as const };
      const id = await createDocument('blogs', newBlog);
      setBlogs([{ ...newBlog, id, createdAt: new Date().toISOString() }, ...blogs]);
      setIsBlogModalOpen(false);
      setBlogTitle(''); setBlogExcerpt(''); setBlogContent(''); setBlogImage('');
    } catch (err) {
      console.error("Error creating blog", err);
    }
  };

  const toggleBannerStatus = async (id: string, currentStatus: boolean) => {
    try {
      await updateDocument('banners', id, { isActive: !currentStatus });
      setBanners(banners.map(b => b.id === id ? { ...b, isActive: !currentStatus } : b));
    } catch (err) {
      console.error(err);
    }
  };

  const deleteBanner = async (id: string) => {
    if (confirm("Delete this banner?")) {
      try {
        await deleteDocument('banners', id);
        setBanners(banners.filter(b => b.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const deleteBlog = async (id: string) => {
    if (confirm("Delete this blog post?")) {
      try {
        await deleteDocument('blogs', id);
        setBlogs(blogs.filter(b => b.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Content Management System</h1>
        {activeTab === 'banners' ? (
          <button onClick={() => setIsBannerModalOpen(true)} className="bg-forest text-white px-6 py-2.5 rounded-md font-bold hover:bg-forest/90 transition-colors shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">add</span> Add Banner
          </button>
        ) : (
          <button onClick={() => setIsBlogModalOpen(true)} className="bg-forest text-white px-6 py-2.5 rounded-md font-bold hover:bg-forest/90 transition-colors shadow-sm flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">add</span> Add Blog Post
          </button>
        )}
      </div>

      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setActiveTab('banners')}
          className={`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'banners' ? 'border-forest text-forest' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Homepage Banners
        </button>
        <button 
          onClick={() => setActiveTab('blogs')}
          className={`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'blogs' ? 'border-forest text-forest' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Blog Posts
        </button>
        <button 
          onClick={() => setActiveTab('site_content')}
          className={`px-6 py-3 font-bold text-sm uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'site_content' ? 'border-forest text-forest' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Site Content
        </button>
      </div>

      {activeTab === 'site_content' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 max-w-4xl">
          <h2 className="text-2xl font-bold mb-8 text-slate-800 border-b pb-4">Homepage Content Management</h2>
          <form onSubmit={handleUpdateSiteContent} className="space-y-8">
            {/* Hero Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-forest uppercase tracking-widest border-l-4 border-saffron pl-4">Hero Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="col-span-full">
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Top Badge Text</label>
                  <input type="text" value={heroBadge} onChange={e => setHeroBadge(e.target.value)} className="w-full border border-slate-300 rounded px-4 py-2 focus:outline-none focus:border-forest" />
                </div>
                {heroTitleLines.map((line, idx) => (
                  <div key={idx} className={idx === 2 ? "col-span-full" : ""}>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Headline Line {idx + 1}</label>
                    <input type="text" value={line} onChange={e => {
                      const newLines = [...heroTitleLines];
                      newLines[idx] = e.target.value;
                      setHeroTitleLines(newLines);
                    }} className="w-full border border-slate-300 rounded px-4 py-2 focus:outline-none focus:border-forest" />
                  </div>
                ))}
                <div className="col-span-full">
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Hero Subtext</label>
                  <textarea value={heroSubtext} onChange={e => setHeroSubtext(e.target.value)} rows={2} className="w-full border border-slate-300 rounded px-4 py-2 focus:outline-none focus:border-forest" />
                </div>
              </div>
            </div>

            {/* Claim Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-forest uppercase tracking-widest border-l-4 border-saffron pl-4">"The Jammi Claim" Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {claimHeadline.map((line, idx) => (
                  <div key={idx} className={idx === 2 ? "col-span-full" : ""}>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Claim Headline Line {idx + 1}</label>
                    <input type="text" value={line} onChange={e => {
                      const newLines = [...claimHeadline];
                      newLines[idx] = e.target.value;
                      setClaimHeadline(newLines);
                    }} className="w-full border border-slate-300 rounded px-4 py-2 focus:outline-none focus:border-forest" />
                  </div>
                ))}
                <div className="col-span-full">
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Section Quote</label>
                  <textarea value={claimQuote} onChange={e => setClaimQuote(e.target.value)} rows={3} className="w-full border border-slate-300 rounded px-4 py-2 focus:outline-none focus:border-forest italic" />
                </div>
              </div>
            </div>

            {/* Federation Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-forest uppercase tracking-widest border-l-4 border-saffron pl-4">Federation Section</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {fedHeadline.map((line, idx) => (
                  <div key={idx}>
                    <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Fed Headline Line {idx + 1}</label>
                    <input type="text" value={line} onChange={e => {
                      const newLines = [...fedHeadline];
                      newLines[idx] = e.target.value;
                      setFedHeadline(newLines);
                    }} className="w-full border border-slate-300 rounded px-4 py-2 focus:outline-none focus:border-forest" />
                  </div>
                ))}
                <div className="col-span-full">
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Federation Subtext</label>
                  <textarea value={fedSubtext} onChange={e => setFedSubtext(e.target.value)} rows={2} className="w-full border border-slate-300 rounded px-4 py-2 focus:outline-none focus:border-forest" />
                </div>
              </div>
            </div>

            {/* Partnership Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-forest uppercase tracking-widest border-l-4 border-saffron pl-4">Partnership Quote</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1 uppercase tracking-wider">Practitioner Quote (Black Box)</label>
                  <textarea value={partnerQuote} onChange={e => setPartnerQuote(e.target.value)} rows={3} className="w-full border border-slate-300 rounded px-4 py-2 focus:outline-none focus:border-forest italic" />
                </div>
              </div>
            </div>

            <div className="pt-8 border-t flex justify-end">
              <button type="submit" className="bg-forest text-white px-12 py-3 rounded font-bold hover:bg-forest/90 transition-all shadow-lg hover:shadow-forest/20">
                Save All Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'banners' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isBannerLoading ? (
            <div className="col-span-full p-12 text-center text-slate-500 flex flex-col items-center">
              <div className="w-8 h-8 border-4 border-forest border-t-transparent rounded-full animate-spin mb-4"></div>
              <p>Loading banners...</p>
            </div>
          ) : banners.length === 0 ? (
            <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-xl shadow-sm border border-slate-200">
              <span className="material-symbols-outlined text-4xl mb-2">view_carousel</span>
              <p>No banners added yet.</p>
            </div>
          ) : (
            banners.map(banner => (
              <div key={banner.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                <div className="h-40 bg-slate-100 relative">
                  {banner.imageUrl ? (
                    <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400">
                      <span className="material-symbols-outlined text-4xl">image</span>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button onClick={() => toggleBannerStatus(banner.id, banner.isActive)} className={`px-2 py-1 text-[10px] uppercase font-bold rounded shadow-sm ${banner.isActive ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-slate-500 text-white hover:bg-slate-600'}`}>
                      {banner.isActive ? 'Active' : 'Hidden'}
                    </button>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-slate-800 line-clamp-1">{banner.title}</h3>
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2">{banner.subtitle}</p>
                  <div className="mt-auto pt-4 flex justify-between items-center">
                    {banner.link ? <span className="text-xs text-blue-600 truncate">{banner.link}</span> : <span className="text-xs text-slate-400">No link</span>}
                    <button onClick={() => deleteBanner(banner.id)} className="text-slate-400 hover:text-red-600 transition-colors">
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'blogs' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-200">
                  <th className="p-4 font-bold">Image</th>
                  <th className="p-4 font-bold">Title</th>
                  <th className="p-4 font-bold">Date Published</th>
                  <th className="p-4 font-bold">Status</th>
                  <th className="p-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100 text-slate-700">
                {isBlogLoading ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-500">Loading blogs...</td>
                  </tr>
                ) : blogs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-500"><span className="material-symbols-outlined text-4xl mb-2">article</span><p>No blog posts found.</p></td>
                  </tr>
                ) : (
                  blogs.map((blog) => (
                    <tr key={blog.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="w-12 h-12 bg-slate-100 rounded border border-slate-200 overflow-hidden flex items-center justify-center">
                          {blog.imageUrl ? <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover" /> : <span className="material-symbols-outlined text-slate-400">image</span>}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-slate-900">
                        {blog.title}
                        <p className="text-xs text-slate-500 font-normal line-clamp-1 mt-0.5">{blog.excerpt}</p>
                      </td>
                      <td className="p-4 text-slate-500">{new Date(blog.createdAt).toLocaleDateString()}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-[10px] uppercase tracking-wider font-bold rounded ${blog.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-slate-100 text-slate-800'}`}>
                          {blog.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2 whitespace-nowrap">
                         <button className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 px-2 py-1 rounded transition-colors" title="Edit">
                           <span className="material-symbols-outlined text-[18px]">edit</span>
                         </button>
                         <button onClick={() => deleteBlog(blog.id)} className="text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded transition-colors" title="Delete">
                           <span className="material-symbols-outlined text-[18px]">delete</span>
                         </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Banner Modal */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setIsBannerModalOpen(false)} />
          <div className="relative z-10 w-full max-w-lg bg-white p-8 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">Add Homepage Banner</h2>
            <form onSubmit={handleCreateBanner} className="space-y-4">
              <div><label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Title</label>
              <input type="text" value={bannerTitle} onChange={e => setBannerTitle(e.target.value)} required className="w-full border border-slate-300 rounded px-4 py-2 focus:outline-none focus:border-forest" /></div>
              <div><label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Subtitle</label>
              <input type="text" value={bannerSubtitle} onChange={e => setBannerSubtitle(e.target.value)} className="w-full border border-slate-300 rounded px-4 py-2 focus:outline-none focus:border-forest" /></div>
              <div><label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Image</label>
              <ImageUploader bucket="site-assets" folder="banners" onUpload={(url) => setBannerImage(url)} currentUrl={bannerImage} label="Upload Banner Image" />
              </div>
              <div><label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Link</label>
              <input type="text" value={bannerLink} onChange={e => setBannerLink(e.target.value)} placeholder="/shop" className="w-full border border-slate-300 rounded px-4 py-2 focus:outline-none focus:border-forest" /></div>
              <div className="flex justify-end gap-3 mt-6 pt-4"><button type="button" onClick={() => setIsBannerModalOpen(false)} className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded">Cancel</button><button type="submit" className="bg-forest text-white px-6 py-2.5 rounded font-bold hover:bg-forest/90">Save Banner</button></div>
            </form>
          </div>
        </div>
      )}

      {/* Blog Modal */}
      {isBlogModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="absolute inset-0 cursor-pointer" onClick={() => setIsBlogModalOpen(false)} />
          <div className="relative z-10 w-full max-w-2xl bg-white p-8 rounded-xl shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 text-slate-800">New Blog Post</h2>
            <form onSubmit={handleCreateBlog} className="space-y-4">
              <div><label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Title</label>
              <input type="text" value={blogTitle} onChange={e => setBlogTitle(e.target.value)} required className="w-full border border-slate-300 rounded px-4 py-2 focus:outline-none focus:border-forest" /></div>
              <div><label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Excerpt</label>
              <textarea value={blogExcerpt} onChange={e => setBlogExcerpt(e.target.value)} rows={2} required className="w-full border border-slate-300 rounded px-4 py-2 focus:outline-none focus:border-forest" /></div>
              <div><label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Content</label>
              <textarea value={blogContent} onChange={e => setBlogContent(e.target.value)} rows={6} required className="w-full border border-slate-300 rounded px-4 py-2 focus:outline-none focus:border-forest font-mono text-sm" placeholder="<p>Write your blog post HTML here...</p>" /></div>
              <div><label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Cover Image</label>
              <ImageUploader bucket="site-assets" folder="blogs" onUpload={(url) => setBlogImage(url)} currentUrl={blogImage} label="Upload Blog Cover" />
              </div>
              <div className="flex justify-end gap-3 mt-6 pt-4"><button type="button" onClick={() => setIsBlogModalOpen(false)} className="px-6 py-2.5 text-slate-600 font-bold hover:bg-slate-100 rounded">Cancel</button><button type="submit" className="bg-forest text-white px-6 py-2.5 rounded font-bold hover:bg-forest/90">Publish Post</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
