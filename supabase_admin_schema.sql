-- Core extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
 
-- admin_users
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT DEFAULT 'staff' CHECK (role IN ('super_admin','manager','staff')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active','inactive')),
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
 
-- site_users (customer tracking)
CREATE TABLE IF NOT EXISTS site_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_number BIGSERIAL,
  user_code TEXT UNIQUE,
  session_id TEXT UNIQUE NOT NULL,
  name TEXT, email TEXT, phone TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','blocked')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_seen TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION set_user_code() RETURNS TRIGGER AS $$
BEGIN NEW.user_code := 'user' || NEW.user_number; RETURN NEW; END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_user_code ON site_users;
CREATE TRIGGER trigger_set_user_code BEFORE INSERT ON site_users FOR EACH ROW EXECUTE FUNCTION set_user_code();

-- categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
  description TEXT, image_url TEXT,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
 
-- products
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE,
  description TEXT, short_description TEXT,
  price NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_price NUMERIC(10,2),
  stock INTEGER DEFAULT 0, low_stock_threshold INTEGER DEFAULT 10,
  sku TEXT, category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  images TEXT[] DEFAULT '{}', main_image_index INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}', benefits TEXT[],
  meta_title TEXT, meta_description TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('published','draft')),
  is_featured BOOLEAN DEFAULT FALSE, display_order INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
 
-- product_variants
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_type TEXT NOT NULL, variant_value TEXT NOT NULL,
  additional_price NUMERIC(10,2) DEFAULT 0, stock INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
 
-- carts
CREATE TABLE IF NOT EXISTS carts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES site_users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  added_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id, variant_id)
);
 
-- orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number TEXT NOT NULL UNIQUE DEFAULT ('ORD-' || LPAD(FLOOR(RANDOM()*999999)::TEXT,6,'0')),
  user_id UUID REFERENCES site_users(id) ON DELETE SET NULL,
  user_code TEXT,
  customer_name TEXT NOT NULL, customer_email TEXT NOT NULL, customer_phone TEXT,
  shipping_address JSONB NOT NULL,
  subtotal NUMERIC(10,2) NOT NULL, shipping_cost NUMERIC(10,2) DEFAULT 0,
  discount_amount NUMERIC(10,2) DEFAULT 0, tax_amount NUMERIC(10,2) DEFAULT 0,
  total_amount NUMERIC(10,2) NOT NULL,
  coupon_code TEXT,
  order_status TEXT DEFAULT 'pending' CHECK (order_status IN ('pending','processing','shipped','delivered','cancelled')),
  payment_status TEXT DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid','paid','refunded')),
  payment_method TEXT, tracking_number TEXT, courier_name TEXT, admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);
 
-- order_items
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL, product_image TEXT, variant_label TEXT,
  quantity INTEGER NOT NULL, unit_price NUMERIC(10,2) NOT NULL,
  line_total NUMERIC(10,2) NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW()
);
 
-- reviews
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES site_users(id) ON DELETE SET NULL,
  reviewer_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
 
-- bundles
CREATE TABLE IF NOT EXISTS bundles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, description TEXT, image_url TEXT,
  extra_discount_percent NUMERIC(5,2) DEFAULT 0,
  show_in_shop BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS bundle_products (
  bundle_id UUID NOT NULL REFERENCES bundles(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  PRIMARY KEY (bundle_id, product_id)
);
 
-- coupons
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage','fixed')),
  discount_value NUMERIC(10,2) NOT NULL,
  min_order_value NUMERIC(10,2) DEFAULT 0,
  max_discount_amount NUMERIC(10,2),
  expiry_date TIMESTAMPTZ NOT NULL,
  usage_limit INTEGER, total_used INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
 
-- cms_content (universal CMS for all pages)
CREATE TABLE IF NOT EXISTS cms_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page TEXT NOT NULL, section TEXT NOT NULL, content_key TEXT NOT NULL,
  content_value TEXT,
  content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text','html','image_url','url','boolean','json')),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(page, section, content_key)
);
 
-- cms_banners
CREATE TABLE IF NOT EXISTS cms_banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT, link_url TEXT, image_url TEXT,
  display_order INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- cms_blogs
CREATE TABLE IF NOT EXISTS cms_blogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL, content TEXT NOT NULL,
  featured_image TEXT,
  status TEXT DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- cms_static_pages
CREATE TABLE IF NOT EXISTS cms_static_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_key TEXT NOT NULL UNIQUE,
  content TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(), updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- cms_announcement
CREATE TABLE IF NOT EXISTS cms_announcement (
  id SERIAL PRIMARY KEY,
  text TEXT, link_url TEXT,
  is_active BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- shipping_methods
CREATE TABLE IF NOT EXISTS shipping_methods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL, carrier TEXT NOT NULL,
  rate_type TEXT NOT NULL CHECK (rate_type IN ('flat','weight_based','free_above')),
  base_cost NUMERIC(10,2) DEFAULT 0, free_above_amount NUMERIC(10,2),
  estimated_delivery TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active','inactive')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
 
-- inventory_log
CREATE TABLE IF NOT EXISTS inventory_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  previous_stock INTEGER NOT NULL, new_stock INTEGER NOT NULL,
  change_amount INTEGER NOT NULL, reason TEXT NOT NULL,
  changed_by UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
 
-- role_permissions
CREATE TABLE IF NOT EXISTS role_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role TEXT NOT NULL CHECK (role IN ('super_admin','manager','staff')),
  module TEXT NOT NULL,
  can_view BOOLEAN DEFAULT FALSE, can_create BOOLEAN DEFAULT FALSE,
  can_edit BOOLEAN DEFAULT FALSE, can_delete BOOLEAN DEFAULT FALSE,
  UNIQUE(role, module)
);

CREATE TABLE IF NOT EXISTS federation_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT,
  body TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS partner_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_name TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- updated_at trigger (apply to all tables with updated_at column)
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_updated_at_products ON products;
CREATE TRIGGER trigger_updated_at_products BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT USING (status = 'published');
 
-- Helper function for admin check
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_users WHERE auth_user_id = auth.uid() AND status = 'active'
  );
$$ LANGUAGE sql SECURITY DEFINER;
