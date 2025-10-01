import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Star } from "lucide-react";

interface FieldCardProps {
  id: string;
  name: string;
  location: string;
  pricePerBooking: number;
  image: string;
  rating?: number;
  onViewDetails: (id: string) => void;
}

export const FieldCard = ({ 
  id, 
  name, 
  location, 
  pricePerBooking, 
  image, 
  rating = 4.8,
  onViewDetails 
}: FieldCardProps) => {
  return (
    <Card className="group overflow-hidden bg-card hover:shadow-card transition-all duration-300 hover:animate-field-hover cursor-pointer">
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
          ${pricePerBooking}/حجز
        </div>
        {rating && (
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm text-foreground px-2 py-1 rounded-full text-sm font-medium flex items-center gap-1">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            {rating}
          </div>
        )}
      </div>
      
      <div className="p-6 space-y-4">
        <div>
          <h3 className="text-xl font-bold text-card-foreground mb-2">{name}</h3>
          <div className="flex items-center text-muted-foreground text-sm">
            <MapPin className="w-4 h-4 ml-1" />
            {location}
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 ml-1" />
            متاح 6 صباحاً - 11 مساءً
          </div>
        </div>
        
        <Button 
          onClick={() => onViewDetails(id)}
          className="w-full bg-primary hover:bg-primary-glow text-primary-foreground font-semibold transition-all duration-300"
        >
          عرض التفاصيل
        </Button>
      </div>
    </Card>
  );
};