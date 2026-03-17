const { exec } = require('child_process');
const fs = require('fs');

exec('npx next build', (error, stdout, stderr) => {
    const result = stdout + '\n' + stderr;
    fs.writeFileSync('build_errors_utf8.txt', result, 'utf8');
    console.log('Next build checks written to build_errors_utf8.txt');
});
