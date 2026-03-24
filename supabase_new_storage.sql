-- ─────────────────────────────────────────
-- STORAGE RLS POLICIES (Idempotent)
-- ─────────────────────────────────────────

DO $$ 
BEGIN
    -- Product Images
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read product-images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Public read product-images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin write product-images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Admin write product-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'product-images' AND EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND status = 'active'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin update product-images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Admin update product-images" ON storage.objects FOR UPDATE USING (bucket_id = 'product-images' AND EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND status = 'active'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin delete product-images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Admin delete product-images" ON storage.objects FOR DELETE USING (bucket_id = 'product-images' AND EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND status = 'active'));
    END IF;

    -- Category Images
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read category-images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Public read category-images" ON storage.objects FOR SELECT USING (bucket_id = 'category-images');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin write category-images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Admin write category-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'category-images' AND EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND status = 'active'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin update category-images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Admin update category-images" ON storage.objects FOR UPDATE USING (bucket_id = 'category-images' AND EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND status = 'active'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin delete category-images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Admin delete category-images" ON storage.objects FOR DELETE USING (bucket_id = 'category-images' AND EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND status = 'active'));
    END IF;

    -- Banner Images
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read banner-images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Public read banner-images" ON storage.objects FOR SELECT USING (bucket_id = 'banner-images');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin write banner-images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Admin write banner-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'banner-images' AND EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND status = 'active'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin update banner-images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Admin update banner-images" ON storage.objects FOR UPDATE USING (bucket_id = 'banner-images' AND EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND status = 'active'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin delete banner-images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Admin delete banner-images" ON storage.objects FOR DELETE USING (bucket_id = 'banner-images' AND EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND status = 'active'));
    END IF;

    -- Blog Images
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read blog-images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Public read blog-images" ON storage.objects FOR SELECT USING (bucket_id = 'blog-images');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin write blog-images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Admin write blog-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'blog-images' AND EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND status = 'active'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin update blog-images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Admin update blog-images" ON storage.objects FOR UPDATE USING (bucket_id = 'blog-images' AND EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND status = 'active'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin delete blog-images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Admin delete blog-images" ON storage.objects FOR DELETE USING (bucket_id = 'blog-images' AND EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND status = 'active'));
    END IF;

    -- CMS Images
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read cms-images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Public read cms-images" ON storage.objects FOR SELECT USING (bucket_id = 'cms-images');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin write cms-images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Admin write cms-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'cms-images' AND EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND status = 'active'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin update cms-images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Admin update cms-images" ON storage.objects FOR UPDATE USING (bucket_id = 'cms-images' AND EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND status = 'active'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin delete cms-images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Admin delete cms-images" ON storage.objects FOR DELETE USING (bucket_id = 'cms-images' AND EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND status = 'active'));
    END IF;

    -- Legacy Images
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public read legacy-images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Public read legacy-images" ON storage.objects FOR SELECT USING (bucket_id = 'legacy-images');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin write legacy-images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Admin write legacy-images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'legacy-images' AND EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND status = 'active'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin update legacy-images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Admin update legacy-images" ON storage.objects FOR UPDATE USING (bucket_id = 'legacy-images' AND EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND status = 'active'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admin delete legacy-images' AND tablename = 'objects' AND schemaname = 'storage') THEN
        CREATE POLICY "Admin delete legacy-images" ON storage.objects FOR DELETE USING (bucket_id = 'legacy-images' AND EXISTS (SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND status = 'active'));
    END IF;
END $$;
