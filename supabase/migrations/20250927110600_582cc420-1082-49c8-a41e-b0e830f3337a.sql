-- Create fields table
CREATE TABLE public.fields (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  address TEXT,
  description TEXT,
  price_per_hour DECIMAL(10,2) NOT NULL,
  rating DECIMAL(3,2) DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  operating_hours TEXT DEFAULT '6:00 AM - 10:00 PM',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create field_images table
CREATE TABLE public.field_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  field_id UUID NOT NULL REFERENCES public.fields(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_primary BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create field_amenities table
CREATE TABLE public.field_amenities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  field_id UUID NOT NULL REFERENCES public.fields(id) ON DELETE CASCADE,
  amenity TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create bookings table
CREATE TABLE public.bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  field_id UUID NOT NULL REFERENCES public.fields(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.field_amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for fields
CREATE POLICY "Fields are viewable by everyone" 
ON public.fields 
FOR SELECT 
USING (true);

CREATE POLICY "Owners can create their own fields" 
ON public.fields 
FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update their own fields" 
ON public.fields 
FOR UPDATE 
USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete their own fields" 
ON public.fields 
FOR DELETE 
USING (auth.uid() = owner_id);

-- Create policies for field_images
CREATE POLICY "Field images are viewable by everyone" 
ON public.field_images 
FOR SELECT 
USING (true);

CREATE POLICY "Field owners can manage images" 
ON public.field_images 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.fields 
    WHERE fields.id = field_images.field_id 
    AND fields.owner_id = auth.uid()
  )
);

-- Create policies for field_amenities
CREATE POLICY "Field amenities are viewable by everyone" 
ON public.field_amenities 
FOR SELECT 
USING (true);

CREATE POLICY "Field owners can manage amenities" 
ON public.field_amenities 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.fields 
    WHERE fields.id = field_amenities.field_id 
    AND fields.owner_id = auth.uid()
  )
);

-- Create policies for bookings
CREATE POLICY "Users can view their own bookings" 
ON public.bookings 
FOR SELECT 
USING (auth.uid() = customer_id);

CREATE POLICY "Field owners can view bookings for their fields" 
ON public.bookings 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.fields 
    WHERE fields.id = bookings.field_id 
    AND fields.owner_id = auth.uid()
  )
);

CREATE POLICY "Users can create bookings" 
ON public.bookings 
FOR INSERT 
WITH CHECK (auth.uid() = customer_id);

CREATE POLICY "Field owners can update booking status" 
ON public.bookings 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.fields 
    WHERE fields.id = bookings.field_id 
    AND fields.owner_id = auth.uid()
  )
);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_fields_updated_at
BEFORE UPDATE ON public.fields
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();