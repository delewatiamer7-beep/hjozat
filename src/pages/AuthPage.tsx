import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Users, Building, Shield } from 'lucide-react';
import { z } from 'zod';

const authSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  role: z.enum(['customer', 'owner', 'admin']).optional(),
});

const AuthPage = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') as 'customer' | 'owner' | 'admin' || 'customer';
  const defaultTab = searchParams.get('tab') || 'login';
  
  const [isLoading, setIsLoading] = useState(false);
  const [justLoggedIn, setJustLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'customer' | 'owner' | 'admin'>(defaultRole);
  
  const { signIn, signUp, user, profile } = useAuth();
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
      const validation = authSchema.pick({ email: true, password: true }).parse({ email, password });
      setIsLoading(true);

      const { error } = await signIn(validation.email, validation.password);

      if (error) {
        toast({
          title: 'Login Failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Welcome back!',
        description: 'You have been logged in successfully.',
      });

      // Set flag to trigger redirect in useEffect
      setJustLoggedIn(true);
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation Error',
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
          title: 'Sign Up Failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'Account Created!',
        description: 'Please check your email to verify your account.',
      });

      // Switch to login tab
      const url = new URL(window.location.href);
      url.searchParams.set('tab', 'login');
      window.history.replaceState({}, '', url.toString());
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validation Error',
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
      case 'admin': return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 bg-card-gradient border-2">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Football Field Booking
          </h1>
          <p className="text-muted-foreground">
            Sign in to your account or create a new one
          </p>
        </div>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary-glow"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password (min. 6 characters)"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Account Type</Label>
                <Select value={role} onValueChange={(value: 'customer' | 'owner' | 'admin') => setRole(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer">
                      <div className="flex items-center gap-2">
                        {getRoleIcon('customer')}
                        Customer - Book football fields
                      </div>
                    </SelectItem>
                    <SelectItem value="owner">
                      <div className="flex items-center gap-2">
                        {getRoleIcon('owner')}
                        Field Owner - Manage your fields
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        {getRoleIcon('admin')}
                        Administrator - System management
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
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
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
            ← Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default AuthPage;