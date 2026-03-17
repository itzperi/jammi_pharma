-- Run in Supabase SQL Editor

-- 1. Product images (public — shop needs to display without auth)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  10485760,  -- 10MB
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
);

-- 2. Category images (public)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'category-images',
  'category-images',
  true,
  5242880,   -- 5MB
  ARRAY['image/jpeg','image/png','image/webp']
);

-- 3. Review / user-uploaded images (public)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'review-images',
  'review-images',
  true,
  5242880,
  ARRAY['image/jpeg','image/png','image/webp']
);

-- 4. Bundle images (public)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'bundle-images',
  'bundle-images',
  true,
  5242880,
  ARRAY['image/jpeg','image/png','image/webp']
);

-- 5. Admin uploads — banners, page content, logos (public)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-assets',
  'site-assets',
  true,
  10485760,
  ARRAY['image/jpeg','image/png','image/webp','image/svg+xml','image/gif']
);

-- 6. Reports / exports (private — admin only)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'reports',
  'reports',
  false,
  52428800,  -- 50MB
  ARRAY['application/pdf','text/csv']
);

-- PRODUCT IMAGES: anyone can read, only authenticated admin can upload/delete
create policy "Public read product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Admin upload product images"
  on storage.objects for insert
  with check (bucket_id = 'product-images' AND auth.role() = 'authenticated');

create policy "Admin delete product images"
  on storage.objects for delete
  using (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- CATEGORY IMAGES
create policy "Public read category images"
  on storage.objects for select
  using (bucket_id = 'category-images');

create policy "Admin upload category images"
  on storage.objects for insert
  with check (bucket_id = 'category-images' AND auth.role() = 'authenticated');

-- REVIEW IMAGES: anyone can upload (for review photos), anyone can read
create policy "Public read review images"
  on storage.objects for select
  using (bucket_id = 'review-images');

create policy "Anyone upload review images"
  on storage.objects for insert
  with check (bucket_id = 'review-images');

-- SITE ASSETS
create policy "Public read site assets"
  on storage.objects for select
  using (bucket_id = 'site-assets');

create policy "Admin upload site assets"
  on storage.objects for insert
  with check (bucket_id = 'site-assets' AND auth.role() = 'authenticated');

-- BUNDLE IMAGES
create policy "Public read bundle images"
  on storage.objects for select
  using (bucket_id = 'bundle-images');

create policy "Admin upload bundle images"
  on storage.objects for insert
  with check (bucket_id = 'bundle-images' AND auth.role() = 'authenticated');

-- REPORTS: admin only
create policy "Admin read reports"
  on storage.objects for select
  using (bucket_id = 'reports' AND auth.role() = 'authenticated');

create policy "Admin upload reports"
  on storage.objects for insert
  with check (bucket_id = 'reports' AND auth.role() = 'authenticated');
