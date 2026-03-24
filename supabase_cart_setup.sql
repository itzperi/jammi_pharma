-- ============================================================
-- JAMMI PHARMA — Guest Cart Table Setup
-- Run this in the Supabase SQL Editor.
-- This script is fully idempotent — safe to re-run.
-- ============================================================

-- 1. Create the guest_carts table
CREATE TABLE IF NOT EXISTS guest_carts (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  guest_id    TEXT        NOT NULL,
  product_id  UUID        NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity    INTEGER     NOT NULL DEFAULT 1 CHECK (quantity > 0),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (guest_id, product_id)
);

-- Index for fast look-ups by guest
CREATE INDEX IF NOT EXISTS idx_guest_carts_guest_id ON guest_carts(guest_id);

-- 2. Enable Row Level Security
ALTER TABLE guest_carts ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies (idempotent)
DO $$ BEGIN

  -- Anyone (anon) can SELECT their own cart rows
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'guest_carts' AND policyname = 'Anyone reads own cart'
  ) THEN
    CREATE POLICY "Anyone reads own cart"
      ON guest_carts FOR SELECT
      USING (true);
  END IF;

  -- Anyone can INSERT into cart (anon users)
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'guest_carts' AND policyname = 'Anyone inserts into cart'
  ) THEN
    CREATE POLICY "Anyone inserts into cart"
      ON guest_carts FOR INSERT
      WITH CHECK (true);
  END IF;

  -- Anyone can UPDATE their own cart rows
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'guest_carts' AND policyname = 'Anyone updates own cart'
  ) THEN
    CREATE POLICY "Anyone updates own cart"
      ON guest_carts FOR UPDATE
      USING (true);
  END IF;

  -- Anyone can DELETE from cart
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'guest_carts' AND policyname = 'Anyone deletes from cart'
  ) THEN
    CREATE POLICY "Anyone deletes from cart"
      ON guest_carts FOR DELETE
      USING (true);
  END IF;

END $$;

-- 4. Enable Realtime so useCart.ts subscription works instantly
DO $$ BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE guest_carts;
  EXCEPTION WHEN OTHERS THEN
    NULL; -- already added, safe to ignore
  END;
END $$;
