import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface CreateFieldData {
  name: string;
  location: string;
  address?: string;
  description?: string;
  price_per_booking: number;
  operating_hours?: string;
}

interface UpdateFieldData {
  id: string;
  name?: string;
  location?: string;
  address?: string;
  description?: string;
  price_per_booking?: number;
  operating_hours?: string;
  status?: string;
}

export const useCreateField = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fieldData: CreateFieldData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('fields')
        .insert({
          ...fieldData,
          owner_id: user.id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-fields'] });
      queryClient.invalidateQueries({ queryKey: ['fields'] });
      toast({
        title: "Success",
        description: "Field created successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create field: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateField = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: UpdateFieldData) => {
      const { data, error } = await supabase
        .from('fields')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-fields'] });
      queryClient.invalidateQueries({ queryKey: ['fields'] });
      queryClient.invalidateQueries({ queryKey: ['field'] });
      toast({
        title: "Success",
        description: "Field updated successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to update field: " + error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteField = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fieldId: string) => {
      const { error } = await supabase
        .from('fields')
        .delete()
        .eq('id', fieldId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner-fields'] });
      queryClient.invalidateQueries({ queryKey: ['fields'] });
      toast({
        title: "Success",
        description: "Field deleted successfully",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to delete field: " + error.message,
        variant: "destructive",
      });
    },
  });
};