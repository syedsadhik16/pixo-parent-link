import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useChild } from '@/contexts/ChildContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CheckCircle, AlertCircle, KeyRound, Mail, Phone, Ticket, ArrowRight, HelpCircle, LogOut } from 'lucide-react';
import pixelWelcome from '@/assets/pixel-welcome.png';
import pixoLogo from '@/assets/pixo-logo-full.jpg';

interface FoundChild {
  id: string;
  display_name: string;
  level: string | null;
  school_name: string | null;
  avatar_url: string | null;
  current_month: number | null;
  current_week: number | null;
  current_day: number | null;
}

export default function LinkChildPage() {
  const [code, setCode] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [foundChild, setFoundChild] = useState<FoundChild | null>(null);
  const [linkMethod, setLinkMethod] = useState<'code' | 'email' | 'phone' | 'token'>('code');
  const { user, signOut } = useAuth();
  const { refetch } = useChild();
  const { toast } = useToast();
  const navigate = useNavigate();

  const findChildByCode = async () => {
    const { data, error } = await supabase
      .from('children')
      .select('id, display_name, level, school_name, avatar_url, current_month, current_week, current_day')
      .eq('child_code', code.toUpperCase().trim())
      .maybeSingle();
    if (error) throw error;
    return data;
  };

  const findChildByEmail = async () => {
    const { data: profile, error: pErr } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .eq('role', 'student')
      .maybeSingle();
    if (pErr) throw pErr;
    if (!profile) return null;
    const { data, error } = await supabase
      .from('children')
      .select('id, display_name, level, school_name, avatar_url, current_month, current_week, current_day')
      .eq('profile_id', profile.id)
      .maybeSingle();
    if (error) throw error;
    return data;
  };

  const findChildByPhone = async () => {
    const { data: profile, error: pErr } = await supabase
      .from('profiles')
      .select('id')
      .eq('phone', phone.trim())
      .eq('role', 'student')
      .maybeSingle();
    if (pErr) throw pErr;
    if (!profile) return null;
    const { data, error } = await supabase
      .from('children')
      .select('id, display_name, level, school_name, avatar_url, current_month, current_week, current_day')
      .eq('profile_id', profile.id)
      .maybeSingle();
    if (error) throw error;
    return data;
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setFoundChild(null);
    try {
      let child: FoundChild | null = null;
      if (linkMethod === 'code') child = await findChildByCode();
      else if (linkMethod === 'email') child = await findChildByEmail();
      else if (linkMethod === 'phone') child = await findChildByPhone();
      else {
        toast({ title: 'Invite tokens', description: 'Token-based linking will be available soon.', variant: 'default' });
        setLoading(false);
        return;
      }

      if (!child) {
        toast({ title: 'Child not found', description: 'No matching student was found. Please check and try again.', variant: 'destructive' });
        setLoading(false);
        return;
      }

      const { data: existing } = await supabase
        .from('parent_child_links')
        .select('id')
        .eq('parent_profile_id', user.id)
        .eq('child_id', child.id)
        .maybeSingle();

      if (existing) {
        toast({ title: 'Already linked', description: 'This child is already connected to your account.' });
        setLoading(false);
        return;
      }

      setFoundChild(child);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmLink = async () => {
    if (!user || !foundChild) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('parent_child_links')
        .insert({ parent_profile_id: user.id, child_id: foundChild.id });
      if (error) throw error;
      toast({ title: 'Child linked successfully', description: `${foundChild.display_name} is now connected to your dashboard.` });
      refetch();
      navigate('/dashboard');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const methodTabs = [
    { value: 'code' as const, icon: KeyRound, label: 'Child Code' },
    { value: 'email' as const, icon: Mail, label: 'Email' },
    { value: 'phone' as const, icon: Phone, label: 'Phone' },
    { value: 'token' as const, icon: Ticket, label: 'Invite Token' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        {user?.email && (
          <span className="text-xs text-muted-foreground hidden sm:inline">{user.email}</span>
        )}
        <Button variant="outline" size="sm" onClick={handleSignOut}>
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </div>
      <div className="w-full max-w-lg space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <img src={pixoLogo} alt="PIXO" className="h-10 mx-auto object-contain" />
          <img src={pixelWelcome} alt="Pixel mascot" className="w-24 h-24 mx-auto" />
          <h1 className="text-2xl font-heading font-bold text-foreground">Link Your Child's Learning</h1>
          <p className="text-muted-foreground text-sm max-w-md mx-auto">
            Connect your child's PIXO account to view attendance, class schedule, progress reports, and subscription details in one place.
          </p>
          <div className="inline-flex items-center gap-2 bg-muted rounded-full px-4 py-1.5">
            <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center">1</span>
            <span className="text-xs font-medium text-muted-foreground">Step 1 of 2 - Find your child</span>
          </div>
        </div>

        {/* Search Card */}
        {!foundChild ? (
          <Card className="p-6 shadow-card">
            <Tabs value={linkMethod} onValueChange={(v) => setLinkMethod(v as any)}>
              <TabsList className="w-full grid grid-cols-4 mb-4">
                {methodTabs.map(t => (
                  <TabsTrigger key={t.value} value={t.value} className="text-xs gap-1">
                    <t.icon className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{t.label}</span>
                  </TabsTrigger>
                ))}
              </TabsList>

              <form onSubmit={handleSearch}>
                <TabsContent value="code" className="space-y-3 mt-0">
                  <div>
                    <label className="text-sm font-medium text-foreground">Child Code</label>
                    <Input
                      value={code}
                      onChange={e => setCode(e.target.value)}
                      placeholder="e.g. A1B2C3D4"
                      className="text-center text-lg tracking-widest uppercase mt-1"
                      required
                      maxLength={8}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Find this code in your child's PIXO student profile or from your school coordinator.</p>
                  </div>
                </TabsContent>

                <TabsContent value="email" className="space-y-3 mt-0">
                  <div>
                    <label className="text-sm font-medium text-foreground">Registered Email</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="child@example.com"
                      className="mt-1"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">Enter the email address registered with your child's student account.</p>
                  </div>
                </TabsContent>

                <TabsContent value="phone" className="space-y-3 mt-0">
                  <div>
                    <label className="text-sm font-medium text-foreground">Registered Phone Number</label>
                    <Input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="mt-1"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">Enter the phone number linked to the student profile.</p>
                  </div>
                </TabsContent>

                <TabsContent value="token" className="space-y-3 mt-0">
                  <div>
                    <label className="text-sm font-medium text-foreground">Invite Token</label>
                    <Input
                      value={token}
                      onChange={e => setToken(e.target.value)}
                      placeholder="Paste your invite token"
                      className="mt-1"
                      required
                    />
                    <p className="text-xs text-muted-foreground mt-1">Received a linking invite from your school? Paste the token here.</p>
                  </div>
                </TabsContent>

                <Button type="submit" className="w-full mt-4 gradient-hero text-primary-foreground" disabled={loading}>
                  {loading ? 'Searching...' : 'Find Child'}
                </Button>
              </form>
            </Tabs>
          </Card>
        ) : (
          /* Child Preview Card */
          <Card className="p-6 shadow-card space-y-5">
            <div className="inline-flex items-center gap-2 bg-growth-bg rounded-full px-4 py-1.5">
              <span className="w-5 h-5 rounded-full bg-growth text-accent-foreground text-xs font-bold flex items-center justify-center">2</span>
              <span className="text-xs font-medium text-growth">Step 2 of 2 - Confirm and link</span>
            </div>

            <div className="flex items-center gap-4 bg-muted rounded-xl p-4">
              <div className="w-14 h-14 rounded-full bg-energy-bg flex items-center justify-center">
                <span className="text-xl font-heading font-bold text-energy">{foundChild.display_name.charAt(0)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-heading font-bold text-foreground text-lg">{foundChild.display_name}</h3>
                <p className="text-sm text-muted-foreground">{foundChild.level ?? 'Level 1'}</p>
                {foundChild.school_name && (
                  <p className="text-xs text-muted-foreground">{foundChild.school_name}</p>
                )}
              </div>
              <CheckCircle className="w-6 h-6 text-growth flex-shrink-0" />
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="bg-card border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Month</p>
                <p className="font-heading font-bold text-foreground">{foundChild.current_month ?? 1}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Week</p>
                <p className="font-heading font-bold text-foreground">{foundChild.current_week ?? 1}</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-3">
                <p className="text-xs text-muted-foreground">Day</p>
                <p className="font-heading font-bold text-foreground">{foundChild.current_day ?? 1}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setFoundChild(null)} disabled={loading}>
                Back
              </Button>
              <Button className="flex-1 gradient-hero text-primary-foreground gap-1" onClick={handleConfirmLink} disabled={loading}>
                {loading ? 'Linking...' : 'Confirm & Link'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* Support section */}
        <Card className="p-4 bg-muted border-border">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground">Need help linking?</p>
              <p className="text-xs text-muted-foreground mt-1">
                Contact your school coordinator or reach out to PIXO support. You can find the child code in the student profile section of your child's PIXO Learn app.
              </p>
            </div>
          </div>
        </Card>

        <p className="text-center text-xs text-muted-foreground">Energy. Learn. Grow.</p>
      </div>
    </div>
  );
}
