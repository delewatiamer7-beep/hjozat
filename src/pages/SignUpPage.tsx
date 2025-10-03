import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Users, Building } from 'lucide-react';
import { z } from 'zod';

const signUpSchema = z.object({
  email: z.string().trim().email('عنوان البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'يجب أن تكون كلمة المرور 6 أحرف على الأقل'),
  name: z.string().trim().min(2, 'يجب أن يكون الاسم حرفين على الأقل'),
  role: z.enum(['customer', 'owner']),
});

const SignUpPage = () => {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') as 'customer' | 'owner' || 'customer';
  
  const [isLoading, setIsLoading] = useState(false);
  const [justSignedUp, setJustSignedUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<'customer' | 'owner'>(defaultRole);
  
  const { signUp, user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Handle redirect after successful signup and email verification
  useEffect(() => {
    if (justSignedUp && user && profile) {
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
      setJustSignedUp(false);
    }
  }, [justSignedUp, user, profile, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const validation = signUpSchema.parse({ email, password, name, role });
      setIsLoading(true);

      const { error } = await signUp(validation.email, validation.password, validation.name, validation.role);

      if (error) {
        toast({
          title: 'فشل إنشاء الحساب',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: 'تم إنشاء الحساب!',
        description: 'يرجى التحقق من بريدك الإلكتروني لتفعيل حسابك.',
      });

      // Set flag to trigger redirect when user gets signed in after email verification
      setJustSignedUp(true);
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

  const getRoleIcon = (role: 'customer' | 'owner') => {
    return role === 'customer' ? <Users className="w-4 h-4" /> : <Building className="w-4 h-4" />;
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 bg-card-gradient border-2">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            إنشاء حساب جديد
          </h1>
          <p className="text-muted-foreground">
            Create a new account
          </p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">الاسم الكامل / Full Name</Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="أدخل اسمك الكامل"
              required
              className="text-right"
            />
          </div>

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
              placeholder="أنشئ كلمة مرور (6 أحرف على الأقل)"
              required
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">نوع الحساب / Account Type</Label>
            <Select value={role} onValueChange={(value: 'customer' | 'owner') => setRole(value)}>
              <SelectTrigger className="text-right">
                <SelectValue placeholder="اختر دورك" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">
                  <div className="flex items-center gap-2">
                    {getRoleIcon('customer')}
                    عميل - احجز ملاعب كرة القدم
                  </div>
                </SelectItem>
                <SelectItem value="owner">
                  <div className="flex items-center gap-2">
                    {getRoleIcon('owner')}
                    مالك ملعب - أدر ملاعبك
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
                جاري إنشاء الحساب...
              </>
            ) : (
              'إنشاء حساب / Sign Up'
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

export default SignUpPage;
