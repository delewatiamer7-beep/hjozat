import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, LogOut } from "lucide-react";
import { toast } from "sonner";

const WaitingPage = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate processing time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const handleLogout = async () => {
    await signOut();
    toast.success(t('auth.logoutSuccess'));
    navigate("/");
  };

  const handleNavigate = () => {
    if (profile?.role === 'customer') {
      navigate('/customer');
    } else if (profile?.role === 'owner') {
      navigate('/owner/dashboard');
    }
  };

  const getRoleDisplay = () => {
    if (profile?.role === 'customer') {
      return t('waiting.userRole');
    } else if (profile?.role === 'owner') {
      return t('waiting.ownerRole');
    }
    return profile?.role;
  };

  const getNavigationButtonLabel = () => {
    if (profile?.role === 'customer') {
      return t('waiting.browsePlaygrounds');
    } else if (profile?.role === 'owner') {
      return t('waiting.ownerDashboard');
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      {/* Logout button in top-right */}
      <Button
        variant="outline"
        onClick={handleLogout}
        className="absolute top-6 right-6 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground"
      >
        <LogOut className="w-4 h-4 mr-2" />
        {t('nav.logout')}
      </Button>

      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('waiting.welcome')}</CardTitle>
          <CardDescription>{t('waiting.subtitle')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User Information */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <div>
              <p className="text-sm text-muted-foreground">{t('waiting.name')}</p>
              <p className="font-medium">{profile?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('waiting.email')}</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{t('waiting.role')}</p>
              <p className="font-medium">{getRoleDisplay()}</p>
            </div>
          </div>

          {/* Loading or Navigation Button */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <Loader2 className="w-12 h-12 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">{t('waiting.processing')}</p>
            </div>
          ) : (
            <Button
              onClick={handleNavigate}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
            >
              {getNavigationButtonLabel()}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WaitingPage;
