import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { FieldCard } from "@/components/FieldCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, MapPin, Filter } from "lucide-react";
import { useFields } from "@/hooks/useFields";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";

const CustomerHome = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { signOut } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [isSwitchingRole, setIsSwitchingRole] = useState(false);
  
  const { data: fields = [], isLoading, error } = useFields();

  const filteredFields = fields.filter(field => {
    const matchesSearch = field.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter ? field.location.toLowerCase().includes(locationFilter.toLowerCase()) : true;
    return matchesSearch && matchesLocation;
  });

  const handleViewDetails = (fieldId: string) => {
    navigate(`/field/${fieldId}`);
  };

  const handleSwitchRole = async () => {
    setIsSwitchingRole(true);
    try {
      await signOut();
      toast({
        title: t('nav.switchRoleSuccess'),
        description: t('nav.switchRoleSuccessDesc'),
      });
      navigate('/');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to logout',
        variant: "destructive",
      });
      setIsSwitchingRole(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 space-x-reverse">
              <nav className="hidden md:flex space-x-6 space-x-reverse">
                <a href="#" className="text-foreground hover:text-primary transition-colors">{t('nav.browseFields')}</a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">{t('nav.myBookings')}</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="bg-hero-gradient text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('customer.findField')}
          </h2>
          <p className="text-xl mb-8 text-white/90">
            {t('customer.discoverFields')}
          </p>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                <Input
                  placeholder={t('customer.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pr-10 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30 text-right"
                />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
                <Input
                  placeholder={t('customer.locationPlaceholder')}
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                  className="pr-10 bg-white/20 border-white/30 text-white placeholder:text-white/70 focus:bg-white/30 text-right"
                />
              </div>
              <Button className="bg-white text-primary hover:bg-white/90 font-semibold">
                <Filter className="w-4 h-4 ml-2" />
                {t('customer.filter')}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Fields Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-foreground">
              {t('customer.availableFields')} ({filteredFields.length})
            </h3>
            <div className="flex items-center space-x-4 space-x-reverse">
              <select className="border rounded-lg px-4 py-2 bg-background">
                <option>{t('customer.sortByPrice')}</option>
                <option>{t('customer.sortByRating')}</option>
                <option>{t('customer.sortByDistance')}</option>
              </select>
            </div>
          </div>
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="h-48 w-full rounded-lg" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">{t('customer.loadingFailed')}</p>
              <Button onClick={() => window.location.reload()} variant="outline">
                {t('customer.retry')}
              </Button>
            </div>
          ) : filteredFields.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredFields.map((field) => (
                <FieldCard
                  key={field.id}
                  id={field.id}
                  name={field.name}
                  location={field.location}
                  pricePerBooking={field.price_per_booking}
                  image={field.images?.find(img => img.is_primary)?.image_url || field.images?.[0]?.image_url || "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop&crop=center"}
                  rating={field.rating}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">
                {fields.length === 0 ? t('customer.noFields') : t('customer.noMatchingFields')}
              </p>
              <Button 
                onClick={() => {
                  setSearchTerm("");
                  setLocationFilter("");
                }}
                variant="outline"
              >
                {t('customer.clearFilter')}
              </Button>
            </div>
          )}
        </div>

        {/* Role Switch Button */}
        <div className="flex justify-center mt-12 mb-8">
          <Button 
            onClick={handleSwitchRole}
            disabled={isSwitchingRole}
            variant="outline"
            size="sm"
            className="border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105 animate-fade-in"
          >
            {isSwitchingRole ? t('nav.switchingRole') : t('nav.switchRole')}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default CustomerHome;