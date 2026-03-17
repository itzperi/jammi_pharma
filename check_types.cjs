const { exec } = require('child_process');
const fs = require('fs');

exec('npx tsc --noEmit', (error, stdout, stderr) => {
    const result = stdout + '\n' + stderr;
    fs.writeFileSync('ts_errors_utf8.txt', result, 'utf8');
    console.log('TypeScript checks written to ts_errors_utf8.txt');
});
