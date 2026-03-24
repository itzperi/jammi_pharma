"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { cmsApi } from '../../../lib/adminApi';
import { useToast } from '../../../components/Toast';

const PAGES = [
  { key: 'home', label: 'Homepage' },
  { key: 'federation', label: 'Federation' },
  { key: 'founders', label: 'Founders' },
  { key: 'shop', label: 'Shop' },
  { key: 'heritage', label: 'Heritage' },
  { key: 'footer', label: 'Footer' },
  { key: 'cart', label: 'Cart' },
  { key: 'consultation', label: 'Consultation' },
];

const SECTIONS: Record<string, string[]> = {
  home: ['hero', 'stats', 'featured', 'testimonials', 'cta'],
  federation: ['hero', 'mandate', 'benefits', 'forum', 'partners'],
  founders: ['hero', 'founder1', 'founder2', 'cta'],
  shop: ['hero', 'filters', 'featured', 'cta'],
  footer: ['brand', 'links', 'fortress', 'social'],
  cart: ['hero', 'summary', 'cta'],
  consultation: ['hero', 'form', 'cta'],
  heritage: ['hero', 'timeline', 'cta'],
};

interface ContentItem {
  page: string;
  section: string;
  content_key: string;
  content_value: string;
  content_type: string;
}

export default function AdminCMS() {
  const [selectedPage, setSelectedPage] = useState('home');
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const { addToast } = useToast();

  const loadContent = useCallback(async () => {
    setLoading(true);
    try {
      const data = await cmsApi.getContent(selectedPage);
      setContent(data || []);
      const values: Record<string, string> = {};
      (data || []).forEach((item: ContentItem) => {
        values[`${item.section}|${item.content_key}`] = item.content_value;
      });
      setEditValues(values);
    } catch (error: any) {
      addToast?.(error.message || 'Failed to load content', 'error');
    } finally {
      setLoading(false);
    }
  }, [selectedPage, addToast]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  const handleValueChange = (section: string, key: string, value: string) => {
    setEditValues(prev => ({
      ...prev,
      [`${section}|${key}`]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updates: any[] = [];
      
      Object.entries(editValues).forEach(([key, value]) => {
        const [section, content_key] = key.split('|');
        updates.push({
          page: selectedPage,
          section,
          content_key,
          content_value: value,
          content_type: 'text',
        });
      });

      await cmsApi.saveContent(updates);
      addToast?.('Content saved successfully', 'success');
      loadContent();
    } catch (error: any) {
      addToast?.(error.message || 'Failed to save content', 'error');
    } finally {
      setSaving(false);
    }
  };

  const getValue = (section: string, key: string, fallback: string = ''): string => {
    return editValues[`${section}|${key}`] || fallback;
  };

  const sections = SECTIONS[selectedPage] || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#f1f5f9]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            CMS Content Manager
          </h2>
          <p className="text-[#94a3b8] text-sm mt-1">Edit website content directly</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-[#22c55e] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#16a34a] disabled:opacity-50 transition-all flex items-center gap-2"
        >
          {saving ? (
            <>
              <span className="material-symbols-outlined animate-spin">sync</span>
              Saving...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined">save</span>
              Save Changes
            </>
          )}
        </button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {PAGES.map(page => (
          <button
            key={page.key}
            onClick={() => setSelectedPage(page.key)}
            className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
              selectedPage === page.key
                ? 'bg-[#22c55e] text-white'
                : 'bg-[#111118] text-[#94a3b8] hover:bg-[#16161f] hover:text-[#f1f5f9]'
            }`}
          >
            {page.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="bg-[#111118] rounded-xl border border-[#16161f] p-12">
          <div className="flex items-center justify-center gap-3 text-[#94a3b8]">
            <span className="material-symbols-outlined animate-spin">sync</span>
            <span>Loading content...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {sections.map(section => (
            <div key={section} className="bg-[#111118] rounded-xl border border-[#16161f] p-6">
              <h3 className="text-[#f1f5f9] font-semibold uppercase tracking-wider mb-4 pb-3 border-b border-[#16161f]">
                {section.replace(/_/g, ' ')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getKeysForSection(section).map(key => (
                  <div key={key} className="space-y-2">
                    <label className="text-[#94a3b8] text-xs font-semibold uppercase tracking-wider">
                      {key.replace(/_/g, ' ')}
                    </label>
                    {isMultilineKey(key) ? (
                      <textarea
                        value={getValue(section, key, getDefaultValue(key))}
                        onChange={(e) => handleValueChange(section, key, e.target.value)}
                        rows={3}
                        className="w-full bg-[#0a0a0f] border border-[#16161f] rounded-lg px-4 py-2.5 text-[#f1f5f9] focus:outline-none focus:border-[#22c55e] transition-colors resize-none"
                      />
                    ) : (
                      <input
                        type="text"
                        value={getValue(section, key, getDefaultValue(key))}
                        onChange={(e) => handleValueChange(section, key, e.target.value)}
                        className="w-full bg-[#0a0a0f] border border-[#16161f] rounded-lg px-4 py-2.5 text-[#f1f5f9] focus:outline-none focus:border-[#22c55e] transition-colors"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-[#111118] rounded-xl border border-[#16161f] p-6">
        <h3 className="text-[#f1f5f9] font-semibold uppercase tracking-wider mb-4">
          Quick Reference
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="bg-[#0a0a0f] rounded-lg p-3">
            <p className="text-[#94a3b8]">Total Items</p>
            <p className="text-[#f1f5f9] font-semibold">{content.length}</p>
          </div>
          <div className="bg-[#0a0a0f] rounded-lg p-3">
            <p className="text-[#94a3b8]">Current Page</p>
            <p className="text-[#f1f5f9] font-semibold capitalize">{selectedPage}</p>
          </div>
          <div className="bg-[#0a0a0f] rounded-lg p-3">
            <p className="text-[#94a3b8]">Sections</p>
            <p className="text-[#f1f5f9] font-semibold">{sections.length}</p>
          </div>
          <div className="bg-[#0a0a0f] rounded-lg p-3">
            <p className="text-[#94a3b8]">Last Updated</p>
            <p className="text-[#f1f5f9] font-semibold">
              {content[0]?.updated_at ? new Date(content[0].updated_at).toLocaleDateString() : 'Never'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function getKeysForSection(section: string): string[] {
  const commonKeys: Record<string, string[]> = {
    hero: ['badge', 'title', 'subtitle', 'description', 'cta_text', 'cta_link', 'image_url'],
    stats: ['stat1_value', 'stat1_label', 'stat2_value', 'stat2_label', 'stat3_value', 'stat3_label'],
    featured: ['title', 'subtitle', 'product_ids'],
    cta: ['title', 'subtitle', 'button_text', 'button_link'],
    mandate: ['title', 'description', 'points'],
    benefits: ['title', 'benefit1_title', 'benefit1_desc', 'benefit2_title', 'benefit2_desc', 'benefit3_title', 'benefit3_desc'],
    forum: ['title', 'description'],
    partners: ['title', 'description', 'cta_text'],
    founder1: ['name', 'role', 'bio', 'quote', 'image_url', 'linkedin'],
    founder2: ['name', 'role', 'bio', 'quote', 'image_url', 'linkedin'],
    brand: ['quote', 'tagline'],
    links: ['heritage', 'founders', 'pharmacy', 'partner', 'federation', 'journal'],
    fortress: ['address', 'phone', 'email'],
    social: ['facebook', 'instagram', 'linkedin', 'youtube'],
    filters: ['title', 'subtitle'],
    form: ['title', 'subtitle', 'button_text'],
    timeline: ['title', 'subtitle', 'year1_event', 'year2_event', 'year3_event'],
    summary: ['title', 'subtitle'],
  };

  const keys = commonKeys[section] || ['title', 'subtitle', 'description', 'image_url'];
  return [...new Set(keys)];
}

function isMultilineKey(key: string): boolean {
  return ['description', 'bio', 'quote', 'address', 'content', 'points', 'year1_event', 'year2_event', 'year3_event'].some(k => key.includes(k));
}

function getDefaultValue(key: string): string {
  const defaults: Record<string, string> = {
    badge: 'New',
    title: 'Enter title...',
    subtitle: 'Enter subtitle...',
    description: 'Enter description...',
    cta_text: 'Learn More',
    button_text: 'Get Started',
    image_url: '',
  };
  return defaults[key] || '';
}
