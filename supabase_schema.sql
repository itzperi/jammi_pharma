-- ─────────────────────────────────────────
-- CORE TABLES (Idempotent)
-- ─────────────────────────────────────────

-- Ensure columns exist for RLS policies
DO $$ 
BEGIN
    BEGIN
        ALTER TABLE products ADD COLUMN IF NOT EXISTS active boolean default true;
    EXCEPTION WHEN undefined_table THEN
        NULL;
    END;
    BEGIN
        ALTER TABLE categories ADD COLUMN IF NOT EXISTS active boolean default true;
    EXCEPTION WHEN undefined_table THEN
        NULL;
    END;
    BEGIN
        ALTER TABLE bundles ADD COLUMN IF NOT EXISTS active boolean default true;
    EXCEPTION WHEN undefined_table THEN
        NULL;
    END;
    BEGIN
        ALTER TABLE coupons ADD COLUMN IF NOT EXISTS active boolean default true;
    EXCEPTION WHEN undefined_table THEN
        NULL;
    END;
END $$;

-- Table Definitions
create table if not exists products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  price numeric(10,2) not null,
  original_price numeric(10,2),
  discount_percent numeric(5,2) default 0,
  images text[] default '{}',
  category_id uuid,
  category_name text,
  stock integer default 0,
  stock_status text default 'in_stock',
  tags text[] default '{}',
  average_rating numeric(3,2) default 0,
  review_count integer default 0,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists categories (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  image text,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists bundles (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  description text,
  product_ids uuid[] not null,
  discount_percent numeric(4,2) not null,
  image_url text,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists orders (
  id uuid default gen_random_uuid() primary key,
  customer_id text,
  razorpay_order_id text,
  razorpay_payment_id text,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address jsonb not null,
  items jsonb not null,
  subtotal numeric(10,2) not null,
  discount numeric(10,2) default 0,
  coupon_code text,
  total numeric(10,2) not null,
  payment_status text default 'pending',
  order_status text default 'placed',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists customers (
  id text primary key,
  name text not null,
  email text unique not null,
  phone text,
  total_orders integer default 0,
  total_spent numeric(10,2) default 0,
  status text default 'active',
  joined_at timestamptz default now()
);

create table if not exists reviews (
  id uuid default gen_random_uuid() primary key,
  product_id uuid references products(id) on delete cascade,
  customer_name text not null,
  rating integer not null,
  review_text text,
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists coupons (
  id uuid default gen_random_uuid() primary key,
  code text unique not null,
  type text not null,
  value numeric(10,2) not null,
  min_order_value numeric(10,2) default 0,
  max_uses integer default 100,
  used_count integer default 0,
  expires_at timestamptz,
  active boolean default true,
  created_at timestamptz default now()
);

create table if not exists payments (
  id uuid default gen_random_uuid() primary key,
  transaction_id text unique not null,
  customer_name text,
  order_id uuid references orders(id),
  amount numeric(10,2) not null,
  method text,
  status text default 'success',
  created_at timestamptz default now()
);

create table if not exists site_content (
  id text primary key,
  page text not null,
  content_type text not null,
  value text not null,
  updated_at timestamptz default now()
);

-- RLS Configuration
alter table products enable row level security;
alter table categories enable row level security;
alter table orders enable row level security;
alter table customers enable row level security;
alter table reviews enable row level security;
alter table coupons enable row level security;
alter table payments enable row level security;
alter table bundles enable row level security;
alter table site_content enable row level security;

-- Policies (Idempotent)
do $$ begin
  if not exists (select 1 from pg_policies where tablename = 'products' and policyname = 'public read products') then
    create policy "public read products" on products for select using (active = true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'products' and policyname = 'auth all products') then
    create policy "auth all products" on products for all using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where tablename = 'categories' and policyname = 'public read categories') then
    create policy "public read categories" on categories for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'categories' and policyname = 'auth all categories') then
    create policy "auth all categories" on categories for all using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where tablename = 'bundles' and policyname = 'public read bundles') then
    create policy "public read bundles" on bundles for select using (active = true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'bundles' and policyname = 'auth all bundles') then
    create policy "auth all bundles" on bundles for all using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where tablename = 'reviews' and policyname = 'public read approved reviews') then
    create policy "public read approved reviews" on reviews for select using (status = 'approved');
  end if;
  if not exists (select 1 from pg_policies where tablename = 'reviews' and policyname = 'anyone insert review') then
    create policy "anyone insert review" on reviews for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'reviews' and policyname = 'auth all reviews') then
    create policy "auth all reviews" on reviews for all using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where tablename = 'orders' and policyname = 'anyone insert order') then
    create policy "anyone insert order" on orders for insert with check (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'orders' and policyname = 'auth all orders') then
    create policy "auth all orders" on orders for all using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where tablename = 'customers' and policyname = 'auth all customers') then
    create policy "auth all customers" on customers for all using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where tablename = 'payments' and policyname = 'auth all payments') then
    create policy "auth all payments" on payments for all using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where tablename = 'coupons' and policyname = 'public read coupons') then
    create policy "public read coupons" on coupons for select using (active = true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'coupons' and policyname = 'auth all coupons') then
    create policy "auth all coupons" on coupons for all using (auth.role() = 'authenticated');
  end if;
  if not exists (select 1 from pg_policies where tablename = 'site_content' and policyname = 'public read site content') then
    create policy "public read site content" on site_content for select using (true);
  end if;
  if not exists (select 1 from pg_policies where tablename = 'site_content' and policyname = 'auth all site content') then
    create policy "auth all site content" on site_content for all using (auth.role() = 'authenticated');
  end if;
end $$;
