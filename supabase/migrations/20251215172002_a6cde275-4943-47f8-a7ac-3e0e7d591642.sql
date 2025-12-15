-- The admin view policy was successfully created
-- Now clean up any duplicate policies with trailing spaces

-- Drop policies with trailing spaces (note the space at end)
DROP POLICY IF EXISTS "Admin can insert MEL users " ON public.mel_users;
DROP POLICY IF EXISTS "Admin can update MEL users " ON public.mel_users;
DROP POLICY IF EXISTS "Admin can delete MEL users " ON public.mel_users;

-- The policies without trailing spaces already exist, so no need to recreate