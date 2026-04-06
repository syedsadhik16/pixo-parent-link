import { Card } from '@/components/ui/card';
import { differenceInDays, parseISO } from 'date-fns';
import { Shield, Calendar } from 'lucide-react';

interface Props {
  subscription: any;
}

export function SubscriptionCard({ subscription }: Props) {
  if (!subscription) return null;

  const isPremium = subscription.is_premium;
  const daysLeft = subscription.expiry_date
    ? Math.max(0, differenceInDays(parseISO(subscription.expiry_date), new Date()))
    : 0;

  return (
    <Card className={`p-4 border shadow-card ${isPremium ? 'bg-growth-bg border-growth/20' : 'bg-muted border-border'}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className={`w-6 h-6 ${isPremium ? 'text-growth' : 'text-muted-foreground'}`} />
          <div>
            <p className="font-heading font-bold text-foreground">
              {isPremium ? 'Premium' : 'Freemium'}
            </p>
            <p className="text-xs text-muted-foreground">{subscription.plan_name}</p>
          </div>
        </div>
        {subscription.expiry_date && (
          <div className="text-right">
            <p className="font-heading font-bold text-foreground">{daysLeft}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />days left</p>
          </div>
        )}
      </div>
    </Card>
  );
}
