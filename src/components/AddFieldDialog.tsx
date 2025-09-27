import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useCreateField } from '@/hooks/useFieldMutations';

const addFieldSchema = z.object({
  name: z.string().min(1, 'Field name is required').max(100, 'Name must be less than 100 characters'),
  location: z.string().min(1, 'Location is required').max(100, 'Location must be less than 100 characters'),
  address: z.string().max(200, 'Address must be less than 200 characters').optional(),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  price_per_booking: z.number().min(0.01, 'Price must be greater than 0').max(10000, 'Price must be reasonable'),
  operating_hours: z.string().max(50, 'Operating hours must be less than 50 characters').optional(),
});

type AddFieldFormData = z.infer<typeof addFieldSchema>;

interface AddFieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddFieldDialog({ open, onOpenChange }: AddFieldDialogProps) {
  const createField = useCreateField();
  
  const form = useForm<AddFieldFormData>({
    resolver: zodResolver(addFieldSchema),
    defaultValues: {
      name: '',
      location: '',
      address: '',
      description: '',
      price_per_booking: 0,
      operating_hours: '6:00 AM - 10:00 PM',
    },
  });

  const onSubmit = async (data: AddFieldFormData) => {
    await createField.mutateAsync({
      name: data.name,
      location: data.location,
      price_per_booking: data.price_per_booking,
      address: data.address || undefined,
      description: data.description || undefined,
      operating_hours: data.operating_hours || undefined,
    });
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Field</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Soccer Field A" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location *</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Downtown Sports Center" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 123 Sports Lane, City, State" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe your field, facilities, and any special features..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price_per_booking"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price per Booking ($) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="50.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="operating_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Operating Hours</FormLabel>
                    <FormControl>
                      <Input placeholder="6:00 AM - 10:00 PM" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={createField.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={createField.isPending}
              >
                {createField.isPending ? "Creating..." : "Create Field"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}