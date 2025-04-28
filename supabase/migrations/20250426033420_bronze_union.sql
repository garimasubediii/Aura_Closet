/*
  # Fix Products Table RLS Policies

  1. Changes
    - Drop existing RLS policies for products table
    - Create new, clearer policies for products table:
      - Allow public read access to all products
      - Allow admin users to perform all CRUD operations
      
  2. Security
    - Maintains RLS enabled on products table
    - Ensures proper access control based on user roles
    - Preserves data integrity through proper policy definitions
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Enable delete for admin users" ON products;
DROP POLICY IF EXISTS "Enable insert for admin users" ON products;
DROP POLICY IF EXISTS "Enable read access for everyone" ON products;
DROP POLICY IF EXISTS "Enable update for admin users" ON products;

-- Create new policies with proper definitions
CREATE POLICY "Allow public read access to products"
ON products
FOR SELECT
TO public
USING (true);

CREATE POLICY "Allow admin full access to products"
ON products
TO authenticated
USING (auth.jwt() ->> 'role' = 'admin')
WITH CHECK (auth.jwt() ->> 'role' = 'admin');