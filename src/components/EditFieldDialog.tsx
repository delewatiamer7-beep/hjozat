import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useUpdateField } from '@/hooks/useFieldMutations';

const editFieldSchema = z.object({
  name: z.string().min(1, 'اسم الملعب مطلوب').max(100, 'يجب أن يكون الاسم أقل من 100 حرف'),
  location: z.string().min(1, 'الموقع مطلوب').max(100, 'يجب أن يكون الموقع أقل من 100 حرف'),
  address: z.string().max(200, 'يجب أن يكون العنوان أقل من 200 حرف').optional(),
  description: z.string().max(500, 'يجب أن يكون الوصف أقل من 500 حرف').optional(),
  price_per_booking: z.number().min(0.01, 'يجب أن يكون السعر أكبر من 0').max(10000, 'يجب أن يكون السعر معقولاً'),
  operating_hours: z.string().max(50, 'يجب أن تكون ساعات العمل أقل من 50 حرف').optional(),
});

type EditFieldFormData = z.infer<typeof editFieldSchema>;

interface Field {
  id: string;
  name: string;
  location: string;
  address?: string;
  description?: string;
  price_per_booking: number;
  operating_hours?: string;
}

interface EditFieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  field: Field | null;
}

export function EditFieldDialog({ open, onOpenChange, field }: EditFieldDialogProps) {
  const updateField = useUpdateField();
  
  const form = useForm<EditFieldFormData>({
    resolver: zodResolver(editFieldSchema),
    defaultValues: {
      name: '',
      location: '',
      address: '',
      description: '',
      price_per_booking: 0,
      operating_hours: '6:00 صباحاً - 10:00 مساءً',
    },
  });

  // Reset form when field changes
  useEffect(() => {
    if (field) {
      form.reset({
        name: field.name,
        location: field.location,
        address: field.address || '',
        description: field.description || '',
        price_per_booking: Number(field.price_per_booking),
        operating_hours: field.operating_hours || '6:00 صباحاً - 10:00 مساءً',
      });
    }
  }, [field, form]);

  const onSubmit = async (data: EditFieldFormData) => {
    if (!field) return;
    
    await updateField.mutateAsync({
      id: field.id,
      name: data.name,
      location: data.location,
      price_per_booking: data.price_per_booking,
      address: data.address || undefined,
      description: data.description || undefined,
      operating_hours: data.operating_hours || undefined,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>تعديل الملعب</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم الملعب *</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: ملعب كرة القدم أ" {...field} className="text-right" />
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
                    <FormLabel>الموقع *</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: المركز الرياضي وسط المدينة" {...field} className="text-right" />
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
                  <FormLabel>العنوان</FormLabel>
                  <FormControl>
                    <Input placeholder="مثال: 123 شارع الرياضة، المدينة، المحافظة" {...field} className="text-right" />
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
                  <FormLabel>الوصف</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="صف ملعبك، المرافق، وأي ميزات خاصة..."
                      className="min-h-[100px] text-right"
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
                    <FormLabel>السعر لكل حجز ($) *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="50.00"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                        className="text-right"
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
                    <FormLabel>ساعات العمل</FormLabel>
                    <FormControl>
                      <Input placeholder="6:00 صباحاً - 10:00 مساءً" {...field} className="text-right" />
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
                disabled={updateField.isPending}
              >
                إلغاء
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={updateField.isPending}
              >
                {updateField.isPending ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}