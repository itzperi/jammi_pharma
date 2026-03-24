'use client';

import { useState, useEffect, useRef } from 'react';
import { imagesApi, cmsApi } from '../lib/adminApi';

interface EditorImageProps {
  src: string;
  alt: string;
  cmsKey: { page: string, section: string, content_key: string };
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function EditorImage({
  src, alt, cmsKey, width = 400, height = 400, className = '', style = {}
}: EditorImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [replacing, setReplacing] = useState(false);
  const [editorActive, setEditorActive] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const active = localStorage.getItem("jammi_cms_session") === 'true';
      setEditorActive(active);
    }
  }, []);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const localUrl = URL.createObjectURL(file);
    const prevSrc = currentSrc;
    setCurrentSrc(localUrl); // instant feedback
    
    setReplacing(true);
    try {
      // Upload via server-side API
      const newUrl = await imagesApi.upload(file, 'cms-images', cmsKey.page);
      
      // Persist URL to cms_content table
      await cmsApi.saveContent([{
        page: cmsKey.page,
        section: cmsKey.section,
        content_key: cmsKey.content_key,
        content_value: newUrl,
        content_type: 'image_url'
      }]);

      setCurrentSrc(newUrl);
    } catch (error: any) {
      console.error("Replacement failed", error);
      alert("Failed to upload image: " + (error.message || "Unknown error"));
      setCurrentSrc(prevSrc); // revert on failure
    } finally {
      setReplacing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  const handleClick = () => {
    if (editorActive) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => editorActive && setIsHovered(true)}
      onMouseLeave={() => editorActive && setIsHovered(false)}
      style={{
        cursor: editorActive ? 'pointer' : 'default',
        position: 'relative',
        display: 'inline-block',
        ...style
      }}
      className={`group overflow-hidden ${className}`}
    >
      <img 
        src={currentSrc} 
        alt={alt} 
        width={width} 
        height={height} 
        className="w-full h-full object-cover transition-transform group-hover:scale-105" 
      />

      {editorActive && (
        <>
          {/* Green Overlay */}
          <div className={`absolute inset-0 bg-green-600/60 flex flex-col items-center justify-center transition-opacity z-10 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <span className="material-symbols-outlined text-white text-3xl mb-1">photo_camera</span>
            <span className="text-white font-bold text-xs uppercase tracking-tighter">Click to Change</span>
          </div>

          {/* Uploading Spinner */}
          {replacing && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-20">
              <span className="material-symbols-outlined text-white text-3xl animate-spin">sync</span>
              <span className="text-white font-bold text-[10px] mt-1 uppercase">Uploading...</span>
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </>
      )}
    </div>
  );
}
