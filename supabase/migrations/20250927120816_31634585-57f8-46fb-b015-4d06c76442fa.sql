-- Rename price_per_hour column to price_per_booking in fields table
ALTER TABLE public.fields 
RENAME COLUMN price_per_hour TO price_per_booking;