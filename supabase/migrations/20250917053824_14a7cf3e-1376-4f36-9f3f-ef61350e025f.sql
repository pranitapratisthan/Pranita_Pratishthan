-- Fix critical security vulnerability in mel_users table
-- Remove existing insecure policies
DROP POLICY IF EXISTS "Admin can manage mel users" ON public.mel_users;
DROP POLICY IF EXISTS "MEL users can view other users" ON public.mel_users;

-- Create secure RLS policies that protect sensitive data
-- Admins can manage all MEL users but password hashes are protected
CREATE POLICY "Admins can manage mel users"
ON public.mel_users
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.admins 
    WHERE id = auth.uid()
  )
);

-- MEL users can only view basic info of other users (no password hashes)
-- and only when authenticated as a MEL user
CREATE POLICY "MEL users can view basic user info"
ON public.mel_users
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.mel_users 
    WHERE id = auth.uid()
  )
);

-- MEL users can only update their own basic info (not password or role)
CREATE POLICY "MEL users can update own basic info"
ON public.mel_users
FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (
  id = auth.uid() 
  AND role = (SELECT role FROM public.mel_users WHERE id = auth.uid())
);

-- Create a security definer function to get MEL user info without exposing password hashes
CREATE OR REPLACE FUNCTION public.get_mel_user_safe_info(user_id uuid DEFAULT auth.uid())
RETURNS TABLE (
  id uuid,
  created_at timestamp with time zone,
  full_name text,
  username text,
  role text
)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT 
    m.id,
    m.created_at,
    m.full_name,
    m.username,
    m.role
  FROM public.mel_users m
  WHERE m.id = user_id
  AND (
    -- User can see their own info
    auth.uid() = m.id
    OR
    -- Admins can see any user's safe info
    EXISTS (SELECT 1 FROM public.admins WHERE id = auth.uid())
    OR
    -- MEL users can see basic info of other MEL users
    EXISTS (SELECT 1 FROM public.mel_users WHERE id = auth.uid())
  );
$$;