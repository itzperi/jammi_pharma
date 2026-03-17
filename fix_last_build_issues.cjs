const fs = require('fs');
const path = require('path');

// 1. Move admin files to app/admin/ and remove app/(admin)/
const adminPageLegacyContent = `import Admin from '../../_pages_legacy/Admin';\n\nexport default function Page() {\n  return <Admin />;\n}\n`;
const adminLayoutContent = `import React from 'react';\nimport '../globals.css';\n\nexport default function AdminLayout({ children }: { children: React.ReactNode }) {\n  return <>{children}</>;\n}\n`;

const adminDir = path.join(__dirname, 'app', 'admin');
if (!fs.existsSync(adminDir)) fs.mkdirSync(adminDir, { recursive: true });

fs.writeFileSync(path.join(adminDir, 'page.tsx'), adminPageLegacyContent, 'utf8');
fs.writeFileSync(path.join(adminDir, 'layout.tsx'), adminLayoutContent, 'utf8');

const oldAdminDir = path.join(__dirname, 'app', '(admin)');
if (fs.existsSync(oldAdminDir)) {
    fs.rmSync(oldAdminDir, { recursive: true, force: true });
}

// 2. Add "use client"; to all files in _pages_legacy
function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir(path.join(__dirname, '_pages_legacy'), (filePath) => {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    if (!content.includes('"use client"') && !content.includes("'use client'")) {
        fs.writeFileSync(filePath, '"use client";\n' + content, 'utf8');
        console.log('Added use client to:', filePath);
    }
});

console.log('Admin route fixed and "use client" directives added.');
