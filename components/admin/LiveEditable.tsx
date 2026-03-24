"use client";
import React, { useState, useEffect, useRef } from 'react';
import { cmsApi, imagesApi } from '../../lib/adminApi';

interface LiveEditableProps {
  collection?: string;
  docId?: string;
  field?: string;
  cmsKey?: { page: string, section: string, content_key: string };
  children: React.ReactNode;
  multiline?: boolean;
  className?: string;
  inputType?: 'text' | 'number' | 'select' | 'image' | 'video';
  options?: { label: string; value: string }[];
  onValueChange?: (section: string, key: string, value: string) => void;
}

const LiveEditable: React.FC<LiveEditableProps> = ({ 
  collection, 
  docId, 
  field,
  cmsKey,
  children, 
  multiline = false,
  className = "",
  inputType = 'text',
  options = [],
  onValueChange
}) => {
  const [isAdminActive, setIsAdminActive] = useState(false);
  const [value, setValue] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [savePulse, setSavePulse] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const originalValueRef = useRef<string>('');

  useEffect(() => {
    const checkSession = () => {
      const active = localStorage.getItem("jammi_cms_session") === 'true';
      setIsAdminActive(active);
    };

    if (typeof window !== 'undefined') {
      checkSession();
      window.addEventListener('jammi_cms_unlocked', checkSession);
      window.addEventListener('storage', checkSession); // Sync across tabs if needed
      return () => {
        window.removeEventListener('jammi_cms_unlocked', checkSession);
        window.removeEventListener('storage', checkSession);
      }
    }
  }, []);

  useEffect(() => {
    const extractText = (node: any): string => {
      if (typeof node === 'string' || typeof node === 'number') return String(node);
      if (Array.isArray(node)) return node.map(extractText).join('');
      if (React.isValidElement(node) && (node.props as any).children) {
        return extractText((node.props as any).children);
      }
      return '';
    };

    if (inputType === 'image') {
       if (typeof children === 'string') setValue(children);
    } else if (children) {
      const text = extractText(children);
      setValue(text);
      originalValueRef.current = text;
    }
  }, [children, inputType]);

  if (!isAdminActive) {
    if (inputType === 'image') return <img src={value || (children as string)} className={className} alt="CMS Image" />;
    if (inputType === 'video') {
       const videoSrc = value || (children as string);
       if (videoSrc?.includes('youtube.com') || videoSrc?.includes('youtu.be')) {
          const videoId = videoSrc.includes('v=') ? videoSrc.split('v=')[1].split('&')[0] : videoSrc.split('/').pop();
          return <iframe src={`https://www.youtube.com/embed/${videoId}`} className={className} frameBorder="0" allowFullScreen title="CMS Video" />;
       }
       return <video src={videoSrc} className={className} controls />;
    }
    return <span className={className}>{children}</span>;
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inputType === 'image') {
       fileInput.current?.click();
    } else {
       setShowEditor(true);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsSaving(true);
    try {
      const url = await imagesApi.upload(file, 'cms-images', cmsKey?.page || 'general');
      setValue(url);
      await saveWithData(url);
    } catch (err: any) {
      console.error("Image Upload Error:", err);
      alert(err.message || "Upload failed");
    } finally {
      setIsSaving(false);
      if (fileInput.current) fileInput.current.value = '';
    }
  }

  const saveWithData = async (valToSave: string | number) => {
    if (cmsKey) {
        await cmsApi.saveContent([{
            page: cmsKey.page,
            section: cmsKey.section,
            content_key: cmsKey.content_key,
            content_value: String(valToSave),
            content_type: (inputType === 'image' || inputType === 'video') ? 'image_url' : (inputType === 'number' ? 'text' : 'text')
        }]);
        
        if (onValueChange) {
          onValueChange(cmsKey.section, cmsKey.content_key, String(valToSave));
        }
    } else if (collection && docId && field) {
        // Silent migration fallback - only uses cmsApi now
        await cmsApi.saveContent([{
            page: 'legacy_bridge',
            section: collection,
            content_key: `${docId}_${field}`,
            content_value: String(valToSave),
            content_type: 'text'
        }]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (multiline) {
        if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          handleSave();
        }
      } else {
        e.preventDefault();
        handleSave();
      }
    } else if (e.key === 'Escape') {
      setShowEditor(false);
      setValue(originalValueRef.current);
    }
  };

  const handleSave = async (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    
    const previousValue = originalValueRef.current;
    let valToSave: string | number = value;
    if (inputType === 'number') valToSave = Number(value);

    // --- OPTIMISTIC UPDATE ---
    setShowEditor(false);
    originalValueRef.current = String(valToSave);
    // -------------------------

    setIsSaving(true);
    try {
      await saveWithData(valToSave);
      // Success - trigger brief pulse
      setSavePulse(true);
      setTimeout(() => setSavePulse(false), 2000);
    } catch (err: any) {
      console.error("LiveEdit Error:", err);
      // --- REVERT ON FAILURE ---
      setValue(previousValue);
      originalValueRef.current = previousValue;
      setShowEditor(true);
      // -------------------------
      alert(err.message || "Failed to save to database");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValue(originalValueRef.current);
    setShowEditor(false);
  };

  if (inputType === 'image') {
    return (
      <span 
        onDoubleClick={handleDoubleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative group cursor-pointer inline-block transition-all select-none ${className}`}
        style={{ display: 'block' }}
        title="Double click to Change Image"
      >
        <img src={value || (children as string)} alt="CMS Visual" className={className} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        
        <div className={`absolute inset-0 bg-green-600/60 flex flex-col items-center justify-center transition-opacity z-[50] ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
           <span className="material-symbols-outlined text-white text-4xl mb-2">photo_camera</span>
           <span className="text-white font-bold text-sm tracking-wider uppercase">Click to change image</span>
        </div>

        {isSaving && (
          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-[60]">
             <span className="material-symbols-outlined text-white text-4xl animate-spin">sync</span>
             <span className="text-white font-bold text-sm mt-2">Uploading...</span>
          </div>
        )}

        <input type="file" accept="image/*" className="hidden" ref={fileInput} onChange={handleFileChange} />
      </span>
    );
  }

  if (showEditor) {
    let InputComponent;

    const stylingClass = "w-full bg-yellow-50 text-black border-2 border-green-500 p-1 focus:outline-none focus:ring-2 focus:ring-green-400";
    const inheritStyles = { fontSize: 'inherit', fontWeight: 'inherit', lineHeight: 'inherit', fontFamily: 'inherit', textAlign: 'inherit' as any };

    if (inputType === 'select') {
      InputComponent = (
        <select
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className={stylingClass}
          style={inheritStyles}
          autoFocus
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      );
    } else if (multiline && inputType === 'text') {
      InputComponent = (
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`${stylingClass} min-h-[100px]`}
          style={inheritStyles}
          autoFocus
        />
      );
    } else {
      InputComponent = (
        <input
          type={inputType === 'number' ? 'number' : 'text'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className={stylingClass}
          style={inheritStyles}
          autoFocus
        />
      );
    }

    return (
      <div className={`relative group inline-block w-full min-w-[100px] ${className}`}>
        {InputComponent}
        <div className="absolute top-full right-0 mt-2 flex gap-2 z-[9999]">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center hover:bg-green-600 transition shadow-lg"
            title="Save"
          >
            {isSaving ? (
              <span className="material-symbols-outlined text-[18px] animate-spin">sync</span>
            ) : (
              <span className="material-symbols-outlined text-[18px] font-bold">check</span>
            )}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center hover:bg-gray-500 transition shadow-lg"
            title="Cancel"
          >
            <span className="material-symbols-outlined text-[18px] font-bold">close</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <span 
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group cursor-text inline-block transition-all ${isHovered ? 'bg-yellow-50 outline outline-2 outline-yellow-400/50 rounded-sm' : ''} ${savePulse ? 'bg-green-100 ring-2 ring-green-500 rounded-sm' : ''} ${className}`}
      style={{ whiteSpace: multiline ? 'pre-wrap' : 'inherit' }}
      title="Single click to navigate, Double click to Edit"
    >
      {value || children}
      {isHovered && (
        <span className="absolute -top-3 -right-3 w-6 h-6 bg-yellow-500 text-white rounded-full flex items-center justify-center z-[50] shadow-md pointer-events-none">
          <span className="material-symbols-outlined text-[12px]">edit</span>
        </span>
      )}
    </span>
  );
};

export default LiveEditable;
