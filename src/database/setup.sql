-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ENUM types
CREATE TYPE user_role AS ENUM('user', 'admin', 'super_admin');
CREATE TYPE booking_status AS ENUM('pending', 'confirmed', 'in_progress', 'completed', 'cancelled');
CREATE TYPE payment_status AS ENUM('pending', 'paid', 'failed', 'refunded');
CREATE TYPE vehicle_size AS ENUM('small', 'medium', 'large');
CREATE TYPE tow_truck_type AS ENUM('flatbed', 'wheel_lift', 'integrated', 'heavy_duty');

-- Create tables
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  encrypted_password TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._+%-]+@[A-Za-z0-9.-]+[.][A-Za-z]+$')
);

COMMENT ON TABLE public.users IS 'Stores user account information';
COMMENT ON COLUMN public.users.email IS 'User''s email address, used for login';
COMMENT ON COLUMN public.users.role IS 'User''s role in the system';

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT unique_user_profile UNIQUE(user_id),
  CONSTRAINT phone_number_format CHECK (phone_number ~ '^\+?[1-9]\d{1,14}$')
);

COMMENT ON TABLE public.profiles IS 'Stores additional user profile information';
COMMENT ON COLUMN public.profiles.user_id IS 'Reference to the user account';
COMMENT ON COLUMN public.profiles.phone_number IS 'User''s contact phone number';

CREATE TABLE IF NOT EXISTS public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
  price_per_km NUMERIC(10, 2) NOT NULL CHECK (price_per_km >= 0),
  maneuver_charge NUMERIC(10, 2) NOT NULL CHECK (maneuver_charge >= 0),
  tow_truck_type tow_truck_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.services IS 'Stores information about available towing services';
COMMENT ON COLUMN public.services.base_price IS 'Base price for the service';
COMMENT ON COLUMN public.services.price_per_km IS 'Additional charge per kilometer';
COMMENT ON COLUMN public.services.maneuver_charge IS 'Extra charge for difficult maneuvers';

CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE RESTRICT,
  status booking_status NOT NULL DEFAULT 'pending',
  payment_status payment_status NOT NULL DEFAULT 'pending',
  pickup_location TEXT NOT NULL,
  dropoff_location TEXT NOT NULL,
  vehicle_details JSONB NOT NULL,
  distance NUMERIC(10, 2) NOT NULL CHECK (distance > 0),
  total_cost NUMERIC(10, 2) NOT NULL CHECK (total_cost > 0),
  pickup_datetime TIMESTAMPTZ NOT NULL,
  additional_details TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE public.bookings IS 'Stores information about tow truck service bookings';
COMMENT ON COLUMN public.bookings.user_id IS 'Reference to the user who made the booking';
COMMENT ON COLUMN public.bookings.service_id IS 'Reference to the service requested';
COMMENT ON COLUMN public.bookings.vehicle_details IS 'JSON object containing vehicle information';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_service_id ON public.bookings(service_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_pickup_datetime ON public.bookings(pickup_datetime);

-- Triggers for updating 'updated_at' columns
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_users_timestamp
BEFORE UPDATE ON public.users
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_profiles_timestamp
BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_services_timestamp
BEFORE UPDATE ON public.services
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_bookings_timestamp
BEFORE UPDATE ON public.bookings
FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Sample data insertions (optional, can be removed for production)
INSERT INTO public.users (email, encrypted_password, role) VALUES
('admin@example.com', crypt('admin_password', gen_salt('bf')), 'admin'),
('user@example.com', crypt('user_password', gen_salt('bf')), 'user');

INSERT INTO public.services (name, description, base_price, price_per_km, maneuver_charge, tow_truck_type)
VALUES
('Standard Towing', 'For small to medium vehicles', 50.00, 2.00, 25.00, 'wheel_lift'),
('Flatbed Towing', 'For luxury or damaged vehicles', 75.00, 2.50, 35.00, 'flatbed'),
('Heavy Duty Towing', 'For large vehicles and trucks', 100.00, 3.00, 50.00, 'heavy_duty');

-- Sample booking
INSERT INTO public.bookings (user_id, service_id, status, payment_status, pickup_location, dropoff_location, vehicle_details, distance, total_cost, pickup_datetime)
VALUES (
  (SELECT id FROM public.users WHERE email = 'user@example.com'),
  (SELECT id FROM public.services WHERE name = 'Standard Towing'),
  'pending', 'pending', '123 Main St', '456 Elm St', 
  '{"brand": "Toyota", "model": "Corolla", "year": 2020, "color": "Silver", "license_plate": "ABC123", "size": "medium"}'::jsonb,
  15.5, 81.00, NOW() + INTERVAL '2 hours'
);