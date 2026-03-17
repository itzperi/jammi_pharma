import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const TOKEN_FILE = path.join(process.cwd(), 'scripts', 'fb-tokens.json');

async function main() {
  const raw = fs.readFileSync(TOKEN_FILE, 'utf8').replace(/^\uFEFF/, '');
  const tokenData = JSON.parse(raw);
  const accessToken = tokenData.access_token;
  const project = 'jammi-2684d';

  const options = {
    hostname: 'storage.googleapis.com',
    path: `/storage/v1/b?project=${project}`,
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  };

  const req = https.request(options, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log(`Status: ${res.statusCode}`);
      console.log(JSON.stringify(JSON.parse(data), null, 2));
    });
  });
  req.on('error', console.error);
  req.end();
}

main().catch(console.error);
