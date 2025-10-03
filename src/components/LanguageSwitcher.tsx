import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
export const LanguageSwitcher = () => {
  const {
    language,
    setLanguage
  } = useLanguage();
  const toggleLanguage = () => {
    setLanguage(language === 'ar' ? 'en' : 'ar');
  };
  return <Button onClick={toggleLanguage} variant="ghost" size="sm" className="gap-2 hover:bg-primary/10 transition-all duration-200 hover:scale-105 text-slate-50">
      <Globe className="w-4 h-4" />
      <span className="font-semibold">{language === 'ar' ? 'EN' : 'AR'}</span>
    </Button>;
};