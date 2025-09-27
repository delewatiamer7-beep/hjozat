import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Field {
  id: string;
  name: string;
  location: string;
  address?: string;
  description?: string;
  price_per_booking: number;
  rating: number;
  status: string;
  operating_hours: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  images?: { id: string; image_url: string; is_primary: boolean }[];
  amenities?: { id: string; amenity: string }[];
}

export const useFields = () => {
  return useQuery({
    queryKey: ['fields'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fields')
        .select(`
          *,
          field_images(id, image_url, is_primary),
          field_amenities(id, amenity)
        `)
        .eq('status', 'active');

      if (error) throw error;
      return data as Field[];
    },
  });
};

export const useField = (id: string) => {
  return useQuery({
    queryKey: ['field', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fields')
        .select(`
          *,
          field_images(id, image_url, is_primary),
          field_amenities(id, amenity)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Field;
    },
    enabled: !!id,
  });
};

export const useOwnerFields = (ownerId: string) => {
  return useQuery({
    queryKey: ['owner-fields', ownerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('fields')
        .select(`
          *,
          field_images(id, image_url, is_primary),
          field_amenities(id, amenity)
        `)
        .eq('owner_id', ownerId);

      if (error) throw error;
      return data as Field[];
    },
    enabled: !!ownerId,
  });
};