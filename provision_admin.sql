-- [JAMMI PHARMA] - CMS & ADMIN USER PROVISIONING
-- Run this in your Supabase SQL Editor to ensure the admin user is correctly set up.

-- 1. Create the user in Auth (if not exists)
-- Note: Supabase UI is usually easier for this, but this SQL attempt uses the 'auth' schema.
-- If this fails with 'permission denied', please create the user manually via Supabase Dashboard -> Authentication.

DO $$
DECLARE
    uid UUID;
BEGIN
    -- Check if user exists
    SELECT id INTO uid FROM auth.users WHERE email = 'admin@jammipharma.com';
    
    IF uid IS NULL THEN
        -- Insert into auth.users (Minimal required fields)
        INSERT INTO auth.users (
            instance_id, id, aud, role, email, encrypted_password, 
            email_confirmed_at, last_sign_in_at, raw_app_meta_data, 
            raw_user_meta_data, is_super_admin, created_at, updated_at,
            confirmation_token, recovery_token, email_change_token_new, 
            email_change_token_current
        ) VALUES (
            '00000000-0000-0000-0000-000000000000', 
            gen_random_uuid(), 
            'authenticated', 
            'authenticated', 
            'admin@jammipharma.com', 
            crypt('Jammi@007', gen_salt('bf')), 
            now(), now(), 
            '{"provider":"email","providers":["email"]}', 
            '{"name":"Jammi Admin"}', 
            false, now(), now(),
            '', '', '', ''
        ) RETURNING id INTO uid;
    END IF;

    -- 2. Ensure user is in admin_users table
    INSERT INTO public.admin_users (auth_user_id, name, email, role, status)
    VALUES (uid, 'Jammi Admin', 'admin@jammipharma.com', 'super_admin', 'active')
    ON CONFLICT (email) DO UPDATE SET 
        auth_user_id = EXCLUDED.auth_user_id,
        status = 'active';

END $$;
