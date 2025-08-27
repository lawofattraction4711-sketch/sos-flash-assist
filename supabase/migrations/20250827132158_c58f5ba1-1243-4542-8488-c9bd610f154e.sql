-- Fix security warnings by setting search_path on all functions

-- Update encrypt_medical_data function
CREATE OR REPLACE FUNCTION public.encrypt_medical_data(data TEXT, encryption_key TEXT DEFAULT 'medical_data_key_2025')
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    WHEN data IS NULL OR data = '' THEN NULL
    ELSE encode(pgp_sym_encrypt(data, encryption_key), 'base64')
  END
$$;

-- Update decrypt_medical_data function
CREATE OR REPLACE FUNCTION public.decrypt_medical_data(encrypted_data TEXT, encryption_key TEXT DEFAULT 'medical_data_key_2025')
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    WHEN encrypted_data IS NULL OR encrypted_data = '' THEN NULL
    ELSE pgp_sym_decrypt(decode(encrypted_data, 'base64'), encryption_key)
  END
$$;

-- Update update_medical_info_secure function
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

-- Update get_medical_info_decrypted function
CREATE OR REPLACE FUNCTION public.get_medical_info_decrypted(contact_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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

-- Update encrypt_medical_on_change function
CREATE OR REPLACE FUNCTION public.encrypt_medical_on_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
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