import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { MapPin, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import { useField } from "@/hooks/useFields";
import { useCreateBooking, useFieldBookings } from "@/hooks/useBookings";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { BookingCalendar } from "@/components/BookingCalendar";

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  
  const { data: field, isLoading, error } = useField(id || "");
  const { data: bookedSlots = [], isLoading: bookingsLoading } = useFieldBookings(id || "");
  const createBooking = useCreateBooking();

  const bookingSchema = z.object({
    customerName: z.string().trim().min(1, t('booking.customerNameRequired')).max(100, t('booking.customerNameMaxLength')),
    phone: z.string().trim().min(10, t('booking.phoneMinLength')).max(20, t('booking.phoneMaxLength')),
  });

  type BookingFormData = z.infer<typeof bookingSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema)
  });

  const onSubmit = async (data: BookingFormData) => {
    if (!field || !user || !selectedDate || !selectedTime) {
      toast({
        title: t('toast.validationError'),
        description: t('booking.dateRequired'),
        variant: "destructive"
      });
      return;
    }
    
    try {
      const endTime = new Date(`1970-01-01T${selectedTime}:00`);
      endTime.setHours(endTime.getHours() + 1); // 1-hour booking
      
      await createBooking.mutateAsync({
        field_id: field.id,
        customer_id: user.id,
        customer_name: data.customerName,
        customer_phone: data.phone,
        booking_date: format(selectedDate, 'yyyy-MM-dd'),
        start_time: selectedTime,
        end_time: endTime.toTimeString().slice(0, 5),
        total_amount: field.price_per_booking,
        status: 'pending',
      });
      
      toast({
        title: t('booking.sent'),
        description: t('booking.successDesc'),
      });
      
      navigate("/customer");
    } catch (error) {
      toast({
        title: t('booking.failed'),
        description: t('booking.failedDesc'),
        variant: "destructive"
      });
    }
  };

  const handleSlotSelect = (date: Date, time: string) => {
    setSelectedDate(date);
    setSelectedTime(time);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/customer")}
                className="text-primary hover:text-primary-glow"
              >
                → {t('field.backToBrowse')}
              </Button>
              <h1 className="text-xl font-bold text-primary">{t('booking.title')}</h1>
            </div>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Card className="sticky top-24 p-6">
                <Skeleton className="h-40 w-full rounded-lg mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </Card>
            </div>
            <div className="lg:col-span-3 space-y-6">
              <Skeleton className="h-[500px] w-full rounded-lg" />
              <Skeleton className="h-[200px] w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !field) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t('field.notFound')}</h2>
          <Button onClick={() => navigate("/customer")}>{t('field.backToBrowse')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/field/${id}`)}
              className="text-primary hover:text-primary-glow"
            >
              → {t('booking.backToDetails')}
            </Button>
            <h1 className="text-xl font-bold text-primary">{t('booking.title')}</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Field Summary - Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <div className="p-6">
                <img 
                  src={field.images?.find(img => img.is_primary)?.image_url || field.images?.[0]?.image_url || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop&crop=center"} 
                  alt={field.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                
                <h3 className="text-xl font-bold mb-2">{field.name}</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 ml-2" />
                    {field.location}
                  </div>
                  
                  <div className="flex items-center">
                    <Star className="w-4 h-4 ml-2 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{field.rating}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="text-2xl font-bold text-primary">
                    ${field.price_per_booking}
                    <span className="text-sm font-normal text-muted-foreground">/{t('booking.perBooking')}</span>
                  </div>
                </div>

                {selectedDate && selectedTime && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold mb-2">{t('booking.summary')}</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>{t('booking.date')}:</span>
                        <span>{format(selectedDate, "PPP")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>{t('booking.time')}:</span>
                        <span>{selectedTime}</span>
                      </div>
                      <div className="flex justify-between font-semibold pt-2 border-t">
                        <span>{t('booking.total')}:</span>
                        <span>${field.price_per_booking}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Calendar */}
            {bookingsLoading ? (
              <Skeleton className="h-[500px] w-full rounded-lg" />
            ) : (
              <BookingCalendar
                fieldId={id || ""}
                bookedSlots={bookedSlots}
                onSlotSelect={handleSlotSelect}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
              />
            )}

            {/* Booking Form */}
            <Card className="p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">{t('booking.complete')}</h2>
                <p className="text-muted-foreground">{t('booking.fillDetails')}</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Customer Information */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">{t('booking.fullName')} *</Label>
                    <Input
                      id="customerName"
                      {...register("customerName")}
                      className={cn(errors.customerName && "border-destructive", "text-right")}
                      placeholder={t('booking.fullNamePlaceholder')}
                    />
                    {errors.customerName && (
                      <p className="text-sm text-destructive mt-1">{errors.customerName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">{t('booking.phone')} *</Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      className={cn(errors.phone && "border-destructive", "text-right")}
                      placeholder={t('booking.phonePlaceholder')}
                      type="tel"
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t">
                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={createBooking.isPending || !selectedDate || !selectedTime}
                    className="w-full bg-primary hover:bg-primary-glow text-primary-foreground font-semibold"
                  >
                    {createBooking.isPending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white ml-2" />
                        {t('booking.sending')}
                      </>
                    ) : (
                      t('booking.confirm')
                    )}
                  </Button>
                  
                  {(!selectedDate || !selectedTime) && (
                    <p className="text-sm text-muted-foreground text-center mt-2">
                      {t('booking.selectDateTime')}
                    </p>
                  )}
                  
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    {t('booking.pendingNote')}
                  </p>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;