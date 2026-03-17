import * as admin from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

// Read token file stripping BOM
const tokenRaw = fs.readFileSync(path.join(process.cwd(), 'scripts', 'fb-tokens.json'), 'utf8').replace(/^\uFEFF/, '');
const tokenData = JSON.parse(tokenRaw);

// Build the credential file format firebase-admin expects for a refresh token
const credFile = path.join(process.cwd(), 'scripts', 'fb-cred.json');
fs.writeFileSync(credFile, JSON.stringify({
  type: 'authorized_user',
  client_id: '563584335869-fgrhgmd47bqnekij5i8b5pr03ho849e6.apps.googleusercontent.com',
  client_secret: 'j9iVZfS7BNQQW0aAkVgGeif-',
  refresh_token: tokenData.refresh_token,
}), 'utf8');

process.env.GOOGLE_APPLICATION_CREDENTIALS = credFile;

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  storageBucket: 'jammi-2684d.firebasestorage.app',
});

const db = admin.firestore();
const bucket = admin.storage().bucket();

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

async function upload() {
  const publicDir = path.join(process.cwd(), 'public', 'images');
  const results: string[] = [];

  for (const [productId, filename] of Object.entries(productImages)) {
    const localPath = path.join(publicDir, filename);

    if (!fs.existsSync(localPath)) {
      results.push(`SKIP ${productId}: ${localPath} not found`);
      continue;
    }

    try {
      const ext = path.extname(filename).toLowerCase();
      const contentType = (ext === '.jpg' || ext === '.jpeg') ? 'image/jpeg' : 'image/png';
      const destination = `products/${filename}`;

      await bucket.upload(localPath, {
        destination,
        metadata: { contentType },
        public: true,
      });

      const url = `https://storage.googleapis.com/jammi-2684d.firebasestorage.app/${encodeURIComponent(destination).replace('%2F', '/')}`;

      await db.collection('products').doc(productId).update({ image: url });

      results.push(`OK ${productId} -> ${url}`);
      console.log(`OK: ${productId}`);
    } catch (err: any) {
      results.push(`ERROR ${productId}: ${err.message}`);
      console.error(`ERROR: ${productId}: ${err.message}`);
    }
  }

  fs.writeFileSync(path.join(process.cwd(), 'scripts', 'upload-log.txt'), results.join('\n'));
  console.log('Done! See scripts/upload-log.txt');
  process.exit(0);
}

upload();
