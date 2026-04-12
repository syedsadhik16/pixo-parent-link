import { useChild } from '@/contexts/ChildContext';
import { useSubscription, useBillingHistory, usePaymentTransactions } from '@/hooks/useDataHooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { differenceInDays, parseISO, format } from 'date-fns';
import { Shield, Calendar, CreditCard, Download, CheckCircle, ArrowUpCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const plans = [
  { name: '6 Months', months: 6, price: 2999, levels: 'Level 1', desc: 'Complete one level' },
  { name: '12 Months', months: 12, price: 4999, levels: 'Level 1 + 2', desc: 'Master two levels', popular: true },
  { name: '18 Months', months: 18, price: 6999, levels: 'All Levels', desc: 'Full learning journey' },
];

export default function BillingPage() {
  const { activeChild } = useChild();
  const { data: subscription, refetch: refetchSub } = useSubscription(activeChild?.id);
  const { data: billingHistory, refetch: refetchBilling } = useBillingHistory(activeChild?.id);
  const { data: payments, refetch: refetchPayments } = usePaymentTransactions(activeChild?.id);
  const { toast } = useToast();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const isPremium = subscription?.is_premium ?? false;
  const daysLeft = subscription?.expiry_date
    ? Math.max(0, differenceInDays(parseISO(subscription.expiry_date), new Date()))
    : 0;

  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.Razorpay) { resolve(true); return; }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleUpgrade = async (plan: typeof plans[0]) => {
    if (!activeChild) return;
    setLoadingPlan(plan.name);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast({ title: 'Payment error', description: 'Could not load payment gateway. Please try again.', variant: 'destructive' });
        setLoadingPlan(null);
        return;
      }

      const { data: session } = await supabase.auth.getSession();
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/razorpay-create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.session?.access_token}`,
        },
        body: JSON.stringify({
          child_id: activeChild.id,
          plan_name: plan.name,
          amount: plan.price,
          currency: 'INR',
        }),
      });

      const orderData = await res.json();
      if (!res.ok) throw new Error(orderData.error || 'Order creation failed');

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'PIXO Learn',
        description: `${plan.name} Premium Plan`,
        order_id: orderData.order_id,
        handler: async (response: any) => {
          try {
            const verifyRes = await fetch(`https://${projectId}.supabase.co/functions/v1/razorpay-verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${session?.session?.access_token}`,
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                child_id: activeChild.id,
                plan_name: plan.name,
                billing_cycle_months: plan.months,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              toast({ title: 'Payment successful', description: `Upgraded to ${plan.name} Premium. Invoice: ${verifyData.invoice_number}` });
              refetchSub();
              refetchBilling();
              refetchPayments();
            } else {
              toast({ title: 'Verification failed', description: verifyData.error || 'Please contact support.', variant: 'destructive' });
            }
          } catch {
            toast({ title: 'Error', description: 'Payment verification failed. Contact support if amount was deducted.', variant: 'destructive' });
          }
        },
        theme: { color: '#6C3CE1' },
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', () => {
        toast({ title: 'Payment failed', description: 'The payment was not completed. Please try again.', variant: 'destructive' });
      });
      rzp.open();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-xl font-heading font-bold text-foreground">Billing & Subscription</h1>

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
                <Button
                  className="w-full mt-3 gradient-hero text-primary-foreground"
                  size="sm"
                  disabled={loadingPlan !== null}
                  onClick={() => handleUpgrade(plan)}
                >
                  {loadingPlan === plan.name ? (
                    <><Loader2 className="w-4 h-4 mr-1 animate-spin" /> Processing...</>
                  ) : (
                    <><ArrowUpCircle className="w-4 h-4 mr-1" /> Choose Plan</>
                  )}
                </Button>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-sm font-heading font-bold text-foreground uppercase tracking-wider mb-3">Payment History</h2>
        {payments && payments.length > 0 ? (
          <div className="space-y-2">
            {payments.map(p => (
              <Card key={p.id} className="p-3 shadow-card flex items-center gap-3">
                <CreditCard className={`w-5 h-5 ${p.payment_status === 'paid' ? 'text-growth' : 'text-muted-foreground'}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">INR {p.amount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{p.payment_method ?? 'Pending'} - {p.payment_status}</p>
                </div>
                <span className="text-xs text-muted-foreground">{p.paid_at ? format(parseISO(p.paid_at), 'MMM d') : '-'}</span>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-4 text-center text-muted-foreground text-sm">No payment records</Card>
        )}
      </section>

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
