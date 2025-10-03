-- Fix search path security warning for functions
-- Update the function to ensure stable search path
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
SET search_path = 'public'
AS $$
  SELECT 
    m.id,
    m.created_at,
    m.full_name,
    m.username,
    m.role
  FROM public.mel_users m
  WHERE m.id = $1
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