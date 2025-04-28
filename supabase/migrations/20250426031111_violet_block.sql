/*
  # Update products table RLS policies

  1. Changes
    - Add new RLS policies for admin users to manage products
    - Policies added:
      - Admin users can insert products
      - Admin users can update products
      - Admin users can delete products
      - Admin users can view all products
    
  2. Security
    - Maintains existing RLS policies
    - Adds specific policies for admin role
    - Uses JWT claims to verify admin status
*/

-- Add policies for admin users
CREATE POLICY "Admin users can manage all products"
ON products
FOR ALL
TO authenticated
USING (
  (auth.jwt() ->> 'role')::text = 'admin'
)
WITH CHECK (
  (auth.jwt() ->> 'role')::text = 'admin'
);

-- Keep the existing policy for public viewing
CREATE POLICY "Public users can view products"
ON products
FOR SELECT
TO anon, authenticated
USING (true);