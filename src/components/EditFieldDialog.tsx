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
import { useLanguage } from '@/contexts/LanguageContext';

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
  const { t } = useLanguage();
  
  const editFieldSchema = z.object({
    name: z.string().min(1, t('field.nameRequired')).max(100, t('field.nameMaxLength')),
    location: z.string().min(1, t('field.locationRequired')).max(100, t('field.locationMaxLength')),
    address: z.string().max(200, t('field.addressMaxLength')).optional(),
    description: z.string().max(500, t('field.descriptionMaxLength')).optional(),
    price_per_booking: z.number().min(0.01, t('field.priceMin')).max(10000, t('field.priceMax')),
    operating_hours: z.string().max(50, t('field.operatingHoursMaxLength')).optional(),
  });

  type EditFieldFormData = z.infer<typeof editFieldSchema>;
  
  const form = useForm<EditFieldFormData>({
    resolver: zodResolver(editFieldSchema),
    defaultValues: {
      name: '',
      location: '',
      address: '',
      description: '',
      price_per_booking: 0,
      operating_hours: t('field.operatingHoursPlaceholder'),
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
        operating_hours: field.operating_hours || t('field.operatingHoursPlaceholder'),
      });
    }
  }, [field, form, t]);

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
          <DialogTitle>{t('field.edit')}</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('field.name')} *</FormLabel>
                    <FormControl>
                      <Input placeholder={t('field.placeholder')} {...field} className="text-right" />
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
                    <FormLabel>{t('field.location')} *</FormLabel>
                    <FormControl>
                      <Input placeholder={t('field.locationPlaceholder')} {...field} className="text-right" />
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
                  <FormLabel>{t('field.address')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('field.addressPlaceholder')} {...field} className="text-right" />
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
                  <FormLabel>{t('field.description')}</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder={t('field.descriptionPlaceholder')}
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
                    <FormLabel>{t('field.price')} *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder={t('field.pricePlaceholder')}
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
                    <FormLabel>{t('field.operatingHours')}</FormLabel>
                    <FormControl>
                      <Input placeholder={t('field.operatingHoursPlaceholder')} {...field} className="text-right" />
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
                {t('field.cancel')}
              </Button>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={updateField.isPending}
              >
                {updateField.isPending ? t('field.saving') : t('field.save')}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}