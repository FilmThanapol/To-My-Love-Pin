
-- Create a table to store the PIN code for validation
CREATE TABLE public.pin_lock (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  pin_code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the anniversary PIN code
INSERT INTO public.pin_lock (pin_code) VALUES ('180724');

-- Enable RLS (though this will be a simple public check)
ALTER TABLE public.pin_lock ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read the PIN (for validation)
CREATE POLICY "Allow PIN validation" 
  ON public.pin_lock 
  FOR SELECT 
  TO public;
