-- Fix audit log security vulnerability
-- Remove the permissive INSERT policy that allows anyone to insert audit logs

-- Drop the existing insecure policy
DROP POLICY IF EXISTS "System can insert audit logs" ON public.audit_logs;

-- Create a new restrictive policy that only allows service role to insert
CREATE POLICY "Only service role can insert audit logs"
ON public.audit_logs 
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- Add additional security columns for audit integrity
ALTER TABLE public.audit_logs 
ADD COLUMN IF NOT EXISTS session_id TEXT,
ADD COLUMN IF NOT EXISTS request_id TEXT,
ADD COLUMN IF NOT EXISTS hash_verification TEXT;

-- Create a function to generate audit hash for integrity verification
CREATE OR REPLACE FUNCTION public.generate_audit_hash(
  p_user_id UUID,
  p_table_name TEXT,
  p_operation TEXT,
  p_accessed_data JSONB,
  p_timestamp TIMESTAMPTZ
)
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT encode(
    digest(
      COALESCE(p_user_id::TEXT, '') || 
      COALESCE(p_table_name, '') || 
      COALESCE(p_operation, '') || 
      COALESCE(p_accessed_data::TEXT, '') || 
      COALESCE(p_timestamp::TEXT, '') || 
      'AUDIT_SALT_2025',
      'sha256'
    ),
    'hex'
  )
$$;

-- Create a secure audit queue table for functions to use
CREATE TABLE IF NOT EXISTS public.audit_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  table_name TEXT NOT NULL,
  operation TEXT NOT NULL,
  accessed_data JSONB,
  session_id TEXT,
  request_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  processed BOOLEAN DEFAULT FALSE
);

-- Enable RLS on audit_queue
ALTER TABLE public.audit_queue ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert into queue (they can only queue their own audits)
CREATE POLICY "Users can queue their own audit logs"
ON public.audit_queue
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Only service role can read from queue
CREATE POLICY "Only service role can read audit queue"
ON public.audit_queue
FOR SELECT
USING (auth.role() = 'service_role');

-- Only service role can update queue
CREATE POLICY "Only service role can update audit queue"
ON public.audit_queue
FOR UPDATE
USING (auth.role() = 'service_role');

-- Update the medical info functions to use the audit queue instead of direct insertion
CREATE OR REPLACE FUNCTION public.update_medical_info_secure(
  contact_id UUID,
  new_medical_info TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_check BOOLEAN;
BEGIN
  -- Verify admin access
  SELECT public.has_role(auth.uid(), 'admin') INTO admin_check;
  
  IF NOT admin_check THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  -- Queue the audit log (will be processed by secure edge function)
  INSERT INTO public.audit_queue (
    user_id, 
    table_name, 
    operation, 
    accessed_data,
    session_id,
    request_id
  ) VALUES (
    auth.uid(),
    'contacts',
    'UPDATE_MEDICAL_INFO',
    jsonb_build_object('contact_id', contact_id),
    COALESCE(current_setting('request.session_id', true), gen_random_uuid()::TEXT),
    COALESCE(current_setting('request.request_id', true), gen_random_uuid()::TEXT)
  );
  
  -- Update with encoding
  UPDATE public.contacts 
  SET 
    medical_info_encrypted = public.encode_medical_data(new_medical_info),
    updated_at = now()
  WHERE id = contact_id;
  
  RETURN FOUND;
END;
$$;

-- Update get_medical_info_decrypted function
CREATE OR REPLACE FUNCTION public.get_medical_info_decrypted(contact_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_check BOOLEAN;
  encoded_data TEXT;
  result TEXT;
BEGIN
  -- Verify admin access
  SELECT public.has_role(auth.uid(), 'admin') INTO admin_check;
  
  IF NOT admin_check THEN
    RAISE EXCEPTION 'Access denied: Admin role required for medical data';
  END IF;
  
  -- Queue the audit log (will be processed by secure edge function)
  INSERT INTO public.audit_queue (
    user_id, 
    table_name, 
    operation, 
    accessed_data,
    session_id,
    request_id
  ) VALUES (
    auth.uid(),
    'contacts',
    'ACCESS_MEDICAL_INFO',
    jsonb_build_object('contact_id', contact_id),
    COALESCE(current_setting('request.session_id', true), gen_random_uuid()::TEXT),
    COALESCE(current_setting('request.request_id', true), gen_random_uuid()::TEXT)
  );
  
  -- Get encoded data and decode
  SELECT medical_info_encrypted INTO encoded_data
  FROM public.contacts 
  WHERE id = contact_id;
  
  IF encoded_data IS NOT NULL THEN
    result := public.decode_medical_data(encoded_data);
  END IF;
  
  RETURN result;
END;
$$;