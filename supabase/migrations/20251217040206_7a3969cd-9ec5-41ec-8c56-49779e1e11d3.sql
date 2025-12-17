-- Add aadhaar_number and address columns to patient_history table
ALTER TABLE public.patient_history 
ADD COLUMN aadhaar_number text,
ADD COLUMN address text;