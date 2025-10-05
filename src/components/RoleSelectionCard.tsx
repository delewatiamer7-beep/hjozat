import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Building, Shield } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

interface RoleSelectionCardProps {
  role: "customer" | "owner" | "admin";
  title: string;
  description: string;
  onClick: () => void;
}

const roleIcons = {
  customer: Users,
  owner: Building,
  admin: Shield,
};

export const RoleSelectionCard = ({ role, title, description, onClick }: RoleSelectionCardProps) => {
  const Icon = roleIcons[role];
  const { t } = useLanguage();
  
  return (
    <Card className="group relative overflow-hidden bg-card-gradient border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-card hover:-translate-y-1">
      <div className="p-8 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-2xl font-bold text-card-foreground">{title}</h3>
          <p className="text-muted-foreground leading-relaxed">{description}</p>
        </div>
        
        <Button 
          onClick={onClick}
          size="lg"
          className="w-full bg-primary hover:bg-primary-glow text-primary-foreground font-semibold transition-all duration-300 hover:shadow-lg"
        >
          {t('common.continueAs')} {title}
        </Button>
      </div>
    </Card>
  );
};