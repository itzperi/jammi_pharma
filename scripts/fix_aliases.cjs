const fs = require('fs');
const path = require('path');

function replaceAliases(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            replaceAliases(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            
            const relPathToRoot = path.relative(path.dirname(fullPath), process.cwd()).replace(/\\/g, '/');
            const prefix = relPathToRoot.length > 0 ? relPathToRoot + '/' : './';
            
            if (content.includes('@/')) {
                const newContent = content.replace(/@\//g, prefix);
                fs.writeFileSync(fullPath, newContent);
                console.log(`Updated ${fullPath}`);
            }
        }
    }
}

replaceAliases(path.join(process.cwd(), 'pages'));
replaceAliases(path.join(process.cwd(), 'components', 'admin'));
