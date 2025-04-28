/*
  # Add admin policies for products table

  1. Security Changes
    - Add policies for admin users to manage products
    - Fix RLS policies for products table
*/

-- Add policies for admin users to manage products
CREATE POLICY "Admin users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admin users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');