import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const ForbiddenPage = () => {
  const navigate = useNavigate();
  const { profile } = useAuth();

  const handleGoToDashboard = () => {
    // Redirect to appropriate dashboard based on role
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
      default:
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-destructive/10 p-6">
            <ShieldAlert className="w-16 h-16 text-destructive" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">403</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            غير مصرح لك بالدخول
          </h2>
          <p className="text-muted-foreground">
            Access Forbidden - You don't have permission to access this page
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button 
            onClick={handleGoToDashboard}
            className="bg-primary hover:bg-primary-glow"
          >
            العودة إلى لوحة التحكم
          </Button>
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
          >
            الصفحة الرئيسية
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForbiddenPage;
