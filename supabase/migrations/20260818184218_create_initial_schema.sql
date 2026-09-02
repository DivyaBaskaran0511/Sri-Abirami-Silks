/*
# Sri Abirami Silks — Initial Schema

## Overview
Creates the core database tables for a silk saree e-commerce MVP:
categories, products, and enquiries. Also seeds 6 realistic demo
sarees across several categories, clearly marked as sample data.

## Tables

### categories
- `id` (uuid, PK)
- `name` (text, unique, not null) — e.g. "Kanchipuram", "Banarasi"
- `slug` (text, unique, not null) — URL-friendly identifier
- `description` (text) — optional marketing blurb
- `image_url` (text) — optional category hero image
- `sort_order` (int, default 0) — display ordering
- `created_at` (timestamptz)

### products
- `id` (uuid, PK)
- `name` (text, not null)
- `code` (text, unique, not null) — human-readable product code (e.g. "KAN-001")
- `description` (text, not null)
- `price` (numeric(10,2), not null) — in INR
- `category_id` (uuid, FK → categories, not null)
- `fabric` (text, not null) — e.g. "Pure Kanchipuram Silk"
- `color` (text, not null) — primary color name
- `occasion` (text, not null) — e.g. "Wedding", "Festive"
- `stock` (int, default 0)
- `images` (text[]) — array of image URLs (first is primary)
- `is_featured` (bool, default false) — show on homepage
- `is_new_arrival` (bool, default false) — show in new arrivals
- `is_sample` (bool, default false) — marks demo/seed data
- `created_at` (timestamptz)

### enquiries
- `id` (uuid, PK)
- `type` (text, not null) — 'contact' | 'wholesale'
- `name` (text, not null)
- `email` (text)
- `phone` (text, not null)
- `message` (text, not null)
- `product_id` (uuid, FK → products, nullable) — if enquiry is about a specific product
- `status` (text, default 'new') — 'new' | 'read' | 'responded'
- `created_at` (timestamptz)

## Security
- RLS enabled on all tables.
- This MVP has NO customer sign-in, so products and categories are
  publicly readable (anon + authenticated). Enquiries are insertable
  by anon (form submissions) but only readable by authenticated admin
  users (admin reads via authenticated session).
- Product/category writes are restricted to authenticated users (admin).
*/

-- ==================== CATEGORIES ====================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_categories" ON categories;
CREATE POLICY "auth_insert_categories" ON categories FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_categories" ON categories;
CREATE POLICY "auth_update_categories" ON categories FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_categories" ON categories;
CREATE POLICY "auth_delete_categories" ON categories FOR DELETE
  TO authenticated USING (true);

-- ==================== PRODUCTS ====================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  description text NOT NULL,
  price numeric(10,2) NOT NULL,
  category_id uuid NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  fabric text NOT NULL,
  color text NOT NULL,
  occasion text NOT NULL,
  stock int NOT NULL DEFAULT 0,
  images text[] NOT NULL DEFAULT '{}',
  is_featured boolean NOT NULL DEFAULT false,
  is_new_arrival boolean NOT NULL DEFAULT false,
  is_sample boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_products" ON products;
CREATE POLICY "auth_insert_products" ON products FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_products" ON products;
CREATE POLICY "auth_update_products" ON products FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_products" ON products;
CREATE POLICY "auth_delete_products" ON products FOR DELETE
  TO authenticated USING (true);

-- ==================== ENQUIRIES ====================
CREATE TABLE IF NOT EXISTS enquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('contact', 'wholesale')),
  name text NOT NULL,
  email text,
  phone text NOT NULL,
  message text NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'responded')),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;

-- Anyone can submit an enquiry (public form)
DROP POLICY IF EXISTS "public_insert_enquiries" ON enquiries;
CREATE POLICY "public_insert_enquiries" ON enquiries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Only authenticated admin can read enquiries
DROP POLICY IF EXISTS "auth_read_enquiries" ON enquiries;
CREATE POLICY "auth_read_enquiries" ON enquiries FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_enquiries" ON enquiries;
CREATE POLICY "auth_update_enquiries" ON enquiries FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_enquiries" ON enquiries;
CREATE POLICY "auth_delete_enquiries" ON enquiries FOR DELETE
  TO authenticated USING (true);

-- ==================== INDEXES ====================
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_is_new_arrival ON products(is_new_arrival);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);
CREATE INDEX IF NOT EXISTS idx_enquiries_type ON enquiries(type);

-- ==================== SEED DATA ====================
-- Categories
INSERT INTO categories (name, slug, description, image_url, sort_order) VALUES
  ('Kanchipuram Silk', 'kanchipuram-silk', 'Authentic Kanchipuram silk sarees woven with pure mulberry silk and zari borders.', 'https://images.pexels.com/photos/10317106/pexels-photo-10317106.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 1),
  ('Banarasi Silk', 'banarasi-silk', 'Luxurious Banarasi sarees from the holy city of Varanasi, known for gold brocade.', 'https://images.pexels.com/photos/10317113/pexels-photo-10317113.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 2),
  ('Soft Silk', 'soft-silk', 'Lightweight soft silk sarees perfect for daily wear and casual occasions.', 'https://images.pexels.com/photos/5447529/pexels-photo-5447529.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 3),
  ('Cotton Silk', 'cotton-silk', 'Breathable cotton-silk blend sarees combining comfort with elegance.', 'https://images.pexels.com/photos/8750030/pexels-photo-8750030.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 4),
  ('Wedding Collection', 'wedding-collection', 'Bridal silk sarees crafted for the most special day of your life.', 'https://images.pexels.com/photos/28943474/pexels-photo-28943474.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 5),
  ('Festive Collection', 'festive-collection', 'Vibrant festive sarees to celebrate every occasion in style.', 'https://images.pexels.com/photos/28943543/pexels-photo-28943543.jpeg?auto=compress&cs=tinysrgb&h=650&w=940', 6)
ON CONFLICT (slug) DO NOTHING;

-- Products (6 demo sarees, clearly marked as sample data)
-- Using category slugs to fetch category IDs
INSERT INTO products (name, code, description, price, category_id, fabric, color, occasion, stock, images, is_featured, is_new_arrival, is_sample)
SELECT
  'Royal Kanchipuram Bridal Saree',
  'KAN-001',
  'A magnificent pure Kanchipuram silk saree with a rich gold zari border and traditional temple motifs. Handwoven by master weavers, this saree features a contrasting pallu and comes with a matching blouse piece. Perfect for the bride who wants to carry tradition with timeless grace.',
  28500.00,
  c.id,
  'Pure Kanchipuram Silk',
  'Maroon & Gold',
  'Wedding',
  5,
  ARRAY[
    'https://images.pexels.com/photos/28943474/pexels-photo-28943474.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'https://images.pexels.com/photos/10317106/pexels-photo-10317106.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'https://images.pexels.com/photos/10317113/pexels-photo-10317113.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
  ],
  true,
  true,
  true
FROM categories c WHERE c.slug = 'kanchipuram-silk'
ON CONFLICT (code) DO NOTHING;

INSERT INTO products (name, code, description, price, category_id, fabric, color, occasion, stock, images, is_featured, is_new_arrival, is_sample)
SELECT
  'Banarasi Gold Brocade Saree',
  'BAN-002',
  'An exquisite Banarasi silk saree featuring intricate gold brocade work throughout. The deep red body is adorned with floral jaal patterns and a luxurious gold border. A timeless piece that embodies the craftsmanship of Varanasi weavers.',
  32000.00,
  c.id,
  'Banarasi Silk',
  'Red & Gold',
  'Wedding',
  3,
  ARRAY[
    'https://images.pexels.com/photos/28943543/pexels-photo-28943543.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'https://images.pexels.com/photos/10317113/pexels-photo-10317113.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'https://images.pexels.com/photos/5447529/pexels-photo-5447529.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
  ],
  true,
  false,
  true
FROM categories c WHERE c.slug = 'banarasi-silk'
ON CONFLICT (code) DO NOTHING;

INSERT INTO products (name, code, description, price, category_id, fabric, color, occasion, stock, images, is_featured, is_new_arrival, is_sample)
SELECT
  'Soft Silk Daily Elegance Saree',
  'SFT-003',
  'A lightweight soft silk saree in a beautiful peacock blue shade with a subtle zari border. Easy to drape and comfortable for all-day wear, making it perfect for office and casual outings. Includes matching blouse piece.',
  8500.00,
  c.id,
  'Soft Silk',
  'Peacock Blue',
  'Casual',
  12,
  ARRAY[
    'https://images.pexels.com/photos/7693907/pexels-photo-7693907.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'https://images.pexels.com/photos/8750030/pexels-photo-8750030.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
  ],
  false,
  true,
  true
FROM categories c WHERE c.slug = 'soft-silk'
ON CONFLICT (code) DO NOTHING;

INSERT INTO products (name, code, description, price, category_id, fabric, color, occasion, stock, images, is_featured, is_new_arrival, is_sample)
SELECT
  'Cotton-Silk Festive Saree',
  'CTN-004',
  'A breathable cotton-silk blend saree in vibrant orange with traditional motifs. Combines the comfort of cotton with the sheen of silk. Ideal for festive gatherings and family celebrations.',
  6800.00,
  c.id,
  'Cotton-Silk Blend',
  'Orange',
  'Festive',
  8,
  ARRAY[
    'https://images.pexels.com/photos/38969253/pexels-photo-38969253.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'https://images.pexels.com/photos/8750030/pexels-photo-8750030.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
  ],
  true,
  true,
  true
FROM categories c WHERE c.slug = 'cotton-silk'
ON CONFLICT (code) DO NOTHING;

INSERT INTO products (name, code, description, price, category_id, fabric, color, occasion, stock, images, is_featured, is_new_arrival, is_sample)
SELECT
  'Bridal Kanjivaram Heirloom Saree',
  'KAN-005',
  'A stunning bridal Kanjivaram saree in deep maroon with an elaborate gold zari pallu featuring peacock and temple motifs. This heirloom-quality piece is handwoven over weeks by skilled artisans and is designed to be passed down generations.',
  45000.00,
  c.id,
  'Pure Kanjivaram Silk',
  'Maroon & Gold',
  'Wedding',
  2,
  ARRAY[
    'https://images.pexels.com/photos/27575104/pexels-photo-27575104.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'https://images.pexels.com/photos/28943474/pexels-photo-28943474.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'https://images.pexels.com/photos/10317106/pexels-photo-10317106.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
  ],
  true,
  false,
  true
FROM categories c WHERE c.slug = 'wedding-collection'
ON CONFLICT (code) DO NOTHING;

INSERT INTO products (name, code, description, price, category_id, fabric, color, occasion, stock, images, is_featured, is_new_arrival, is_sample)
SELECT
  'Festive Yellow Silk Saree',
  'FST-006',
  'A radiant yellow silk saree with floral motifs and a contrasting green border. Light and cheerful, this saree is perfect for festivals, pujas, and daytime celebrations. Comes with a running blouse piece.',
  12500.00,
  c.id,
  'Art Silk',
  'Yellow & Green',
  'Festive',
  6,
  ARRAY[
    'https://images.pexels.com/photos/34210956/pexels-photo-34210956.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    'https://images.pexels.com/photos/34211603/pexels-photo-34211603.jpeg?auto=compress&cs=tinysrgb&h=650&w=940'
  ],
  false,
  true,
  true
FROM categories c WHERE c.slug = 'festive-collection'
ON CONFLICT (code) DO NOTHING;
