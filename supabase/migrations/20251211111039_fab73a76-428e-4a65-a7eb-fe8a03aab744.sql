-- Remove public access to patient history table to protect sensitive PII
DROP POLICY IF EXISTS "Public can view patient history" ON patient_history;