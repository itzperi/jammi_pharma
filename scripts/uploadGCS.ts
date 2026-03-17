/**
 * Upload images to Firebase Storage using the GCS JSON REST API
 * with the access token extracted from Firebase CLI config.
 * Run: npx tsx scripts/uploadGCS.ts
 */
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';

// Read the access token from fb-tokens.json (strip BOM)
const tokenRaw = fs.readFileSync(path.join(process.cwd(), 'scripts', 'fb-tokens.json'), 'utf8').replace(/^\uFEFF/, '');
const tokenData = JSON.parse(tokenRaw);
const ACCESS_TOKEN = tokenData.access_token;
const BUCKET = 'jammi-2684d.firebasestorage.app';
const PROJECT = 'jammi-2684d';

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
  'nilomit-tablets': 'Nilomit_2..png',
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

function uploadToGCS(localPath: string, filename: string, contentType: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileBuffer = fs.readFileSync(localPath);
    const objectName = encodeURIComponent(`products/${filename}`);
    const options = {
      hostname: 'storage.googleapis.com',
      path: `/upload/storage/v1/b/${BUCKET}/o?uploadType=media&name=${encodeURIComponent(`products/${filename}`)}`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': contentType,
        'Content-Length': fileBuffer.length,
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          resolve(`https://storage.googleapis.com/${BUCKET}/products/${encodeURIComponent(filename)}`);
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

function makePublic(filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const objectName = encodeURIComponent(`products/${filename}`);
    const body = JSON.stringify({ entity: 'allUsers', role: 'READER' });
    const options = {
      hostname: 'storage.googleapis.com',
      path: `/storage/v1/b/${BUCKET}/o/${objectName}/acl`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) resolve();
        else reject(new Error(`ACL HTTP ${res.statusCode}: ${data}`));
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

function updateFirestore(productId: string, imageUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      fields: { image: { stringValue: imageUrl } }
    });
    const dbPath = `projects/${PROJECT}/databases/(default)/documents/products/${productId}`;
    const options = {
      hostname: 'firestore.googleapis.com',
      path: `/v1/${dbPath}?updateMask.fieldPaths=image`,
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (c) => data += c);
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) resolve();
        else reject(new Error(`Firestore HTTP ${res.statusCode}: ${data}`));
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

async function main() {
  const publicDir = path.join(process.cwd(), 'public', 'images');
  const results: string[] = [];

  for (const [productId, filename] of Object.entries(productImages)) {
    const localPath = path.join(publicDir, filename);
    if (!fs.existsSync(localPath)) {
      results.push(`SKIP ${productId}: not found`);
      continue;
    }
    const ext = path.extname(filename).toLowerCase();
    const contentType = (ext === '.jpg' || ext === '.jpeg') ? 'image/jpeg' : 'image/png';

    try {
      const url = await uploadToGCS(localPath, filename, contentType);
      await makePublic(filename);
      await updateFirestore(productId, url);
      results.push(`OK ${productId} -> ${url}`);
      console.log(`OK: ${productId}`);
    } catch (err: any) {
      results.push(`ERROR ${productId}: ${err.message}`);
      console.error(`ERROR ${productId}: ${err.message}`);
    }
  }

  fs.writeFileSync(path.join(process.cwd(), 'scripts', 'upload-log.txt'), results.join('\n'));
  console.log('Done! See upload-log.txt');
}

main();
