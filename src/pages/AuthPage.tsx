import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Users, Building } from 'lucide-react';
import { z } from 'zod';

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  const defaultRole = searchParams.get('role') as 'customer' | 'owner' || 'customer';
  const defaultTab = searchParams.get('tab') || 'login';
  
  const [isLoading, setIsLoading] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'customer' | 'owner'>(defaultRole);
  
  const { signIn, signUp, user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const authSchema = z.object({
    email: z.string().email(t('authPage.emailInvalid')),
    password: z.string().min(6, t('authPage.passwordMin')),
    name: z.string().min(2, t('authPage.nameMin')).optional(),
    role: z.enum(['customer', 'owner']).optional(),
  });

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
      const validation = authSchema.pick({ email: true, password: true }).parse({ email, password });
      setIsLoading(true);

      const { error } = await signIn(validation.email, validation.password);

      if (error) {
        toast({
          title: t('authPage.loginFailed'),
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: t('authPage.loginSuccess'),
        description: t('authPage.loginSuccessDesc'),
      });

      // Set flag to trigger redirect in useEffect
      setJustLoggedIn(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: t('authPage.validationError'),
          description: error.errors[0].message,
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validation = authSchema.parse({ email, password, name, role });
      setIsLoading(true);

      const { error } = await signUp(validation.email, validation.password, validation.name!, validation.role!);

      if (error) {
        toast({
          title: t('authPage.signupFailed'),
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: t('authPage.signupSuccess'),
        description: t('authPage.signupSuccessDesc'),
      });

      // Set flag to trigger redirect when user gets signed in after email verification
      setJustLoggedIn(true);

      // Switch to login tab
      const url = new URL(window.location.href);
      url.searchParams.set('tab', 'login');
      window.history.replaceState({}, '', url.toString());
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: t('authPage.validationError'),
          description: error.errors[0].message,
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleIcon = (role: 'customer' | 'owner' | 'admin') => {
    switch (role) {
      case 'customer': return <Users className="w-4 h-4" />;
      case 'owner': return <Building className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 bg-card-gradient border-2">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {t('authPage.title')}
          </h1>
          <p className="text-muted-foreground">
            {t('authPage.subtitle')}
          </p>
        </div>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">{t('authPage.loginTab')}</TabsTrigger>
            <TabsTrigger value="signup">{t('authPage.signupTab')}</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">{t('auth.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('authPage.emailPlaceholder')}
                  required
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">{t('auth.password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('authPage.passwordPlaceholder')}
                  required
                  className="text-right"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-glow"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    {t('authPage.loggingIn')}
                  </>
                ) : (
                  t('authPage.loginButton')
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="signup-name">{t('auth.name')}</Label>
                <Input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('authPage.namePlaceholder')}
                  required
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">{t('auth.email')}</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('authPage.emailPlaceholder')}
                  required
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">{t('auth.password')}</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('authPage.passwordSignupPlaceholder')}
                  required
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">{t('auth.accountType')}</Label>
                <Select value={role} onValueChange={(value: 'customer' | 'owner') => setRole(value)}>
                  <SelectTrigger className="text-right">
                    <SelectValue placeholder={t('authPage.selectRole')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">
                      <div className="flex items-center gap-2">
                        {getRoleIcon('customer')}
                        {t('auth.customerRole')}
                      </div>
                    </SelectItem>
                    <SelectItem value="owner">
                      <div className="flex items-center gap-2">
                        {getRoleIcon('owner')}
                        {t('auth.ownerRole')}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-glow"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                    {t('authPage.signingUp')}
                  </>
                ) : (
                  t('authPage.signupButton')
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-muted-foreground hover:text-foreground"
          >
            → {t('authPage.backToHome')}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;