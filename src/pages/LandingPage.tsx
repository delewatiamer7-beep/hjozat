import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { RoleSelectionCard } from "@/components/RoleSelectionCard";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-football-field.jpg";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const handleRoleSelection = (role: string) => {
    switch (role) {
      case "customer":
        navigate("/customer");
        break;
      case "owner":
        navigate(`/auth?role=owner&tab=login`);
        break;
      case "admin":
        navigate(`/auth?role=admin&tab=login`);
        break;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Bar */}
      {user && (
        <nav className="absolute top-0 left-0 right-0 z-20 p-6">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="text-white">
              <span className="font-semibold">Welcome, {profile?.name}</span>
              <span className="ml-2 text-sm opacity-75">({profile?.role})</span>
            </div>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                onClick={() => {
                  switch (profile?.role) {
                    case 'customer':
                      navigate('/customer');
                      break;
                    case 'owner':
                      navigate('/owner/dashboard');
                      break;
                    case 'admin':
                      navigate('/admin/dashboard');
                      break;
                  }
                }}
                className="text-white hover:text-primary-glow"
              >
                Go to Dashboard
              </Button>
              <Button
                variant="ghost"
                onClick={signOut}
                className="text-white hover:text-primary-glow"
              >
                Sign Out
              </Button>
            </div>
          </div>
        </nav>
      )}

      {/* Hero Section */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Book Your Perfect
            <span className="block bg-hero-gradient bg-clip-text text-transparent">
              Football Field
            </span>
          </h1>
          <p className="text-xl md:text-2xl mb-12 text-white/90 max-w-2xl mx-auto leading-relaxed">
            Connect with premium football fields in your area. Easy booking, professional facilities, unforgettable matches.
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
              Choose Your Role
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Select how you'd like to use our platform and get started with your football field booking experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <RoleSelectionCard
              role="customer"
              title="Customer"
              description="Browse and book football fields in your area. Find the perfect venue for your next match or training session."
              onClick={() => handleRoleSelection("customer")}
            />
            
            <RoleSelectionCard
              role="owner"
              title="Field Owner"
              description="List your football facilities and manage bookings. Grow your business with our professional platform."
              onClick={() => handleRoleSelection("owner")}
            />
          </div>
          
          <div className="text-center mt-12 space-y-4">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button 
                onClick={() => navigate("/auth")}
                className="text-primary hover:text-primary-glow underline font-medium transition-colors"
              >
                Sign in here
              </button>
            </p>
            <p className="text-sm text-muted-foreground">
              Are you an administrator?{" "}
              <button 
                onClick={() => handleRoleSelection("admin")}
                className="text-primary hover:text-primary-glow underline font-medium transition-colors"
              >
                Access admin panel
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;