'use client'

import { useState, useCallback, createContext, useContext } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 99999, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {toasts.map(toast => (
          <div key={toast.id} style={{
            padding: '12px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: 500,
            background: toast.type === 'success' ? '#166534' : '#991b1b',
            color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            animation: 'slideIn 0.2s ease'
          }}>
            {toast.type === 'success' ? '✓ ' : '✕ '}{toast.message}
          </div>
        ))}
      </div>
      <style>{`@keyframes slideIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
    </ToastContext.Provider>
  )
}

export function useToast() { return useContext(ToastContext) }
