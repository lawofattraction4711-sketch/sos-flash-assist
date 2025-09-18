-- Add user_id column to contacts table for proper access control
ALTER TABLE public.contacts 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop the insecure policy that allows anyone to insert
DROP POLICY "Anyone can insert contact details" ON public.contacts;

-- Create secure policies for authenticated users
CREATE POLICY "Authenticated users can insert their own contacts" 
ON public.contacts 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own contacts" 
ON public.contacts 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can update their own contacts" 
ON public.contacts 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own contacts" 
ON public.contacts 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id OR has_role(auth.uid(), 'admin'::app_role));