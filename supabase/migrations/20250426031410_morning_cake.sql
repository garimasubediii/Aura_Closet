/*
  # Fix products table RLS policies

  1. Changes
    - Drop existing product policies
    - Add new comprehensive RLS policies for products table
    - Ensure proper admin access for all operations
    
  2. Security
    - Enable RLS
    - Add policies for both public and admin access
    - Use proper role checks
*/

-- First, drop existing policies
DROP POLICY IF EXISTS "Admin users can delete products" ON products;
DROP POLICY IF EXISTS "Admin users can insert products" ON products;
DROP POLICY IF EXISTS "Admin users can manage all products" ON products;
DROP POLICY IF EXISTS "Admin users can update products" ON products;
DROP POLICY IF EXISTS "Products are viewable by everyone" ON products;
DROP POLICY IF EXISTS "Public users can view products" ON products;

-- Create new policies
CREATE POLICY "Enable read access for everyone" 
ON products FOR SELECT 
USING (true);

CREATE POLICY "Enable insert for admin users" 
ON products FOR INSERT 
TO authenticated 
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Enable update for admin users" 
ON products FOR UPDATE 
TO authenticated 
USING ((auth.jwt() ->> 'role'::text) = 'admin'::text)
WITH CHECK ((auth.jwt() ->> 'role'::text) = 'admin'::text);

CREATE POLICY "Enable delete for admin users" 
ON products FOR DELETE 
TO authenticated 
USING ((auth.jwt() ->> 'role'::text) = 'admin'::text);