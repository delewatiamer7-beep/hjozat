import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().trim().email('عنوان البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'يجب أن تكون كلمة المرور 6 أحرف على الأقل'),
});

const LoginPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { signIn, user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle redirect after successful login
  useEffect(() => {
    if (justLoggedIn && user && profile) {
      // Redirect based on user role
      switch (profile.role) {
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
      setJustLoggedIn(false);
    }
  }, [justLoggedIn, user, profile, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validation = loginSchema.parse({ email, password });
      setIsLoading(true);

      const { error } = await signIn(validation.email, validation.password);

      if (error) {
        toast({
          title: 'فشل تسجيل الدخول',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'مرحباً بعودتك!',
        description: 'تم تسجيل دخولك بنجاح.',
      });

      // Set flag to trigger redirect in useEffect
      setJustLoggedIn(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'خطأ في التحقق',
          description: error.errors[0].message,
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 bg-card-gradient border-2">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            تسجيل الدخول
          </h1>
          <p className="text-muted-foreground">
            Login to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">البريد الإلكتروني / Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="أدخل بريدك الإلكتروني"
              required
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">كلمة المرور / Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="أدخل كلمة المرور"
              required
              className="text-right"
            />
          </div>

          <div className="text-right">
            <Button
              type="button"
              variant="link"
              className="text-primary hover:text-primary-glow p-0 h-auto"
              onClick={() => {
                toast({
                  title: 'استعادة كلمة المرور',
                  description: 'يرجى التواصل مع الدعم لاستعادة كلمة المرور',
                });
              }}
            >
              نسيت كلمة المرور؟ / Forgot Password?
            </Button>
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary-glow"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                جاري تسجيل الدخول...
              </>
            ) : (
              'تسجيل الدخول / Login'
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            → العودة للرئيسية / Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
