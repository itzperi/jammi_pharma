const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

function refactorFile(filePath) {
    if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // React Router Dom -> Next.js Link
    content = content.replace(/import\s+{\s*Link\s*}\s+from\s+['"]react-router-dom['"];?/g, "import Link from 'next/link';");
    content = content.replace(/<Link\s+to=/g, "<Link href=");

    // React Router Dom -> Next.js Navigation
    content = content.replace(/import\s+{\s*useNavigate\s*}\s+from\s+['"]react-router-dom['"];?/g, "import { useRouter } from 'next/navigation';");
    content = content.replace(/import\s+{\s*useLocation,\s*Link\s*}\s+from\s+['"]react-router-dom['"];?/g, "import { usePathname } from 'next/navigation';\nimport Link from 'next/link';");
    content = content.replace(/import\s+{\s*Link,\s*useLocation\s*}\s+from\s+['"]react-router-dom['"];?/g, "import { usePathname } from 'next/navigation';\nimport Link from 'next/link';");

    // Fix combined imports if any
    content = content.replace(/import\s+{\s*useParams,\s*useNavigate\s*}\s+from\s+['"]react-router-dom['"];?/g, "import { useParams, useRouter } from 'next/navigation';");

    content = content.replace(/const\s+navigate\s*=\s*useNavigate\(\);/g, "const router = useRouter();");
    content = content.replace(/navigate\(/g, "router.push(");
    content = content.replace(/const\s+location\s*=\s*useLocation\(\);/g, "const pathname = usePathname();");

    if (content !== original) {
        if (!content.includes('"use client"') && !content.includes("'use client'")) {
            content = '"use client";\n' + content;
        }
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Updated:', filePath);
    }
}

walkDir(path.join(__dirname, '_pages_legacy'), refactorFile);
walkDir(path.join(__dirname, 'components'), refactorFile);
