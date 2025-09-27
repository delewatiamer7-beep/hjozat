import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, MapPin, Clock, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

const bookingSchema = z.object({
  customerName: z.string().trim().min(1, "Customer name is required").max(100, "Name must be less than 100 characters"),
  phone: z.string().trim().min(10, "Valid phone number is required").max(20, "Phone number must be less than 20 characters"),
  date: z.date({ required_error: "Please select a date" }),
  time: z.string().min(1, "Please select a time"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

// Mock field data
const mockField = {
  id: "1",
  name: "Premier Stadium Field",
  location: "Downtown Sports Complex, New York",
  pricePerHour: 120,
  image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=600&h=400&fit=crop&crop=center",
  rating: 4.9
};

// Available time slots
const timeSlots = [
  "06:00", "07:00", "08:00", "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00", "15:00", "16:00", "17:00",
  "18:00", "19:00", "20:00", "21:00", "22:00"
];

const BookingPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema)
  });

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);
    
    try {
      // Simulate API call - in real app this would go to Supabase
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Booking Submitted!",
        description: "Your booking request has been sent to the field owner. You'll receive a confirmation soon.",
      });
      
      navigate("/customer");
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "There was an error submitting your booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      setValue("date", date);
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setValue("time", time);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate(`/field/${id}`)}
              className="text-primary hover:text-primary-glow"
            >
              ← Back to Field Details
            </Button>
            <h1 className="text-xl font-bold text-primary">Book Your Field</h1>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Field Summary */}
          <div className="md:col-span-1">
            <Card className="sticky top-24">
              <div className="p-6">
                <img 
                  src={mockField.image} 
                  alt={mockField.name}
                  className="w-full h-40 object-cover rounded-lg mb-4"
                />
                
                <h3 className="text-xl font-bold mb-2">{mockField.name}</h3>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="w-4 h-4 mr-2" />
                    {mockField.location}
                  </div>
                  
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-2 fill-yellow-400 text-yellow-400" />
                    <span className="font-medium">{mockField.rating}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <div className="text-2xl font-bold text-primary">
                    ${mockField.pricePerHour}
                    <span className="text-sm font-normal text-muted-foreground">/hour</span>
                  </div>
                </div>

                {selectedDate && selectedTime && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold mb-2">Booking Summary</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Date:</span>
                        <span>{format(selectedDate, "PPP")}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Time:</span>
                        <span>{selectedTime}</span>
                      </div>
                      <div className="flex justify-between font-semibold pt-2 border-t">
                        <span>Total:</span>
                        <span>${mockField.pricePerHour}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Booking Form */}
          <div className="md:col-span-2">
            <Card className="p-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold mb-2">Complete Your Booking</h2>
                <p className="text-muted-foreground">Fill in your details to reserve this field</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Contact Information</h3>
                  
                  <div>
                    <Label htmlFor="customerName">Full Name *</Label>
                    <Input
                      id="customerName"
                      {...register("customerName")}
                      className={cn(errors.customerName && "border-destructive")}
                      placeholder="Enter your full name"
                    />
                    {errors.customerName && (
                      <p className="text-sm text-destructive mt-1">{errors.customerName.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      className={cn(errors.phone && "border-destructive")}
                      placeholder="Enter your phone number"
                      type="tel"
                    />
                    {errors.phone && (
                      <p className="text-sm text-destructive mt-1">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                {/* Date & Time Selection */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Select Date & Time</h3>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Date Picker */}
                    <div>
                      <Label>Date *</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !selectedDate && "text-muted-foreground",
                              errors.date && "border-destructive"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            disabled={(date) => date < new Date()}
                            className={cn("p-3 pointer-events-auto")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.date && (
                        <p className="text-sm text-destructive mt-1">{errors.date.message}</p>
                      )}
                    </div>

                    {/* Time Selection */}
                    <div>
                      <Label>Time *</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2 max-h-40 overflow-y-auto border rounded-lg p-2">
                        {timeSlots.map((time) => (
                          <Button
                            key={time}
                            type="button"
                            variant={selectedTime === time ? "default" : "outline"}
                            size="sm"
                            onClick={() => handleTimeSelect(time)}
                            className={cn(
                              "text-xs",
                              selectedTime === time && "bg-primary text-primary-foreground"
                            )}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                      {errors.time && (
                        <p className="text-sm text-destructive mt-1">{errors.time.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t">
                  <Button 
                    type="submit" 
                    size="lg"
                    disabled={isSubmitting}
                    className="w-full bg-primary hover:bg-primary-glow text-primary-foreground font-semibold"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Submitting Booking...
                      </>
                    ) : (
                      "Confirm Booking"
                    )}
                  </Button>
                  
                  <p className="text-sm text-muted-foreground text-center mt-4">
                    Your booking will be pending until confirmed by the field owner
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