"use client";
import React, { useState, useEffect } from 'react';
import { useAdmin } from './AdminContext';
import { updateDocument } from '../../lib/adminDb';

interface LiveEditableProps {
  collection: string;
  docId: string;
  field: string;
  children: React.ReactNode;
  multiline?: boolean;
  className?: string;
}

const LiveEditable: React.FC<LiveEditableProps> = ({ 
  collection, 
  docId, 
  field, 
  children, 
  multiline = false,
  className = "" 
}) => {
  const { isAdmin, isEditMode } = useAdmin();
  const [value, setValue] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [isEditorRole, setIsEditorRole] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const role = sessionStorage.getItem("jammi_role");
      setIsEditorRole(role === 'editor');
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

    if (children) {
      setValue(extractText(children));
    }
  }, [children]);

  // Only allow editing for 'editor' role (not 'admin')
  if (!isAdmin || !isEditMode || !isEditorRole) {
    return <span className={className}>{children}</span>;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowEditor(true);
  };

  const handleSave = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setIsSaving(true);
    try {
      await updateDocument(collection, docId, { [field]: value });
      setShowEditor(false);
    } catch (err) {
      console.error("LiveEdit Error:", err);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  if (showEditor) {
    return (
      <div className={`relative group inline-block w-full min-w-[200px] ${className}`}>
        {multiline ? (
          <textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-white border-2 border-saffron p-2 rounded text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron/20 min-h-[100px]"
            autoFocus
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-white border-2 border-saffron p-2 rounded text-slate-900 focus:outline-none focus:ring-2 focus:ring-saffron/20"
            autoFocus
          />
        )}
        <div className="absolute top-full right-0 mt-1 flex gap-2 z-[9999]">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSave();
            }}
            disabled={isSaving}
            className="bg-green-600 text-white p-2 rounded shadow-lg hover:bg-green-700 transition-all flex items-center justify-center pointer-events-auto"
            title="Save Changes"
          >
            <span className="material-symbols-outlined text-[18px]">
              {isSaving ? 'sync' : 'check'}
            </span>
          </button>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowEditor(false);
            }}
            className="bg-red-600 text-white p-2 rounded shadow-lg hover:bg-red-700 transition-all flex items-center justify-center pointer-events-auto"
            title="Cancel"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <span 
      onClick={handleClick}
      className={`relative group cursor-pointer inline-block border-2 border-dashed border-saffron/40 hover:border-saffron p-1 rounded transition-all hover:bg-saffron/5 select-none ${className}`}
      title="Click to Edit"
    >
      {children}
      <span className="absolute -top-3 -right-3 bg-saffron text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-[50]">
        <span className="material-symbols-outlined text-[14px]">edit</span>
      </span>
    </span>
  );
};

export default LiveEditable;
