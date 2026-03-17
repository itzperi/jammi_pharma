import * as fs from 'fs';
import * as path from 'path';
import { auth, OAuth2Client } from 'google-auth-library';

const TOKEN_FILE = path.join(process.cwd(), 'scripts', 'fb-tokens.json');
const BUCKET = 'jammi-2684d.appspot.com';
const PROJECT = 'jammi-2684d';

const FIREBASE_CLIENT_ID = '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com';
const FIREBASE_CLIENT_SECRET = 'j9iVZfS8nnGolaXqgR10';

const client = new auth.OAuth2(FIREBASE_CLIENT_ID, FIREBASE_CLIENT_SECRET);

async function initClient() {
  const raw = fs.readFileSync(TOKEN_FILE, 'utf8').replace(/^\uFEFF/, '');
  const tokenData = JSON.parse(raw);
  
  client.setCredentials({
    refresh_token: tokenData.refresh_token,
  });

  console.log('Refreshing token via google-auth-library...');
  const res = await client.getAccessToken();
  console.log('Token ready!');
  return client;
}

function uploadToGCS(client: OAuth2Client, localPath: string, filename: string, contentType: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      const fileBuffer = fs.readFileSync(localPath);
      const url = `https://storage.googleapis.com/upload/storage/v1/b/${encodeURIComponent(BUCKET)}/o?uploadType=media&name=${encodeURIComponent(`products/${filename}`)}`;
      
      const res = await client.request({
        url,
        method: 'POST',
        headers: {
          'Content-Type': contentType,
        },
        data: fileBuffer,
      });

      resolve(`https://storage.googleapis.com/${BUCKET}/products/${encodeURIComponent(filename)}`);
    } catch (e: any) {
      reject(new Error(`GCS Upload Failed: ${e.message}`));
    }
  });
}

function makePublic(client: OAuth2Client, filename: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const url = `https://storage.googleapis.com/storage/v1/b/${encodeURIComponent(BUCKET)}/o/${encodeURIComponent(`products/${filename}`)}/acl`;
      await client.request({
        url,
        method: 'POST',
        data: { entity: 'allUsers', role: 'READER' },
      });
      resolve();
    } catch (e: any) {
      if (e.status === 409) resolve();
      else reject(new Error(`ACL Failed: ${e.message}`));
    }
  });
}

function updateFirestore(client: OAuth2Client, productId: string, imageUrl: string): Promise<void> {
  return new Promise(async (resolve, reject) => {
    try {
      const dbPath = `projects/${PROJECT}/databases/(default)/documents/products/${productId}`;
      const url = `https://firestore.googleapis.com/v1/${dbPath}?updateMask.fieldPaths=image`;
      await client.request({
        url,
        method: 'PATCH',
        data: { fields: { image: { stringValue: imageUrl } } },
      });
      resolve();
    } catch (e: any) {
      reject(new Error(`Firestore Failed: ${e.message}`));
    }
  });
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
  const oauthClient = await initClient();
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
      const url = await uploadToGCS(oauthClient, localPath, filename, contentType);
      console.log(`  Uploaded ${productId}`);
      await makePublic(oauthClient, filename);
      console.log(`  Made public ${productId}`);
      await updateFirestore(oauthClient, productId, url);
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
