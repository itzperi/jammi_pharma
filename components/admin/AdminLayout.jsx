import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { adminSessionApi } from '../../lib/adminApi'
import Link from 'next/link'

export default function AdminLayout({ children, title }) {
  const router = useRouter()
  const [adminName, setAdminName] = useState('')

  useEffect(() => {
    setAdminName(localStorage.getItem('jammi_admin_name') || 'Admin')
  }, [])

  const handleLogout = async () => {
    await adminSessionApi.logout()
    router.push('/')
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard' },
    { label: 'Products', path: '/admin/products' },
    { label: 'Categories', path: '/admin/categories' },
    { label: 'Orders', path: '/admin/orders' },
    { label: 'Customers', path: '/admin/customers' },
    { label: 'Reviews', path: '/admin/reviews' },
    { label: 'Inventory', path: '/admin/inventory' },
    { label: 'Coupons', path: '/admin/coupons' },
    { label: 'Bundles', path: '/admin/bundles' },
    { label: 'Shipping', path: '/admin/shipping' },
    { label: 'CMS', path: '/admin/cms' },
    { label: 'Federation', path: '/admin/federation' },
    { label: 'Roles', path: '/admin/roles' },
    { label: 'Reports', path: '/admin/reports' }
  ]

  return (
    <div className="admin-root">
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Plus+Jakarta+Sans:wght@600;700&display=swap');
        
        .admin-root {
          --bg-primary: #0a0a0f;
          --bg-secondary: #111118;
          --bg-card: #16161f;
          --bg-glass: rgba(255,255,255,0.04);
          --border: rgba(255,255,255,0.08);
          --border-hover: rgba(255,255,255,0.15);
          --accent-green: #22c55e;
          --accent-emerald: #10b981;
          --text-primary: #f1f5f9;
          --text-secondary: #94a3b8;
          --text-muted: #475569;
          
          font-family: 'Inter', sans-serif;
          background-color: var(--bg-primary);
          color: var(--text-primary);
          min-height: 100vh;
          display: flex;
        }

        .admin-sidebar {
          width: 240px;
          background-color: var(--bg-secondary);
          border-right: 1px solid var(--border);
          position: fixed;
          top: 0; left: 0; bottom: 0;
          display: flex;
          flex-direction: column;
          z-index: 100;
        }

        .admin-logo {
          height: 64px;
          display: flex;
          align-items: center;
          padding: 0 24px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 20px;
          font-weight: 700;
          border-bottom: 1px solid var(--border);
          color: var(--accent-emerald);
        }

        .admin-nav {
          flex: 1;
          overflow-y: auto;
          padding: 16px 0;
        }

        .admin-nav-item {
          display: block;
          padding: 12px 24px;
          color: var(--text-secondary);
          text-decoration: none;
          transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1);
          border-left: 3px solid transparent;
        }

        .admin-nav-item:hover {
          background-color: var(--bg-glass);
          color: var(--text-primary);
        }

        .admin-nav-item.active {
          border-left-color: var(--accent-emerald);
          color: var(--accent-emerald);
          background-color: rgba(16, 185, 129, 0.1);
        }

        .admin-logout {
          padding: 16px 24px;
          border-top: 1px solid var(--border);
          cursor: pointer;
          color: var(--text-secondary);
          transition: all 200ms ease;
        }
        .admin-logout:hover {
          color: #ef4444;
        }

        .admin-main {
          margin-left: 240px;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .admin-topbar {
          height: 64px;
          background-color: var(--bg-secondary);
          border-bottom: 1px solid var(--border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          position: sticky;
          top: 0;
          z-index: 90;
        }

        .admin-topbar h1 {
          font-family: 'Plus Jakarta Sans', sans-serif;
          font-size: 20px;
          margin: 0;
        }

        .admin-content {
          padding: 32px;
          flex: 1;
        }

        .admin-card {
          background: var(--bg-card);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 24px;
          backdrop-filter: blur(16px);
        }
      `}} />
      
      <aside className="admin-sidebar">
        <div className="admin-logo">Jammi Admin</div>
        <nav className="admin-nav">
          {navItems.map(item => (
            <Link key={item.path} href={item.path} className={`admin-nav-item ${router.pathname.startsWith(item.path) ? 'active' : ''}`}>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="admin-logout" onClick={handleLogout}>
          Logout
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <h1>{title}</h1>
          <div style={{ color: 'var(--text-secondary)' }}>Hello, {adminName}</div>
        </header>
        <section className="admin-content">
          {children}
        </section>
      </main>
    </div>
  )
}
