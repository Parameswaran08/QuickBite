-- Create restaurants table
CREATE TABLE public.restaurants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  cuisine TEXT NOT NULL,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0.0,
  delivery_time TEXT NOT NULL,
  image_url TEXT,
  address TEXT NOT NULL,
  cost_for_two INTEGER NOT NULL,
  is_veg BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

-- Anyone can view restaurants (public data)
CREATE POLICY "Anyone can view active restaurants" 
ON public.restaurants 
FOR SELECT 
USING (is_active = true);

-- Create index for faster searches
CREATE INDEX idx_restaurants_cuisine ON public.restaurants(cuisine);
CREATE INDEX idx_restaurants_rating ON public.restaurants(rating);
CREATE INDEX idx_restaurants_name ON public.restaurants(name);

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for automatic timestamp updates
CREATE TRIGGER update_restaurants_updated_at
BEFORE UPDATE ON public.restaurants
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample data
INSERT INTO public.restaurants (name, cuisine, rating, delivery_time, image_url, address, cost_for_two, is_veg) VALUES
('Pizza Paradise', 'Italian', 4.5, '25-30 mins', 'https://images.unsplash.com/photo-1513104890138-7c749659a591', '123 Main Street, Downtown', 800, false),
('Spice Garden', 'Indian', 4.2, '30-35 mins', 'https://images.unsplash.com/photo-1585937421612-70a008356fbe', '456 Food Plaza, Sector 17', 600, true),
('Burger House', 'American', 4.0, '20-25 mins', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd', '789 Fast Lane, City Center', 500, false),
('Sushi Master', 'Japanese', 4.7, '35-40 mins', 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351', '321 Ocean View, Beach Road', 1200, false),
('Taco Fiesta', 'Mexican', 4.3, '25-30 mins', 'https://images.unsplash.com/photo-1565299507177-b0ac66763828', '654 Sunset Blvd, West Side', 700, false),
('Green Bowl', 'Healthy', 4.6, '20-25 mins', 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd', '987 Health Street, Park View', 900, true),
('Noodle Bar', 'Chinese', 4.1, '30-35 mins', 'https://images.unsplash.com/photo-1617093727343-374698b1b08d', '147 Dragon Road, Chinatown', 650, false),
('Mediterranean Delight', 'Mediterranean', 4.4, '35-40 mins', 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783', '258 Olive Avenue, Harbor District', 1000, true);