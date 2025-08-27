-- Enable pgcrypto extension for encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create audit log table for tracking sensitive data access
CREATE TABLE public.audit_logs (
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

-- Create audit function for sensitive data access
CREATE OR REPLACE FUNCTION public.audit_sensitive_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Log access to contacts table
  IF TG_TABLE_NAME = 'contacts' AND TG_OP = 'SELECT' THEN
    INSERT INTO public.audit_logs (
      user_id, 
      table_name, 
      operation, 
      accessed_data
    ) VALUES (
      auth.uid(),
      TG_TABLE_NAME,
      'SELECT_SENSITIVE',
      jsonb_build_object(
        'contact_id', NEW.id,
        'has_medical_info', CASE WHEN NEW.medical_info IS NOT NULL THEN true ELSE false END
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$;

-- Add new column for encrypted medical data
ALTER TABLE public.contacts ADD COLUMN IF NOT EXISTS medical_info_encrypted TEXT;

-- Migrate existing medical data to encrypted format
UPDATE public.contacts 
SET medical_info_encrypted = public.encrypt_medical_data(medical_info)
WHERE medical_info IS NOT NULL AND medical_info != '';

-- Create secure view for admin access with decryption
CREATE OR REPLACE VIEW public.contacts_admin_view AS
SELECT 
  id,
  created_at,
  updated_at,
  name,
  phone,
  email,
  address,
  emergency_contact,
  -- Decrypt medical info only for admins
  CASE 
    WHEN public.has_role(auth.uid(), 'admin') THEN 
      public.decrypt_medical_data(medical_info_encrypted)
    ELSE '[ENCRYPTED]'
  END as medical_info_decrypted,
  medical_info_encrypted
FROM public.contacts;

-- Enable RLS on the admin view
ALTER VIEW public.contacts_admin_view SET (security_barrier = true);

-- Create policy for admin view access
CREATE POLICY "Admins can access decrypted contact view"
ON public.contacts_admin_view
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

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

-- Create additional role for medical data access (more restrictive)
CREATE POLICY "Medical staff can view medical data only"
ON public.contacts
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin') OR 
  public.has_role(auth.uid(), 'medical_staff')
);

-- Force RLS on audit logs
ALTER TABLE public.audit_logs FORCE ROW LEVEL SECURITY;