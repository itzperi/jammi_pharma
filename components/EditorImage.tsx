'use client';

import { useState } from 'react';
import { replaceFile } from '../lib/storage';
import type { Bucket } from '../lib/storage';

interface EditorImageProps {
  src: string;
  alt: string;
  bucket: Bucket;
  folder: string;
  onUpdate: (newUrl: string) => void;
  editorActive: boolean;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function EditorImage({
  src, alt, bucket, folder, onUpdate, editorActive, width = 400, height = 400, className = '', style = {}
}: EditorImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [replacing, setReplacing] = useState(false);

  async function handleClick() {
    if (!editorActive) return;
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png,image/webp';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const localUrl = URL.createObjectURL(file);
      const prevSrc = currentSrc;
      setCurrentSrc(localUrl); // instant feedback
      
      setReplacing(true);
      try {
        const newUrl = await replaceFile(file, bucket, folder, prevSrc);
        setCurrentSrc(newUrl);
        onUpdate(newUrl);
      } catch (error) {
        console.error("Replacement failed", error);
        setCurrentSrc(prevSrc); // revert on failure
      } finally {
        setReplacing(false);
      }
    };
    input.click();
  }

  return (
    <div
      onClick={handleClick}
      style={{
        cursor: editorActive ? 'pointer' : 'default',
        outline: editorActive ? '2px dashed #22c55e' : 'none',
        outlineOffset: '2px',
        position: 'relative',
        display: 'inline-block',
        ...style
      }}
      title={editorActive ? 'Click to replace image' : undefined}
      className={className}
    >
      {replacing && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 10,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 14, borderRadius: 'inherit'
        }}>
          <span className="material-symbols-outlined animate-spin mr-2">refresh</span> Uploading...
        </div>
      )}
      <img src={currentSrc} alt={alt} width={width} height={height} className="w-full h-full object-cover rounded-inherit" style={{ borderRadius: 'inherit' }} />
    </div>
  );
}
