-- Enable pgcrypto extension for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create audit log table for tracking sensitive data access
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    table_name TEXT NOT NULL,
    operation TEXT NOT NULL,
    accessed_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on audit logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- System can insert audit logs
CREATE POLICY "System can insert audit logs"
ON public.audit_logs
FOR INSERT
WITH CHECK (true);

-- Create function to encrypt medical data
CREATE OR REPLACE FUNCTION public.encrypt_medical_data(data TEXT, encryption_key TEXT DEFAULT 'medical_data_key_2025')
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT CASE 
    WHEN data IS NULL OR data = '' THEN NULL
    ELSE encode(pgp_sym_encrypt(data, encryption_key), 'base64')
  END
$$;

-- Create function to decrypt medical data (admin only)
CREATE OR REPLACE FUNCTION public.decrypt_medical_data(encrypted_data TEXT, encryption_key TEXT DEFAULT 'medical_data_key_2025')
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT CASE 
    WHEN encrypted_data IS NULL OR encrypted_data = '' THEN NULL
    ELSE pgp_sym_decrypt(decode(encrypted_data, 'base64'), encryption_key)
  END
$$;

-- Add new column for encrypted medical data
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS medical_info_encrypted TEXT;

-- Migrate existing medical data to encrypted format
UPDATE public.contacts 
SET medical_info_encrypted = public.encrypt_medical_data(medical_info)
WHERE medical_info IS NOT NULL AND medical_info != '';

-- Create function for secure medical data updates
CREATE OR REPLACE FUNCTION public.update_medical_info_secure(
  contact_id UUID,
  new_medical_info TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_check BOOLEAN;
BEGIN
  -- Verify admin access
  SELECT public.has_role(auth.uid(), 'admin') INTO admin_check;
  
  IF NOT admin_check THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;
  
  -- Log the update attempt
  INSERT INTO public.audit_logs (
    user_id, 
    table_name, 
    operation, 
    accessed_data
  ) VALUES (
    auth.uid(),
    'contacts',
    'UPDATE_MEDICAL_INFO',
    jsonb_build_object('contact_id', contact_id)
  );
  
  -- Update with encryption
  UPDATE public.contacts 
  SET 
    medical_info_encrypted = public.encrypt_medical_data(new_medical_info),
    updated_at = now()
  WHERE id = contact_id;
  
  RETURN FOUND;
END;
$$;

-- Create function to get decrypted medical info (admin only)
CREATE OR REPLACE FUNCTION public.get_medical_info_decrypted(contact_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  admin_check BOOLEAN;
  encrypted_data TEXT;
  result TEXT;
BEGIN
  -- Verify admin access
  SELECT public.has_role(auth.uid(), 'admin') INTO admin_check;
  
  IF NOT admin_check THEN
    RAISE EXCEPTION 'Access denied: Admin role required for medical data';
  END IF;
  
  -- Log the access attempt
  INSERT INTO public.audit_logs (
    user_id, 
    table_name, 
    operation, 
    accessed_data
  ) VALUES (
    auth.uid(),
    'contacts',
    'ACCESS_MEDICAL_INFO',
    jsonb_build_object('contact_id', contact_id)
  );
  
  -- Get encrypted data and decrypt
  SELECT medical_info_encrypted INTO encrypted_data
  FROM public.contacts 
  WHERE id = contact_id;
  
  IF encrypted_data IS NOT NULL THEN
    result := public.decrypt_medical_data(encrypted_data);
  END IF;
  
  RETURN result;
END;
$$;

-- Create trigger to automatically encrypt medical info on insert/update
CREATE OR REPLACE FUNCTION public.encrypt_medical_on_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Auto-encrypt medical_info if it's being set
  IF NEW.medical_info IS NOT NULL AND NEW.medical_info != '' THEN
    NEW.medical_info_encrypted := public.encrypt_medical_data(NEW.medical_info);
    -- Clear the plain text field for security
    NEW.medical_info := NULL;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Add trigger to contacts table
DROP TRIGGER IF EXISTS encrypt_medical_trigger ON public.contacts;
CREATE TRIGGER encrypt_medical_trigger
  BEFORE INSERT OR UPDATE ON public.contacts
  FOR EACH ROW
  EXECUTE FUNCTION public.encrypt_medical_on_change();

-- Force RLS on audit logs
ALTER TABLE public.audit_logs FORCE ROW LEVEL SECURITY;