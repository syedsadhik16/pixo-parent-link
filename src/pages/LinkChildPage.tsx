import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useChild } from '@/contexts/ChildContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import pixelWelcome from '@/assets/pixel-welcome.png';

export default function LinkChildPage() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { refetch } = useChild();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      const { data: child, error: findErr } = await supabase
        .from('children')
        .select('id')
        .eq('child_code', code.toUpperCase().trim())
        .maybeSingle();

      if (findErr) throw findErr;
      if (!child) {
        toast({ title: 'Child not found', description: 'Please check the child code and try again.', variant: 'destructive' });
        setLoading(false);
        return;
      }

      const { error: existsErr, data: existing } = await supabase
        .from('parent_child_links')
        .select('id')
        .eq('parent_profile_id', user.id)
        .eq('child_id', child.id)
        .maybeSingle();

      if (existing) {
        toast({ title: 'Already linked', description: 'This child is already linked to your account.' });
        setLoading(false);
        return;
      }

      const { error: linkErr } = await supabase
        .from('parent_child_links')
        .insert({ parent_profile_id: user.id, child_id: child.id });

      if (linkErr) throw linkErr;
      toast({ title: 'Child linked successfully', description: 'You can now view their progress.' });
      refetch();
      navigate('/dashboard');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-3">
          <img src={pixelWelcome} alt="Pixel" className="w-24 h-24 mx-auto" />
          <h1 className="text-2xl font-heading font-bold text-foreground">Link Your Child</h1>
          <p className="text-muted-foreground text-sm">
            Enter your child's unique PIXO code to connect their learning journey to your dashboard.
          </p>
        </div>

        <Card className="p-6 shadow-card">
          <form onSubmit={handleLink} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Child Code</label>
              <Input
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder="e.g. A1B2C3D4"
                className="text-center text-lg tracking-widest uppercase"
                required
                maxLength={8}
              />
            </div>
            <Button type="submit" className="w-full gradient-hero text-primary-foreground" disabled={loading}>
              {loading ? 'Linking...' : 'Link Child'}
            </Button>
          </form>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          You can find this code in your child's PIXO Learn student profile or from your school coordinator.
        </p>
      </div>
    </div>
  );
}
