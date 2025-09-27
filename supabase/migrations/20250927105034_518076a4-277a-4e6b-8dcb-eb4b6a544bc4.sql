-- Add restrictive RLS policies to prevent privilege escalation on user_roles table

-- Prevent users from inserting new role assignments
-- Only system triggers and admins should be able to insert roles
CREATE POLICY "Prevent user role insertion" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (false);

-- Prevent users from updating their roles
-- Role changes should only be done by admins through proper channels
CREATE POLICY "Prevent user role updates" 
ON public.user_roles 
FOR UPDATE 
USING (false);

-- Prevent users from deleting their roles
-- Role removal should only be done by admins or system processes
CREATE POLICY "Prevent user role deletion" 
ON public.user_roles 
FOR DELETE 
USING (false);