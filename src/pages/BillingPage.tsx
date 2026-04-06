import { useChild } from '@/contexts/ChildContext';
import { useSubscription, useBillingHistory, usePaymentTransactions } from '@/hooks/useDataHooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { differenceInDays, parseISO, format } from 'date-fns';
import { Shield, Calendar, CreditCard, Download, CheckCircle, ArrowUpCircle } from 'lucide-react';

const plans = [
  { name: '6 Months', months: 6, price: 2999, levels: 'Level 1', desc: 'Complete one level' },
  { name: '12 Months', months: 12, price: 4999, levels: 'Level 1 + 2', desc: 'Master two levels', popular: true },
  { name: '18 Months', months: 18, price: 6999, levels: 'All Levels', desc: 'Full learning journey' },
];

export default function BillingPage() {
  const { activeChild } = useChild();
  const { data: subscription } = useSubscription(activeChild?.id);
  const { data: billingHistory } = useBillingHistory(activeChild?.id);
  const { data: payments } = usePaymentTransactions(activeChild?.id);

  const isPremium = subscription?.is_premium ?? false;
  const daysLeft = subscription?.expiry_date
    ? Math.max(0, differenceInDays(parseISO(subscription.expiry_date), new Date()))
    : 0;

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-xl font-heading font-bold text-foreground">Billing & Subscription</h1>

      {/* Current Plan */}
      <Card className={`p-4 shadow-card ${isPremium ? 'gradient-growth text-primary-foreground' : 'bg-muted'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8" />
            <div>
              <p className="font-heading font-bold text-lg">{isPremium ? 'Premium' : 'Freemium'}</p>
              <p className="text-sm opacity-80">{subscription?.plan_name ?? 'Free access'}</p>
            </div>
          </div>
          {subscription?.expiry_date && (
            <div className="text-right">
              <p className="text-2xl font-heading font-bold">{daysLeft}</p>
              <p className="text-xs opacity-80">days left</p>
            </div>
          )}
        </div>
        {subscription?.expiry_date && (
          <p className="text-xs mt-2 opacity-70 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Expires {format(parseISO(subscription.expiry_date), 'MMM d, yyyy')}
          </p>
        )}
      </Card>

      {/* Plans */}
      {!isPremium && (
        <section>
          <h2 className="text-sm font-heading font-bold text-foreground uppercase tracking-wider mb-3">Upgrade to Premium</h2>
          <div className="space-y-3">
            {plans.map(plan => (
              <Card key={plan.name} className={`p-4 shadow-card border ${plan.popular ? 'border-primary' : 'border-border'} relative`}>
                {plan.popular && (
                  <span className="absolute -top-2.5 right-3 px-2 py-0.5 text-[10px] font-bold rounded-full gradient-hero text-primary-foreground">Most Popular</span>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-heading font-bold text-foreground">{plan.name}</p>
                    <p className="text-xs text-muted-foreground">{plan.desc} - {plan.levels}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-heading font-bold text-foreground text-lg">INR {plan.price.toLocaleString()}</p>
                  </div>
                </div>
                <Button className="w-full mt-3 gradient-hero text-primary-foreground" size="sm">
                  <ArrowUpCircle className="w-4 h-4 mr-1" /> Choose Plan
                </Button>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Payment History */}
      <section>
        <h2 className="text-sm font-heading font-bold text-foreground uppercase tracking-wider mb-3">Payment History</h2>
        {payments && payments.length > 0 ? (
          <div className="space-y-2">
            {payments.map(p => (
              <Card key={p.id} className="p-3 shadow-card flex items-center gap-3">
                <CreditCard className={`w-5 h-5 ${p.payment_status === 'success' ? 'text-growth' : 'text-muted-foreground'}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">INR {p.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{p.payment_method ?? 'Card'} - {p.payment_status}</p>
                </div>
                <span className="text-xs text-muted-foreground">{p.paid_at ? format(parseISO(p.paid_at), 'MMM d') : '-'}</span>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-4 text-center text-muted-foreground text-sm">No payment records</Card>
        )}
      </section>

      {/* Invoices */}
      <section>
        <h2 className="text-sm font-heading font-bold text-foreground uppercase tracking-wider mb-3">Invoices</h2>
        {billingHistory && billingHistory.length > 0 ? (
          <div className="space-y-2">
            {billingHistory.map(bh => (
              <Card key={bh.id} className="p-3 shadow-card flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-growth" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{bh.invoice_number ?? 'Invoice'}</p>
                  <p className="text-xs text-muted-foreground">INR {bh.amount.toLocaleString()} - {bh.payment_status}</p>
                </div>
                <Button variant="ghost" size="sm" className="text-xs"><Download className="w-3 h-3" /></Button>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-4 text-center text-muted-foreground text-sm">No invoices</Card>
        )}
      </section>
    </div>
  );
}
