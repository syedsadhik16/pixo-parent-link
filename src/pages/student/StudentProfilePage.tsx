import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStudentChild, useStudentSubscription } from '@/hooks/useStudentData';
import { useAuth } from '@/contexts/AuthContext';
import { useParentProfile } from '@/hooks/useDataHooks';
import { LogOut, User, Crown, Calendar } from 'lucide-react';
import { differenceInDays } from 'date-fns';

export default function StudentProfilePage() {
  const { signOut } = useAuth();
  const { data: child } = useStudentChild();
  const { data: subscription } = useStudentSubscription();

  const daysLeft = subscription?.expiry_date
    ? Math.max(0, differenceInDays(new Date(subscription.expiry_date), new Date()))
    : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-xl font-heading font-bold text-foreground">My Profile</h1>

      <Card className="p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-energy-bg flex items-center justify-center">
            <User className="w-7 h-7 text-energy" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-foreground text-lg">{child?.display_name ?? 'Student'}</h3>
            <p className="text-sm text-muted-foreground">{child?.level} - {child?.school_name ?? 'PIXO Learn'}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Code: {child?.child_code}</p>
          </div>
        </div>
      </Card>

      {/* Subscription */}
      <Card className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Crown className={`w-5 h-5 ${subscription?.is_premium ? 'text-learning' : 'text-muted-foreground'}`} />
          <h3 className="text-sm font-heading font-semibold text-foreground">Subscription</h3>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Plan</span>
            <span className="font-medium text-foreground">{subscription?.plan_name ?? 'Freemium'}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <span className={`font-medium ${subscription?.is_premium ? 'text-growth' : 'text-muted-foreground'}`}>
              {subscription?.is_premium ? 'Premium' : 'Freemium'}
            </span>
          </div>
          {daysLeft !== null && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Days remaining</span>
              <span className="font-medium text-foreground">{daysLeft}</span>
            </div>
          )}
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-heading font-semibold text-foreground mb-3">App Info</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex justify-between"><span>App</span><span className="text-foreground">PIXO Student</span></div>
          <div className="flex justify-between"><span>Version</span><span className="text-foreground">1.0.0</span></div>
        </div>
      </Card>

      <Button variant="outline" className="w-full" onClick={() => signOut()}>
        <LogOut className="w-4 h-4 mr-2" /> Sign Out
      </Button>
    </div>
  );
}
