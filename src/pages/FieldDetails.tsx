import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Clock, Star, Users, Wifi, Car, Bath, Coffee } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useField } from "@/hooks/useFields";

// Amenity icons mapping
const amenityIcons = {
  "WiFi": Wifi,
  "Parking": Car,
  "Changing Rooms": Bath,
  "Refreshments": Coffee,
  "Floodlights": Clock,
  "Equipment": Users,
};

const FieldDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { data: field, isLoading, error } = useField(id || "");

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-white border-b shadow-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/customer")}
                className="text-primary hover:text-primary-glow"
              >
                → العودة للتصفح
              </Button>
            </div>
          </div>
        </header>
        
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Skeleton className="h-96 w-full rounded-2xl" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-96 w-full rounded-lg" />
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
          <h2 className="text-2xl font-bold mb-4">الملعب غير موجود</h2>
          <Button onClick={() => navigate("/customer")}>العودة للتصفح</Button>
        </div>
      </div>
    );
  }

  const handleBookNow = () => {
    navigate(`/book/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/customer")}
              className="text-primary hover:text-primary-glow"
            >
              → العودة للتصفح
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden">
                <img 
                  src={field.images?.find(img => img.is_primary)?.image_url || field.images?.[0]?.image_url || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=800&fit=crop&crop=center"} 
                  alt={field.name}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <span className="text-sm font-medium">1 / {field.images?.length || 1}</span>
                </div>
              </div>
              
              {field.images && field.images.length > 1 && (
                <div className="grid grid-cols-2 gap-4">
                  {field.images.filter((_, index) => index > 0).map((image, index) => (
                    <img 
                      key={image.id}
                      src={image.image_url} 
                      alt={`${field.name} منظر ${index + 2}`}
                      className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Field Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-4xl font-bold text-foreground">{field.name}</h1>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{field.rating}</span>
                    <span className="text-muted-foreground">(0 تقييمات)</span>
                  </div>
                </div>
                
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="w-5 h-5 ml-2" />
                  {field.address || field.location}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">ملعب كرة قدم</Badge>
                  <Badge variant="secondary">درجة احترافية</Badge>
                  <Badge variant="secondary">
                    <Users className="w-3 h-3 ml-1" />
                    حتى 22 لاعب
                  </Badge>
                </div>
              </div>

              {field.description && (
                <div>
                  <h3 className="text-xl font-semibold mb-3">الوصف</h3>
                  <p className="text-muted-foreground leading-relaxed">{field.description}</p>
                </div>
              )}

              {field.amenities && field.amenities.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">المرافق</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {field.amenities.map((amenity) => {
                      const IconComponent = amenityIcons[amenity.amenity as keyof typeof amenityIcons] || Users;
                      return (
                        <div key={amenity.id} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                          <IconComponent className="w-5 h-5 text-primary" />
                          <span className="text-sm font-medium">{amenity.amenity}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 p-6">
              <div className="space-y-6">
                <div className="text-center border-b pb-4">
                  <div className="text-3xl font-bold text-primary mb-2">
                    ${field.price_per_booking}
                    <span className="text-lg font-normal text-muted-foreground">/حجز</span>
                  </div>
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 ml-1" />
                    {field.operating_hours}
                  </div>
                </div>

                <Button 
                  onClick={handleBookNow}
                  size="lg"
                  className="w-full bg-primary hover:bg-primary-glow text-primary-foreground font-semibold text-lg py-6"
                >
                  احجز الآن
                </Button>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الحد الأدنى للحجز:</span>
                    <span className="font-medium">ساعة واحدة</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الإلغاء:</span>
                    <span className="font-medium">24 ساعة قبل</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">الدفع:</span>
                    <span className="font-medium">عند الوصول</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => toast({ title: "قريباً!", description: "ميزة التواصل ستكون متاحة قريباً." })}
                  >
                    تواصل مع المالك
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldDetails;