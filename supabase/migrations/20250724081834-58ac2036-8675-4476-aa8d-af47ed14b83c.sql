-- Create admins table
CREATE TABLE public.admins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- Create equipment table for MEL inventory
CREATE TABLE public.equipment (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  total_quantity INTEGER NOT NULL DEFAULT 0,
  available_quantity INTEGER NOT NULL DEFAULT 0,
  rental_duration_days INTEGER DEFAULT 7,
  deposit_amount DECIMAL(10,2) DEFAULT 0.00,
  image_url TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create president_secretary table
CREATE TABLE public.president_secretary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  position TEXT NOT NULL CHECK (position IN ('president', 'secretary')),
  name TEXT NOT NULL,
  photo_url TEXT,
  bio TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  tenure_start DATE,
  tenure_end DATE,
  is_current BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create patient_history table (rental history)
CREATE TABLE public.patient_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_name TEXT NOT NULL,
  patient_address TEXT,
  patient_mobile TEXT,
  patient_aadhar TEXT,
  equipment_id UUID REFERENCES public.equipment(id),
  equipment_name TEXT NOT NULL,
  deposit_amount DECIMAL(10,2) DEFAULT 0.00,
  pickup_date DATE NOT NULL,
  expected_return_date DATE NOT NULL,
  actual_return_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'returned', 'overdue')),
  notes TEXT,
  mel_user_id UUID REFERENCES public.mel_users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.president_secretary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for admins table
CREATE POLICY "Admins can manage admins" 
ON public.admins 
FOR ALL 
USING (true);

-- Create RLS policies for equipment table
CREATE POLICY "Anyone can view equipment" 
ON public.equipment 
FOR SELECT 
USING (true);

CREATE POLICY "MEL users can manage equipment" 
ON public.equipment 
FOR ALL 
USING (true);

-- Create RLS policies for president_secretary table
CREATE POLICY "Anyone can view president secretary" 
ON public.president_secretary 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage president secretary" 
ON public.president_secretary 
FOR ALL 
USING (true);

-- Create RLS policies for patient_history table
CREATE POLICY "MEL users can view patient history" 
ON public.patient_history 
FOR SELECT 
USING (true);

CREATE POLICY "MEL users can manage patient history" 
ON public.patient_history 
FOR ALL 
USING (true);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('gallery', 'gallery', true),
  ('mel', 'mel', true),
  ('avatars', 'avatars', true),
  ('documents', 'documents', false);

-- Create storage policies for gallery bucket
CREATE POLICY "Gallery images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'gallery');

CREATE POLICY "Admins can upload gallery images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Admins can update gallery images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'gallery');

CREATE POLICY "Admins can delete gallery images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'gallery');

-- Create storage policies for MEL bucket
CREATE POLICY "MEL files are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'mel');

CREATE POLICY "MEL users can upload MEL files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'mel');

CREATE POLICY "MEL users can update MEL files" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'mel');

CREATE POLICY "MEL users can delete MEL files" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'mel');

-- Create storage policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'avatars');

CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'avatars');

-- Create storage policies for documents bucket
CREATE POLICY "Users can view documents" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'documents');

CREATE POLICY "Admins can upload documents" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Admins can update documents" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'documents');

CREATE POLICY "Admins can delete documents" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'documents');

-- Create update trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at columns
CREATE TRIGGER update_equipment_updated_at
  BEFORE UPDATE ON public.equipment
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_president_secretary_updated_at
  BEFORE UPDATE ON public.president_secretary
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_patient_history_updated_at
  BEFORE UPDATE ON public.patient_history
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();