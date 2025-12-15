-- Drop existing policies first, then recreate all storage policies

-- Gallery bucket policies
DROP POLICY IF EXISTS "Admin can upload to gallery" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update gallery" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete from gallery" ON storage.objects;
DROP POLICY IF EXISTS "Public can view gallery" ON storage.objects;

CREATE POLICY "Admin can upload to gallery" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'gallery' AND (SELECT is_admin(auth.uid())));

CREATE POLICY "Admin can update gallery" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'gallery' AND (SELECT is_admin(auth.uid())));

CREATE POLICY "Admin can delete from gallery" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'gallery' AND (SELECT is_admin(auth.uid())));

CREATE POLICY "Public can view gallery" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'gallery');

-- Images bucket policies
DROP POLICY IF EXISTS "Admin can upload to images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update images" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete from images" ON storage.objects;
DROP POLICY IF EXISTS "Public can view images" ON storage.objects;

CREATE POLICY "Admin can upload to images" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'images' AND (SELECT is_admin(auth.uid())));

CREATE POLICY "Admin can update images" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'images' AND (SELECT is_admin(auth.uid())));

CREATE POLICY "Admin can delete from images" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'images' AND (SELECT is_admin(auth.uid())));

CREATE POLICY "Public can view images" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'images');

-- President/Secretary bucket policies
DROP POLICY IF EXISTS "Admin can upload to president_secretary" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update president_secretary" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete from president_secretary" ON storage.objects;
DROP POLICY IF EXISTS "Public can view president_secretary" ON storage.objects;

CREATE POLICY "Admin can upload to president_secretary" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'president_secretary' AND (SELECT is_admin(auth.uid())));

CREATE POLICY "Admin can update president_secretary" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'president_secretary' AND (SELECT is_admin(auth.uid())));

CREATE POLICY "Admin can delete from president_secretary" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'president_secretary' AND (SELECT is_admin(auth.uid())));

CREATE POLICY "Public can view president_secretary" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'president_secretary');

-- Equipment bucket policies
DROP POLICY IF EXISTS "Admin can upload to equipment" ON storage.objects;
DROP POLICY IF EXISTS "Admin can update equipment storage" ON storage.objects;
DROP POLICY IF EXISTS "Admin can delete from equipment" ON storage.objects;
DROP POLICY IF EXISTS "Public can view equipment" ON storage.objects;

CREATE POLICY "Admin can upload to equipment" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'equipment' AND (SELECT is_admin(auth.uid())));

CREATE POLICY "Admin can update equipment storage" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'equipment' AND (SELECT is_admin(auth.uid())));

CREATE POLICY "Admin can delete from equipment" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'equipment' AND (SELECT is_admin(auth.uid())));

CREATE POLICY "Public can view equipment" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'equipment');

-- MEL Users admin view policy
DROP POLICY IF EXISTS "Admin can view all MEL users" ON public.mel_users;
CREATE POLICY "Admin can view all MEL users" ON public.mel_users
FOR SELECT TO authenticated
USING (is_admin(auth.uid()));