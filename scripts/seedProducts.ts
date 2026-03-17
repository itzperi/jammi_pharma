import { db } from '../lib/firebase';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { MOCK_PRODUCTS } from '../constants';

async function seed() {
  console.log(`Starting to seed ${MOCK_PRODUCTS.length} products...`);
  for (const product of MOCK_PRODUCTS) {
    try {
      await setDoc(doc(db, 'products', product.id), {
        ...product,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        active: true,
        averageRating: 0,
        reviewCount: 0,
      });
      console.log(`Seeded: ${product.name}`);
    } catch (e) {
      console.error(`Failed to seed ${product.name}`, e);
    }
  }
  console.log('All products seeded!');
  process.exit(0);
}

seed();
