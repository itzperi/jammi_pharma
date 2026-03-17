const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname);
const ignoreDirs = ['node_modules', '.next', '.git'];
const targetExts = ['.tsx', '.ts', '.css'];

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            if (!ignoreDirs.includes(f)) {
                walkDir(dirPath, callback);
            }
        } else {
            callback(dirPath);
        }
    });
}

let modifiedFiles = 0;

walkDir(targetDir, function (filePath) {
    if (targetExts.includes(path.extname(filePath))) {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;

        // Replace brand-green with forest
        content = content.replace(/brand-green/g, 'forest');

        // Replace tailwind green colors with amber (an earth tone close to saffron)
        content = content.replace(/text-green-/g, 'text-amber-');
        content = content.replace(/bg-green-/g, 'bg-amber-');
        content = content.replace(/border-green-/g, 'border-amber-');
        content = content.replace(/ring-green-/g, 'ring-amber-');

        // Also replace direct green hexes if any (basic ones)
        // Actually, stick to classes for safety
        content = content.replace(/text-brand-green/g, 'text-forest'); // Already handled by above

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            modifiedFiles++;
            console.log(`Updated: ${filePath.replace(__dirname, '')}`);
        }
    }
});

console.log(`Replaced green classes in ${modifiedFiles} files.`);
