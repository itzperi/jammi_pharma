import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { adminSessionApi } from '../../lib/adminApi'

export default function AdminGuard({ children }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    adminSessionApi.check().then(admin => {
      if (!admin) {
        router.replace('/')
      } else {
        setLoading(false)
      }
    })
  }, [router])

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', 
        backgroundColor: '#0a0a0f', color: '#f1f5f9', fontFamily: 'Inter, sans-serif' 
      }}>
        <div style={{
          width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.1)', 
          borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite'
        }} />
        <h3 style={{ marginTop: '20px', fontWeight: 500, letterSpacing: '1px' }}>Verifying admin access...</h3>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return <>{children}</>
}
