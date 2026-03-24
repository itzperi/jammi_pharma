const fs = require('fs');
const path = require('path');
const pagesDir = path.join(__dirname, '..', 'pages', 'admin');
fs.mkdirSync(pagesDir, { recursive: true });
const pages = ['categories', 'customers', 'reviews', 'inventory', 'coupons', 'bundles', 'shipping', 'federation', 'roles', 'reports'];
pages.forEach(name => {
  const ComponentName = name.charAt(0).toUpperCase() + name.slice(1);
  const content = `import { useState } from 'react'
import AdminGuard from '@/components/admin/AdminGuard'
import AdminLayout from '@/components/admin/AdminLayout'

export default function ${ComponentName}() {
  return (
    <AdminGuard>
      <AdminLayout title="${ComponentName}">
        <div className="admin-card"><p>Manage ${name} here.</p></div>
      </AdminLayout>
    </AdminGuard>
  )
}`;
  fs.writeFileSync(path.join(pagesDir, `${name}.js`), content);
});
console.log('Blank pages generated');
