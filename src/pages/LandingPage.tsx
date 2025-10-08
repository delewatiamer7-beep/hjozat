import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { RoleSelectionCard } from "@/components/RoleSelectionCard";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Home } from "lucide-react";
import heroImage from "@/assets/hero-football-field.jpg";

const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user, profile } = useAuth();

  const handleRoleSelection = (role: string) => {
    switch (role) {
      case "customer":
        navigate("/login?role=customer");
        break;
      case "owner":
        navigate(`/login?role=owner`);
        break;
    }
  };

  const handleReturnToDashboard = () => {
    if (profile?.role === 'owner') {
      navigate('/owner/dashboard');
    } else if (profile?.role === 'customer') {
      navigate('/customer');
    }
  };

  return <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      <nav className="absolute top-0 left-0 right-0 z-20 p-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {user && profile && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={handleReturnToDashboard}
                    className="w-10 h-10 rounded-full border border-white/30 bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white/50"
                    aria-label={profile.role === 'owner' ? t('landing.returnToOwnerDashboard') : t('landing.returnToBrowsePlaygrounds')}
                  >
                    <Home className="w-5 h-5 text-white" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{profile.role === 'owner' ? t('landing.returnToOwnerDashboard') : t('landing.returnToBrowsePlaygrounds')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          <div className={`flex items-center gap-3 ${!user ? "ml-auto" : ""}`}>
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
        backgroundImage: `url(${heroImage})`
      }}>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {t('landing.title')}
            <span className="block bg-hero-gradient bg-clip-text text-transparent">
              {t('landing.subtitle')}
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-2xl mx-auto leading-relaxed">
            {t('landing.description')}
          </p>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Role Selection Section */}
      <div className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {t('landing.chooseRole')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('landing.chooseRoleDesc')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <RoleSelectionCard role="customer" title={t('landing.customer')} description={t('landing.customerDesc')} onClick={() => handleRoleSelection("customer")} />
            
            <RoleSelectionCard role="owner" title={t('landing.owner')} description={t('landing.ownerDesc')} onClick={() => handleRoleSelection("owner")} />
          </div>
        </div>
      </div>
    </div>;
};
export default LandingPage;