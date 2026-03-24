-- ⚠️ WARNING: This will drop existing tables to ensure the new schema applies cleanly.
-- Review before executing in production!

DROP TABLE IF EXISTS 
  inventory_log, shipping_methods, partner_requests, federation_comments, federation_posts,
  cms_announcement, cms_static_pages, cms_blogs, cms_banners, cms_content,
  coupons, bundle_products, bundles, reviews, order_items, orders,
  carts, product_variants, products, categories, admin_users, site_users,
  payments, customers, site_content
CASCADE;

DROP FUNCTION IF EXISTS set_user_code() CASCADE;
DROP FUNCTION IF EXISTS update_updated_at() CASCADE;
DROP FUNCTION IF EXISTS is_admin() CASCADE;
DROP FUNCTION IF EXISTS increment_product_views() CASCADE;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─────────────────────────────────────────
-- USER SYSTEM (auto-assigned user IDs)
-- ─────────────────────────────────────────
CREATE TABLE site_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_code TEXT NOT NULL UNIQUE,        -- e.g. "user1", "user2", "user3"
  user_number SERIAL,                    -- auto-incrementing number
  session_id TEXT UNIQUE NOT NULL,       -- browser fingerprint/localStorage key
  name TEXT,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'blocked')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-generate user_code from user_number
CREATE OR REPLACE FUNCTION set_user_code()
RETURNS TRIGGER AS $$
BEGIN
  NEW.user_code := 'user' || NEW.user_number;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_user_code
BEFORE INSERT ON site_users
FOR EACH ROW EXECUTE FUNCTION set_user_code();

-- ─────────────────────────────────────────
-- ADMIN USERS
-- ─────────────────────────────────────────
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'staff' CHECK (role IN ('super_admin', 'manager', 'staff')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- CATEGORIES
-- ─────────────────────────────────────────
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- PRODUCTS
-- ─────────────────────────────────────────
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  short_description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_price NUMERIC(10,2),
  stock INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  sku TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  images TEXT[] DEFAULT '{}',            -- array of Supabase Storage public URLs
  main_image_index INTEGER DEFAULT 0,    -- which image in the array is the hero
  tags TEXT[] DEFAULT '{}',
  ingredients TEXT,
  usage_instructions TEXT,
  benefits TEXT[],
  meta_title TEXT,
  meta_description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('published', 'draft')),
  is_featured BOOLEAN DEFAULT FALSE,
  display_order INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX products_slug_idx ON products(slug);
CREATE INDEX products_status_idx ON products(status);

-- ─────────────────────────────────────────
-- PRODUCT VARIANTS
-- ─────────────────────────────────────────
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_type TEXT NOT NULL,
  variant_value TEXT NOT NULL,
  additional_price NUMERIC(10,2) DEFAULT 0,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- CART (per user, persistent)
-- ─────────────────────────────────────────
CREATE TABLE carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES site_users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  added_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id, variant_id)
);

-- ─────────────────────────────────────────
-- ORDERS
-- ─────────────────────────────────────────
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE DEFAULT ('ORD-' || LPAD(FLOOR(RANDOM()*999999)::TEXT, 6, '0')),
  user_id UUID REFERENCES site_users(id) ON DELETE SET NULL,
  user_code TEXT,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL,
  shipping_cost NUMERIC(10,2) DEFAULT 0,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  tax_amount NUMERIC(10,2) DEFAULT 0,
  total_amount NUMERIC(10,2) NOT NULL,
  coupon_code TEXT,
  order_status TEXT DEFAULT 'pending'
    CHECK (order_status IN ('pending','processing','shipped','delivered','cancelled')),
  payment_status TEXT DEFAULT 'unpaid'
    CHECK (payment_status IN ('unpaid','paid','refunded')),
  payment_method TEXT,
  tracking_number TEXT,
  courier_name TEXT,
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- ORDER ITEMS
-- ─────────────────────────────────────────
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  variant_label TEXT,
  quantity INTEGER NOT NULL,
  unit_price NUMERIC(10,2) NOT NULL,
  line_total NUMERIC(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- REVIEWS
-- ─────────────────────────────────────────
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES site_users(id) ON DELETE SET NULL,
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- BUNDLES
-- ─────────────────────────────────────────
CREATE TABLE bundles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  extra_discount_percent NUMERIC(5,2) DEFAULT 0,
  show_in_shop BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE bundle_products (
  bundle_id UUID NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (bundle_id, product_id)
);

-- ─────────────────────────────────────────
-- COUPONS
-- ─────────────────────────────────────────
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage','fixed')),
  discount_value NUMERIC(10,2) NOT NULL,
  min_order_value NUMERIC(10,2) DEFAULT 0,
  max_discount_amount NUMERIC(10,2),
  expiry_date TIMESTAMPTZ NOT NULL,
  usage_limit INTEGER,
  total_used INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- CMS — WEBSITE CONTENT (admin editable)
-- ─────────────────────────────────────────
CREATE TABLE cms_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page TEXT NOT NULL,                    -- e.g. 'home','about','legacy','founders','shop'
  section TEXT NOT NULL,                 -- e.g. 'hero','banner','about_text','founders_section'
  content_key TEXT NOT NULL,             -- e.g. 'title','subtitle','body','image_url','cta_text'
  content_value TEXT,
  content_type TEXT DEFAULT 'text'
    CHECK (content_type IN ('text','html','image_url','url','boolean','json')),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  UNIQUE(page, section, content_key)
);

-- ─────────────────────────────────────────
-- CMS — HOMEPAGE BANNERS
-- ─────────────────────────────────────────
CREATE TABLE cms_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  image_url TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  cta_text TEXT,
  cta_link TEXT,
  text_color TEXT DEFAULT '#ffffff',
  display_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- CMS — BLOG POSTS
-- ─────────────────────────────────────────
CREATE TABLE cms_blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  featured_image TEXT,
  content TEXT NOT NULL,
  category TEXT,
  tags TEXT[] DEFAULT '{}',
  author_name TEXT DEFAULT 'Jammi Pharma Team',
  status TEXT DEFAULT 'draft' CHECK (status IN ('published','draft')),
  published_at TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- CMS — STATIC PAGES
-- ─────────────────────────────────────────
CREATE TABLE cms_static_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO cms_static_pages (page_key, title, content) VALUES
('about','About Us','<p>About Jammi Pharma.</p>'),
('contact','Contact Us','<p>Contact information.</p>'),
('privacy','Privacy Policy','<p>Privacy policy.</p>'),
('terms','Terms & Conditions','<p>Terms and conditions.</p>'),
('returns','Return Policy','<p>Return policy.</p>'),
('legacy','Legacy Page','<p>Jammi Pharma legacy content.</p>');

-- ─────────────────────────────────────────
-- CMS — ANNOUNCEMENT BAR
-- ─────────────────────────────────────────
CREATE TABLE cms_announcement (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  is_enabled BOOLEAN DEFAULT FALSE,
  message TEXT,
  bg_color TEXT DEFAULT '#2d6a4f',
  text_color TEXT DEFAULT '#ffffff',
  link_url TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO cms_announcement (is_enabled, message)
VALUES (false, 'Free shipping on orders above ₹499!');

-- ─────────────────────────────────────────
-- FEDERATION POSTS
-- ─────────────────────────────────────────
CREATE TABLE federation_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  poster_name TEXT NOT NULL,
  poster_designation TEXT,
  content TEXT NOT NULL,
  image_url TEXT,
  tags TEXT[] DEFAULT '{}',
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE federation_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES federation_posts(id) ON DELETE CASCADE,
  commenter_name TEXT NOT NULL,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- PARTNER REQUESTS
-- ─────────────────────────────────────────
CREATE TABLE partner_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT NOT NULL,
  organization TEXT NOT NULL,
  specialization TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  city TEXT,
  state TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- SHIPPING METHODS
-- ─────────────────────────────────────────
CREATE TABLE shipping_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  carrier TEXT NOT NULL,
  rate_type TEXT NOT NULL CHECK (rate_type IN ('flat','weight_based','free_above')),
  base_cost NUMERIC(10,2) DEFAULT 0,
  free_above_amount NUMERIC(10,2),
  estimated_delivery TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO shipping_methods (name, carrier, rate_type, base_cost, estimated_delivery)
VALUES ('Standard Delivery','Delhivery','flat',60,'3-5 business days');

-- ─────────────────────────────────────────
-- INVENTORY LOG
-- ─────────────────────────────────────────
CREATE TABLE inventory_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  change_amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  changed_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- TRIGGERS: updated_at auto-update
-- ─────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON carts FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON bundles FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON cms_content FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON cms_banners FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON cms_blogs FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Enable RLS on all tables:
  ALTER TABLE site_users ENABLE ROW LEVEL SECURITY;
  ALTER TABLE products ENABLE ROW LEVEL SECURITY;
  ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
  ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
  ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
  ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
  ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
  ALTER TABLE cms_content ENABLE ROW LEVEL SECURITY;
  ALTER TABLE cms_banners ENABLE ROW LEVEL SECURITY;
  ALTER TABLE cms_blogs ENABLE ROW LEVEL SECURITY;
  ALTER TABLE cms_static_pages ENABLE ROW LEVEL SECURITY;
  ALTER TABLE cms_announcement ENABLE ROW LEVEL SECURITY;
  ALTER TABLE bundles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE bundle_products ENABLE ROW LEVEL SECURITY;
  ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
  ALTER TABLE federation_posts ENABLE ROW LEVEL SECURITY;
  ALTER TABLE federation_comments ENABLE ROW LEVEL SECURITY;
  ALTER TABLE partner_requests ENABLE ROW LEVEL SECURITY;
  ALTER TABLE shipping_methods ENABLE ROW LEVEL SECURITY;
 
-- Helper function:
  CREATE OR REPLACE FUNCTION is_admin()
  RETURNS BOOLEAN AS $$
    SELECT EXISTS (
      SELECT 1 FROM admin_users
      WHERE auth_user_id = auth.uid() AND status = 'active'
    );
  $$ LANGUAGE sql SECURITY DEFINER;
 
-- Key policies:
 
-- Products: public reads published; admin full access
CREATE POLICY "public_read_products" ON products FOR SELECT USING (status = 'published');
CREATE POLICY "admin_all_products" ON products FOR ALL USING (is_admin());
 
-- Carts: user sees own cart via session matching; admin sees all
CREATE POLICY "admin_all_carts" ON carts FOR ALL USING (is_admin());
CREATE POLICY "anon_cart_full_access" ON carts FOR ALL USING (true); -- session validated app-side
 
-- Orders: admin full; anon can insert (guest checkout)
CREATE POLICY "admin_all_orders" ON orders FOR ALL USING (is_admin());
CREATE POLICY "anon_insert_order" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_insert_order_items" ON order_items FOR INSERT WITH CHECK (true);
 
-- Reviews: public reads approved; anyone inserts pending; admin full
CREATE POLICY "public_read_reviews" ON reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "anon_submit_review" ON reviews FOR INSERT WITH CHECK (status = 'pending');
CREATE POLICY "admin_all_reviews" ON reviews FOR ALL USING (is_admin());
 
-- CMS: public reads; admin writes
CREATE POLICY "public_read_cms" ON cms_content FOR SELECT USING (true);
CREATE POLICY "admin_write_cms" ON cms_content FOR ALL USING (is_admin());
CREATE POLICY "public_read_banners" ON cms_banners FOR SELECT USING (status = 'active');
CREATE POLICY "admin_all_banners" ON cms_banners FOR ALL USING (is_admin());
CREATE POLICY "public_read_blogs" ON cms_blogs FOR SELECT USING (status = 'published');
CREATE POLICY "admin_all_blogs" ON cms_blogs FOR ALL USING (is_admin());
CREATE POLICY "public_read_pages" ON cms_static_pages FOR SELECT USING (true);
CREATE POLICY "admin_all_pages" ON cms_static_pages FOR ALL USING (is_admin());
CREATE POLICY "public_read_announcement" ON cms_announcement FOR SELECT USING (true);
CREATE POLICY "admin_all_announcement" ON cms_announcement FOR ALL USING (is_admin());
 
-- Federation + Partners: anyone inserts; admin full
CREATE POLICY "public_read_approved_posts" ON federation_posts FOR SELECT USING (status = 'approved');
CREATE POLICY "anon_submit_post" ON federation_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_all_posts" ON federation_posts FOR ALL USING (is_admin());
CREATE POLICY "anon_read_comments" ON federation_comments FOR SELECT USING (true);
CREATE POLICY "anon_submit_comment" ON federation_comments FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_all_comments" ON federation_comments FOR ALL USING (is_admin());
CREATE POLICY "anon_submit_partner" ON partner_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "admin_all_partners" ON partner_requests FOR ALL USING (is_admin());
 
-- Shipping: public reads active; admin manages
CREATE POLICY "public_read_shipping" ON shipping_methods FOR SELECT USING (status = 'active');
CREATE POLICY "admin_all_shipping" ON shipping_methods FOR ALL USING (is_admin());
 
-- Site users: admin full; anon can insert (first visit)
CREATE POLICY "admin_all_site_users" ON site_users FOR ALL USING (is_admin());
CREATE POLICY "anon_create_site_user" ON site_users FOR INSERT WITH CHECK (true);
CREATE POLICY "anon_read_own_site_user" ON site_users FOR SELECT USING (true);
CREATE POLICY "anon_update_own_site_user" ON site_users FOR UPDATE USING (true);
