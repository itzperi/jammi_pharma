import { supabase } from './supabase';

export type Bucket =
  | 'product-images'
  | 'category-images'
  | 'review-images'
  | 'bundle-images'
  | 'site-assets'
  | 'reports';

/**
 * Upload a file to Supabase Storage.
 * Returns the permanent public URL.
 * All uploads go through this function — no exceptions.
 */
export async function uploadFile(
  file: File,
  bucket: Bucket,
  folder: string = ''
): Promise<string> {
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const path = folder ? `${folder.replace(/\/$/, '')}/${filename}` : filename;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '31536000',   // 1 year CDN cache
      upsert: false,
      contentType: file.type,
    });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  return getPublicUrl(bucket, path);
}

/**
 * Replace an existing file (delete old, upload new).
 * Pass the old URL to clean up storage.
 */
export async function replaceFile(
  file: File,
  bucket: Bucket,
  folder: string,
  oldUrl?: string
): Promise<string> {
  // Delete the old file first (fire and forget — don't block the upload)
  if (oldUrl) {
    deleteFile(oldUrl).catch(() => {}); // non-blocking
  }
  return uploadFile(file, bucket, folder);
}

/**
 * Upload multiple files at once. Returns array of public URLs.
 */
export async function uploadMultiple(
  files: File[],
  bucket: Bucket,
  folder: string = ''
): Promise<string[]> {
  return Promise.all(files.map(file => uploadFile(file, bucket, folder)));
}

/**
 * Delete a file by its public URL.
 */
export async function deleteFile(publicUrl: string): Promise<void> {
  const { bucket, path } = parseStorageUrl(publicUrl);
  if (!bucket || !path) return;

  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) console.warn('Delete failed (non-critical):', error.message);
}

/**
 * Get the public URL for a stored file path.
 */
export function getPublicUrl(bucket: Bucket, path: string): string {
  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Parse a Supabase Storage public URL back into bucket + path.
 * Used for deletion and replacement.
 */
export function parseStorageUrl(url: string): { bucket: string; path: string } | { bucket: null; path: null } {
  try {
    // Supabase public URLs look like:
    // https://xxx.supabase.co/storage/v1/object/public/BUCKET/path/to/file.jpg
    const match = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)/);
    if (!match) return { bucket: null, path: null };
    return { bucket: match[1], path: match[2] };
  } catch {
    return { bucket: null, path: null };
  }
}

/**
 * Create a temporary signed URL for private files (e.g., reports).
 * Expires in 60 minutes by default.
 */
export async function getSignedUrl(
  bucket: Bucket,
  path: string,
  expiresInSeconds: number = 3600
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresInSeconds);

  if (error || !data?.signedUrl) throw new Error('Could not generate signed URL');
  return data.signedUrl;
}

/**
 * Validate file before upload.
 * Call this before every upload to give users clear error messages.
 */
export function validateFile(
  file: File,
  options: {
    maxSizeMB?: number;
    allowedTypes?: string[];
  } = {}
): { valid: boolean; error?: string } {
  const { maxSizeMB = 10, allowedTypes = ['image/jpeg', 'image/png', 'image/webp'] } = options;

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type not allowed. Use: ${allowedTypes.join(', ')}` };
  }

  if (file.size > maxSizeMB * 1024 * 1024) {
    return { valid: false, error: `File too large. Maximum size: ${maxSizeMB}MB` };
  }

  return { valid: true };
}
