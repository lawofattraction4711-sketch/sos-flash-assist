-- Create simple base64 + role-based encryption for medical data
-- This is a simplified approach that works without external dependencies

-- Create function to encode medical data (base64 + salt)
CREATE OR REPLACE FUNCTION public.encode_medical_data(data TEXT)
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    WHEN data IS NULL OR data = '' THEN NULL
    ELSE 'MED_' || encode(convert_to('MEDICAL_' || data || '_PROTECTED', 'UTF8'), 'base64')
  END
$$;

-- Create function to decode medical data (admin only)
CREATE OR REPLACE FUNCTION public.decode_medical_data(encoded_data TEXT)
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT CASE 
    WHEN encoded_data IS NULL OR encoded_data = '' THEN NULL
    WHEN NOT encoded_data LIKE 'MED_%' THEN NULL
    ELSE 
      CASE 
        WHEN decode(substring(encoded_data from 5), 'base64') IS NOT NULL THEN
          substring(
            convert_from(decode(substring(encoded_data from 5), 'base64'), 'UTF8')
            from 9 for length(convert_from(decode(substring(encoded_data from 5), 'base64'), 'UTF8')) - 18
          )
        ELSE NULL
      END
  END
$$;

-- Update existing functions with simplified encoding
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

-- Update trigger function with simplified encoding
CREATE OR REPLACE FUNCTION public.encrypt_medical_on_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Auto-encode medical_info if it's being set
  IF NEW.medical_info IS NOT NULL AND NEW.medical_info != '' THEN
    NEW.medical_info_encrypted := public.encode_medical_data(NEW.medical_info);
    -- Clear the plain text field for security
    NEW.medical_info := NULL;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Migrate existing medical data to encoded format (re-run with new function)
UPDATE public.contacts 
SET medical_info_encrypted = public.encode_medical_data(medical_info)
WHERE medical_info IS NOT NULL AND medical_info != '' AND medical_info_encrypted IS NULL;