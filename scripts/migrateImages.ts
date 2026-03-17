import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import 'dotenv/config';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!   // service role for server-side uploads
);

async function migrateImageUrl(
  oldUrl: string,
  bucket: string,
  folder: string
): Promise<string> {
  // Download from old location
  const response = await fetch(oldUrl);
  const buffer = await response.arrayBuffer();
  const contentType = response.headers.get('content-type') || 'image/jpeg';
  const ext = contentType.split('/')[1] || 'jpg';
  const path = `${folder}/${Date.now()}.${ext}`;

  // Upload to Supabase Storage
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, { contentType, cacheControl: '31536000' });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

async function migrateAllProducts() {
  const { data: products } = await supabase.from('products').select('id, images');

  for (const product of products || []) {
    const newImages: string[] = [];

    for (const oldUrl of product.images || []) {
      if (oldUrl.includes('supabase.co')) {
        newImages.push(oldUrl); // already migrated
        continue;
      }
      try {
        const newUrl = await migrateImageUrl(oldUrl, 'product-images', `products/${product.id}`);
        newImages.push(newUrl);
        console.log(`✓ Migrated: ${oldUrl.slice(-40)}`);
      } catch (err) {
        console.error(`✗ Failed: ${oldUrl}`, err);
        newImages.push(oldUrl); // keep old URL on failure
      }
    }

    await supabase.from('products').update({ images: newImages }).eq('id', product.id);
  }

  console.log('Migration complete!');
}

migrateAllProducts();
