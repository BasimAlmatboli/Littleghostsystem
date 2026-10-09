/*
  # Create products table

  1. New Tables
    - `products`
      - `id` (text, primary key) - kept as text so existing ids saved inside past orders still match
      - `name` (text, not null)
      - `cost` (numeric, not null)
      - `selling_price` (numeric, not null)
      - `owner` (text, not null) - profit sharing group
      - `sort_order` (integer) - display order in Settings
      - `created_at`, `updated_at` (timestamptz)

  2. Security
    - Enable RLS, allow the app (anon key) to read and manage products,
      matching how the orders and expenses tables are accessed today

  3. Seed
    - Current product catalog from src/data/products.ts
*/

CREATE TABLE IF NOT EXISTS products (
  id text PRIMARY KEY,
  name text NOT NULL,
  cost numeric NOT NULL DEFAULT 0,
  selling_price numeric NOT NULL DEFAULT 0,
  owner text NOT NULL DEFAULT 'yassir'
    CHECK (owner IN ('yassir', 'yassir-ahmed', 'yassir-manal', 'yassir-abbas')),
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "App can manage products" ON products;
CREATE POLICY "App can manage products"
  ON products
  FOR ALL
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO products (id, name, cost, selling_price, owner, sort_order) VALUES
  ('LAZY GHOST T-SHIRT',      'LAZY GHOST T-SHIRT',      41, 179, 'yassir',       1),
  ('DARK GREEN T-SHIRT',      'DARK GREEN T-SHIRT',      45, 179, 'yassir',       2),
  ('OFF WHITE T-SHIRT',       'OFF WHITE T-SHIRT',       45, 179, 'yassir',       3),
  ('TEE ROSE T-SHIRT',        'TEE ROSE T-SHIRT',        45, 179, 'yassir',       4),
  ('BLACK HOODIE',            'BLACK HOODIE',            40, 189, 'yassir-manal', 5),
  ('PINK HOODIE',             'PINK HOODIE',             40, 189, 'yassir-manal', 6),
  ('BABY BLUE HOODIE',        'BABY BLUE HOODIE',        40, 189, 'yassir-manal', 7),
  ('DARK GREEY HOODIE',       'DARK GREEY HOODIE',       40, 189, 'yassir-manal', 8),
  ('Black T-SHIRT',           'Black T-SHIRT',           37, 179, 'yassir-abbas', 9),
  ('Creamy T-SHIRT',          'Creamy T-SHIRT',          37, 179, 'yassir-abbas', 10),
  ('Blue T-shirt',            'Blue T-shirt',            37, 179, 'yassir-abbas', 11),
  ('Black Short',             'Black Short',             52, 169, 'yassir-abbas', 12),
  ('Green Short',             'Green Short',             52, 169, 'yassir-abbas', 13),
  ('Blue Short',              'Blue Short',              52, 169, 'yassir-abbas', 14),
  ('Gray Short',              'Gray Short',              52, 169, 'yassir-abbas', 15),
  ('ZIP-UP DARK GREY HOODIE', 'ZIP-UP DARK GREY HOODIE', 85, 269, 'yassir-abbas', 16),
  ('PANTS DARK GREY',         'PANTS DARK GREY',         85, 269, 'yassir-abbas', 17),
  ('ZIP-UP GREY HOODIE',      'ZIP-UP GREY HOODIE',      85, 269, 'yassir-abbas', 18),
  ('PANTS GREY',              'PANTS GREY',              85, 269, 'yassir-abbas', 19),
  ('LONG SLEEVE T-SHIRT',     'LONG SLEEVE T-SHIRT',     31, 139, 'yassir-abbas', 20),
  ('BASIC T-SHIRT',           'BASIC T-SHIRT',           25,  89, 'yassir-abbas', 21),
  ('SEAM T-SHIRT',            'SEAM T-SHIRT',            36, 149, 'yassir-abbas', 22),
  ('CAP',                     'CAP',                     30, 109, 'yassir-abbas', 23)
ON CONFLICT (id) DO NOTHING;
