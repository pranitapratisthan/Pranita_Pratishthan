-- Add missing columns to fix frontend connectivity issues

-- Add missing columns to youtube_videos table
ALTER TABLE public.youtube_videos 
ADD COLUMN IF NOT EXISTS thumbnail_url text,
ADD COLUMN IF NOT EXISTS is_news boolean DEFAULT false;

-- Add missing columns to popup_events table  
ALTER TABLE public.popup_events
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT now();

-- Add missing columns to president_secretary table
ALTER TABLE public.president_secretary
ADD COLUMN IF NOT EXISTS role text;

-- Create trigger for popup_events updated_at
CREATE OR REPLACE TRIGGER update_popup_events_updated_at
  BEFORE UPDATE ON public.popup_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Update existing president_secretary records to have role values
UPDATE public.president_secretary 
SET role = position 
WHERE role IS NULL;