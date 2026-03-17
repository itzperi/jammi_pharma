const fs = require('fs');
const path = require('path');

const appContent = fs.readFileSync(path.join(__dirname, 'App.tsx'), 'utf8');
const routeRegex = /<Route\s+path="\/([^"]+)"\s+element=\{<([^>]+)\s*\/>\}\s*\/>/g;

let match;
while ((match = routeRegex.exec(appContent)) !== null) {
    const routePath = match[1];
    const componentName = match[2];

    if (routePath === '*' || routePath === '') continue;

    // Clean up route path: /product/triphala-churna -> app/(public)/product/triphala-churna
    let folderPath = '';
    let legacyImportPath = '';

    if (routePath.startsWith('product/')) {
        if (routePath === 'product/:id') {
            folderPath = path.join(__dirname, 'app', '(public)', 'product', '[id]');
            legacyImportPath = '../../../_pages_legacy/ProductDetail';
        } else {
            folderPath = path.join(__dirname, 'app', '(public)', ...routePath.split('/'));
            legacyImportPath = `../../../_pages_legacy/products/${componentName}`;
        }
    } else if (routePath === 'admin') {
        folderPath = path.join(__dirname, 'app', '(admin)');
        legacyImportPath = '../../_pages_legacy/Admin';
    } else {
        // already created these manually mostly
        continue;
    }

    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }

    const pageComponent = `import ${componentName} from '${legacyImportPath}';

export default function Page() {
  return <${componentName} />;
}
`;

    fs.writeFileSync(path.join(folderPath, 'page.tsx'), pageComponent, 'utf8');
    console.log('Created route:', routePath);
}

// Add admin layout
const adminLayout = `import React from 'react';
import '../../globals.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
`;
fs.writeFileSync(path.join(__dirname, 'app', '(admin)', 'layout.tsx'), adminLayout, 'utf8');

console.log('Done mapping routes.');
