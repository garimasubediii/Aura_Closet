/*
  # Add storage bucket for avatars

  1. Storage Changes
    - Create avatars bucket
    - Add policies for authenticated users
*/

-- Create bucket for avatars
INSERT INTO storage.buckets (id, name)
VALUES ('avatars', 'avatars');

-- Allow authenticated users to upload avatars
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'avatars');

CREATE POLICY "Anyone can upload an avatar"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Anyone can update their own avatar"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'avatars');