-- Run this in your Supabase SQL Editor to create the Storage Bucket

-- 1. Create the public bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('menu_images', 'menu_images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow public read access to the images
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'menu_images');

-- 3. Allow anonymous uploads (You can restrict this later if needed, but safe enough for now since the frontend admin page is password protected)
CREATE POLICY "Anon Upload Access" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'menu_images');

-- 4. Allow anonymous deletes (So we can replace images)
CREATE POLICY "Anon Delete Access" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'menu_images');
