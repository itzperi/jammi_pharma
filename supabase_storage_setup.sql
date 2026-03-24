-- Run in Supabase SQL Editor

-- 1. Product images (public — shop needs to display without auth)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'product-images',
  'product-images',
  true,
  10485760,  -- 10MB
  ARRAY['image/jpeg','image/png','image/webp','image/gif']
)
on conflict (id) do nothing;

-- 2. Category images (public)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'category-images',
  'category-images',
  true,
  5242880,   -- 5MB
  ARRAY['image/jpeg','image/png','image/webp']
)
on conflict (id) do nothing;

-- 3. Review / user-uploaded images (public)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'review-images',
  'review-images',
  true,
  5242880,
  ARRAY['image/jpeg','image/png','image/webp']
)
on conflict (id) do nothing;

-- 4. Bundle images (public)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'bundle-images',
  'bundle-images',
  true,
  5242880,
  ARRAY['image/jpeg','image/png','image/webp']
)
on conflict (id) do nothing;

-- 5. Admin uploads — banners, page content, logos (public)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-assets',
  'site-assets',
  true,
  10485760,
  ARRAY['image/jpeg','image/png','image/webp','image/svg+xml','image/gif']
)
on conflict (id) do nothing;

-- 6. Reports / exports (private — admin only)
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'reports',
  'reports',
  false,
  52428800,  -- 50MB
  ARRAY['application/pdf','text/csv']
)
on conflict (id) do nothing;

-- Storage policies (idempotent)
do $$ begin

  -- PRODUCT IMAGES
  if not exists (select 1 from pg_policies where tablename = 'objects' and schemaname = 'storage' and policyname = 'Public read product images') then
    create policy "Public read product images"
      on storage.objects for select
      using (bucket_id = 'product-images');
  end if;

  if not exists (select 1 from pg_policies where tablename = 'objects' and schemaname = 'storage' and policyname = 'Admin upload product images') then
    create policy "Admin upload product images"
      on storage.objects for insert
      with check (bucket_id = 'product-images' AND auth.role() = 'authenticated');
  end if;

  if not exists (select 1 from pg_policies where tablename = 'objects' and schemaname = 'storage' and policyname = 'Admin delete product images') then
    create policy "Admin delete product images"
      on storage.objects for delete
      using (bucket_id = 'product-images' AND auth.role() = 'authenticated');
  end if;

  -- CATEGORY IMAGES
  if not exists (select 1 from pg_policies where tablename = 'objects' and schemaname = 'storage' and policyname = 'Public read category images') then
    create policy "Public read category images"
      on storage.objects for select
      using (bucket_id = 'category-images');
  end if;

  if not exists (select 1 from pg_policies where tablename = 'objects' and schemaname = 'storage' and policyname = 'Admin upload category images') then
    create policy "Admin upload category images"
      on storage.objects for insert
      with check (bucket_id = 'category-images' AND auth.role() = 'authenticated');
  end if;

  -- REVIEW IMAGES
  if not exists (select 1 from pg_policies where tablename = 'objects' and schemaname = 'storage' and policyname = 'Public read review images') then
    create policy "Public read review images"
      on storage.objects for select
      using (bucket_id = 'review-images');
  end if;

  if not exists (select 1 from pg_policies where tablename = 'objects' and schemaname = 'storage' and policyname = 'Anyone upload review images') then
    create policy "Anyone upload review images"
      on storage.objects for insert
      with check (bucket_id = 'review-images');
  end if;

  -- SITE ASSETS
  if not exists (select 1 from pg_policies where tablename = 'objects' and schemaname = 'storage' and policyname = 'Public read site assets') then
    create policy "Public read site assets"
      on storage.objects for select
      using (bucket_id = 'site-assets');
  end if;

  if not exists (select 1 from pg_policies where tablename = 'objects' and schemaname = 'storage' and policyname = 'Admin upload site assets') then
    create policy "Admin upload site assets"
      on storage.objects for insert
      with check (bucket_id = 'site-assets' AND auth.role() = 'authenticated');
  end if;

  -- BUNDLE IMAGES
  if not exists (select 1 from pg_policies where tablename = 'objects' and schemaname = 'storage' and policyname = 'Public read bundle images') then
    create policy "Public read bundle images"
      on storage.objects for select
      using (bucket_id = 'bundle-images');
  end if;

  if not exists (select 1 from pg_policies where tablename = 'objects' and schemaname = 'storage' and policyname = 'Admin upload bundle images') then
    create policy "Admin upload bundle images"
      on storage.objects for insert
      with check (bucket_id = 'bundle-images' AND auth.role() = 'authenticated');
  end if;

  -- REPORTS
  if not exists (select 1 from pg_policies where tablename = 'objects' and schemaname = 'storage' and policyname = 'Admin read reports') then
    create policy "Admin read reports"
      on storage.objects for select
      using (bucket_id = 'reports' AND auth.role() = 'authenticated');
  end if;

  if not exists (select 1 from pg_policies where tablename = 'objects' and schemaname = 'storage' and policyname = 'Admin upload reports') then
    create policy "Admin upload reports"
      on storage.objects for insert
      with check (bucket_id = 'reports' AND auth.role() = 'authenticated');
  end if;

end $$;
