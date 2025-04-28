/*
  # Add INSERT policy for profiles table

  1. Changes
    - Add INSERT policy to allow users to create their own profile

  2. Security
    - Users can only create a profile with their own user ID
    - Maintains existing RLS policies for SELECT and UPDATE
*/

CREATE POLICY "Users can create their own profile" 
ON profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (id = auth.uid());