import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Booking {
  id: string;
  field_id: string;
  customer_id: string;
  customer_name: string;
  customer_phone: string;
  booking_date: string;
  start_time: string;
  end_time: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  fields?: {
    name: string;
  };
}

export const useOwnerBookings = (ownerId: string) => {
  return useQuery({
    queryKey: ['owner-bookings', ownerId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          fields!inner(name, owner_id)
        `)
        .eq('fields.owner_id', ownerId);

      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!ownerId,
  });
};

export const useUserBookings = (userId: string) => {
  return useQuery({
    queryKey: ['user-bookings', userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          fields(name, location)
        `)
        .eq('customer_id', userId);

      if (error) throw error;
      return data as Booking[];
    },
    enabled: !!userId,
  });
};

export const useFieldBookings = (fieldId: string) => {
  return useQuery({
    queryKey: ['field-bookings', fieldId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('bookings')
        .select('booking_date, start_time, status')
        .eq('field_id', fieldId)
        .in('status', ['pending', 'confirmed']);

      if (error) throw error;
      return data.map(booking => ({
        date: booking.booking_date,
        start_time: booking.start_time,
        status: booking.status || 'pending'
      }));
    },
    enabled: !!fieldId,
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (booking: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('bookings')
        .insert([booking])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['owner-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['field-bookings'] });
    },
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ bookingId, status }: { bookingId: string; status: string }) => {
      const { data, error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['owner-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['user-bookings'] });
      queryClient.invalidateQueries({ queryKey: ['field-bookings'] });
    },
  });
};