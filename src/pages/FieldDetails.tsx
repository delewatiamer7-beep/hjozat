import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star, Users, Wifi, Car, Bath, Coffee } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock data - in real app this would come from Supabase
const mockFieldDetails = {
  "1": {
    id: "1",
    name: "Premier Stadium Field",
    location: "Downtown Sports Complex, New York",
    fullAddress: "123 Sports Ave, Downtown, New York, NY 10001",
    pricePerHour: 120,
    images: [
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=1200&h=800&fit=crop&crop=center",
      "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=1200&h=800&fit=crop&crop=center"
    ],
    rating: 4.9,
    reviews: 127,
    description: "A premium football field with professional-grade artificial turf, floodlights, and modern amenities. Perfect for competitive matches, training sessions, and tournaments. The field meets FIFA standards and offers excellent playing conditions year-round.",
    amenities: [
      { name: "WiFi", icon: Wifi },
      { name: "Parking", icon: Car },
      { name: "Changing Rooms", icon: Bath },
      { name: "Refreshments", icon: Coffee }
    ],
    capacity: 22,
    openHours: "6:00 AM - 11:00 PM",
    fieldType: "11v11 Full Size",
    surface: "Artificial Turf"
  }
};

const FieldDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const field = mockFieldDetails[id as keyof typeof mockFieldDetails];

  if (!field) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Field not found</h2>
          <Button onClick={() => navigate("/customer")}>Back to Browse</Button>
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
              ← Back to Browse
            </Button>
            <h1 className="text-xl font-bold text-primary">FieldBook</h1>
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
                  src={field.images[0]} 
                  alt={field.name}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <span className="text-sm font-medium">1 / {field.images.length}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                {field.images.slice(1).map((image, index) => (
                  <img 
                    key={index}
                    src={image} 
                    alt={`${field.name} view ${index + 2}`}
                    className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
            </div>

            {/* Field Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <h1 className="text-4xl font-bold text-foreground">{field.name}</h1>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{field.rating}</span>
                    <span className="text-muted-foreground">({field.reviews} reviews)</span>
                  </div>
                </div>
                
                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  {field.fullAddress}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">{field.fieldType}</Badge>
                  <Badge variant="secondary">{field.surface}</Badge>
                  <Badge variant="secondary">
                    <Users className="w-3 h-3 mr-1" />
                    Up to {field.capacity} players
                  </Badge>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{field.description}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {field.amenities.map((amenity) => (
                    <div key={amenity.name} className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                      <amenity.icon className="w-5 h-5 text-primary" />
                      <span className="text-sm font-medium">{amenity.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24 p-6">
              <div className="space-y-6">
                <div className="text-center border-b pb-4">
                  <div className="text-3xl font-bold text-primary mb-2">
                    ${field.pricePerHour}
                    <span className="text-lg font-normal text-muted-foreground">/hour</span>
                  </div>
                  <div className="flex items-center justify-center text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 mr-1" />
                    {field.openHours}
                  </div>
                </div>

                <Button 
                  onClick={handleBookNow}
                  size="lg"
                  className="w-full bg-primary hover:bg-primary-glow text-primary-foreground font-semibold text-lg py-6"
                >
                  Book Now
                </Button>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Minimum booking:</span>
                    <span className="font-medium">1 hour</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cancellation:</span>
                    <span className="font-medium">24h before</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Payment:</span>
                    <span className="font-medium">On arrival</span>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => toast({ title: "Feature coming soon!", description: "Contact feature will be available soon." })}
                  >
                    Contact Owner
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