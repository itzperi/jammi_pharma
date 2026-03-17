const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

walkDir(path.join(__dirname, 'app'), (filePath) => {
    if (!filePath.endsWith('page.tsx')) return;

    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;

    // Path correction based on depth
    // The structure is: 
    // app/(public)/page.tsx -> depth 1 inside app -> relative root is ../../
    // app/(public)/checkout/page.tsx -> depth 2 inside app -> relative root is ../../../
    // app/(public)/product/aa-caps/page.tsx -> depth 3 inside app -> relative root is ../../../../

    const relPath = path.relative(path.join(__dirname, 'app'), path.dirname(filePath));
    const depth = relPath.split(path.sep).length;

    let dots = '../'.repeat(depth + 1); // +1 because we are in app/ which is 1 level from root

    // Update legacy imports which start with '../..', etc. to the correct 'dots + _pages_legacy'
    content = content.replace(/import\s+([A-Za-z0-9_]+)\s*from\s*'[^']+_pages_legacy([^']+)';/g, (match, componentName, restPath) => {
        // Remove any trailing spaces from the component name just in case
        let cleanComponent = componentName.trim();
        let cleanRestPath = restPath.trim();
        return `import ${cleanComponent} from '${dots}_pages_legacy${cleanRestPath}';`;
    });

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Fixed imports in:', filePath);
    }
});
