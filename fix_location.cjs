const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '_pages_legacy', 'products');
const targetExts = ['.tsx', '.ts'];

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        if (isDirectory) {
            walkDir(dirPath, callback);
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

        content = content.replace(/\[location\]/g, '[pathname]');

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            modifiedFiles++;
            console.log(`Updated: ${filePath.replace(__dirname, '')}`);
        }
    }
});

console.log(`Replaced [location] with [pathname] in ${modifiedFiles} files.`);
