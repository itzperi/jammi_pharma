import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

const TOKEN_FILE = path.join(process.cwd(), 'scripts', 'fb-tokens.json');
const BUCKET = 'jammi-2684d.appspot.com';
const PROJECT = 'jammi-2684d';

// Firebase CLI OAuth2 client credentials (public, from firebase-tools source)
const FIREBASE_CLIENT_ID = '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com';
const FIREBASE_CLIENT_SECRET = 'j9iVZfS8nnGolaXqgR10';

function httpsPost(hostname: string, httpPath: string, body: string, headers: Record<string, string>): Promise<{ status: number; data: string }> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      path: httpPath,
      method: 'POST',
      headers,
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode ?? 0, data }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function httpsPatch(hostname: string, httpPath: string, body: string, headers: Record<string, string>): Promise<{ status: number; data: string }> {
  return new Promise((resolve, reject) => {
    const options = {
      hostname,
      path: httpPath,
      method: 'PATCH',
      headers,
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode ?? 0, data }));
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function getAccessToken(): Promise<string> {
  const raw = fs.readFileSync(TOKEN_FILE, 'utf8').replace(/^\uFEFF/, '');
  const tokenData = JSON.parse(raw);
  const refreshToken: string = tokenData.refresh_token;

  console.log('Refreshing access token...');
  const body = new URLSearchParams({
    grant_type: 'refresh_token',
    client_id: FIREBASE_CLIENT_ID,
    client_secret: FIREBASE_CLIENT_SECRET,
    refresh_token: refreshToken,
  }).toString();

  const res = await httpsPost('oauth2.googleapis.com', '/token', body, {
    'Content-Type': 'application/x-www-form-urlencoded',
    'Content-Length': String(Buffer.byteLength(body)),
  });

  if (res.status < 200 || res.status >= 300) {
    throw new Error(`Token refresh failed (${res.status}): ${res.data}`);
  }

  const parsed = JSON.parse(res.data);
  const newAccessToken: string = parsed.access_token;
  tokenData.access_token = newAccessToken;
  tokenData.expires_at = Date.now() + (parsed.expires_in * 1000);
  fs.writeFileSync(TOKEN_FILE, JSON.stringify(tokenData, null, 2));
  console.log('Access token refreshed successfully.');
  return newAccessToken;
}

function uploadToGCS(localPath: string, filename: string, contentType: string, accessToken: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileBuffer = fs.readFileSync(localPath);
    const options = {
      hostname: 'storage.googleapis.com',
      path: `/upload/storage/v1/b/${encodeURIComponent(BUCKET)}/o?uploadType=media&name=${encodeURIComponent(`products/${filename}`)}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length,
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          const url = `https://storage.googleapis.com/${BUCKET}/products/${encodeURIComponent(filename)}`;
          resolve(url);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });
    req.on('error', reject);
    req.write(fileBuffer);
    req.end();
  });
}

async function makePublic(filename: string, accessToken: string): Promise<void> {
  const body = JSON.stringify({ entity: 'allUsers', role: 'READER' });
  const res = await httpsPost(
    'storage.googleapis.com',
    `/storage/v1/b/${encodeURIComponent(BUCKET)}/o/${encodeURIComponent(`products/${filename}`)}/acl`,
    body,
    {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Content-Length': String(Buffer.byteLength(body)),
    }
  );
  if (res.status >= 300 && res.status !== 409) {
    throw new Error(`ACL failed HTTP ${res.status}: ${res.data}`);
  }
}

async function updateFirestore(productId: string, imageUrl: string, accessToken: string): Promise<void> {
  const body = JSON.stringify({ fields: { image: { stringValue: imageUrl } } });
  const dbPath = `projects/${PROJECT}/databases/(default)/documents/products/${productId}`;
  const res = await httpsPatch(
    'firestore.googleapis.com',
    `/v1/${dbPath}?updateMask.fieldPaths=image`,
    body,
    {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'Content-Length': String(Buffer.byteLength(body)),
    }
  );
  if (res.status >= 300) {
    throw new Error(`Firestore failed HTTP ${res.status}: ${res.data}`);
  }
}

const productImages: Record<string, string> = {
  'triphala-churna': 'TriphalaChurna_2.png',
  'yummunity-kids': 'Yummunity Bottle.png',
  'trip-caps': 'Tripcaps_1.png',
  'zeer-alka-syrup': 'ZeerAlka_1.png',
  'widari-forte-granules': 'WidariForte_2.png',
  'thyrogard': 'Thyro_1.png',
  'suventris': 'Suventris_1.png',
  'redema': 'Redema_2.png',
  'pyril-ds': 'PyrilDS_2.png',
  'orthoraksha-oil': 'OrthorakshaOil_1.png',
  'mahanarayana-tailam': 'MahanarayanaTaila_1.png',
  'nilomit-tablets': 'Nilomit_2.png',
  'daily-dew-moisturizer': 'Daily Dew.png',
  'madhuchari-churna': 'MadhumehariChurna_2.png',
  'laksha-capsules': 'Laksha_1.png',
  'hepableen-syrup': 'HAPABLEEN 3.jpg',
  'hepableen-tablets': 'Hepableen Tablets.png',
  'livercure-complex-forte': 'Livercure_2.png',
  'combifore': 'Combifore_2.png',
  'gtp-mental-fitness': 'GTP_1.png',
  'aa-caps': 'AAcaps_1.png',
  'd-tabs': 'Dtabs_2.png',
  'cyst-evit': 'Cyst_1.png',
  'bff-balm': 'BFF_1.png',
  'uvsafe-spf50': 'UVSafe.png',
  'timeless-anti-ageing-cream': 'Timeless.png',
  'softlips': 'SoftLips_1.png',
  'kumkumadi-serum': 'Kumkumadi Serum.jpeg',
  'keshpro-oil': 'KeshPro.png',
  'glow-complexion-cream': 'Glow.png',
  'flawless-pack': 'Flawless.png',
  'crush-n-brush': 'CrushNBrush_2.png',
  'clear-marks': 'Clear Marks.jpeg',
};

async function main() {
  const accessToken = await getAccessToken();
  const publicDir = path.join(process.cwd(), 'public', 'images');
  const results: string[] = [];

  for (const [productId, filename] of Object.entries(productImages)) {
    const localPath = path.join(publicDir, filename);
    if (!fs.existsSync(localPath)) {
      results.push(`SKIP ${productId}: file not found (${filename})`);
      console.log(`SKIP: ${productId} (${filename} not found)`);
      continue;
    }
    const ext = path.extname(filename).toLowerCase();
    const contentType = (ext === '.jpg' || ext === '.jpeg') ? 'image/jpeg' : 'image/png';

    try {
      const url = await uploadToGCS(localPath, filename, contentType, accessToken);
      console.log(`  Uploaded ${productId}`);
      await makePublic(filename, accessToken);
      console.log(`  Made public ${productId}`);
      await updateFirestore(productId, url, accessToken);
      results.push(`OK ${productId} -> ${url}`);
      console.log(`OK: ${productId} -> ${url}`);
    } catch (err: any) {
      results.push(`ERROR ${productId}: ${err.message}`);
      console.error(`ERROR ${productId}: ${err.message}`);
    }
  }

  const logPath = path.join(process.cwd(), 'scripts', 'upload-log.txt');
  fs.writeFileSync(logPath, results.join('\n'));
  console.log(`\nDone! See ${logPath}`);
}

main().catch(err => {
  console.error("FATAL ERROR: ", err);
  process.exit(1);
});
