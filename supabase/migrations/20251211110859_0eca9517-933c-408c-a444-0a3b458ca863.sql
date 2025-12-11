-- Fix function search path for handle_admin_user_creation
CREATE OR REPLACE FUNCTION public.handle_admin_user_creation()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path = public
AS $function$
BEGIN
  -- Only create admin record if the email is 'admin'
  IF NEW.email = 'admin' THEN
    INSERT INTO public.admins (user_id, full_name, email, role)
    VALUES (NEW.id, 'Admin User', NEW.email, 'admin');
  END IF;
  RETURN NEW;
END;
$function$;

-- Fix function search path for is_admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET search_path = public
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.admins 
    WHERE public.admins.user_id = is_admin.user_id
  );
$function$;