import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useParentProfile } from '@/hooks/useDataHooks';

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const { data: profile } = useParentProfile();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Platform configuration</p>
      </div>

      <Card className="p-5">
        <h3 className="text-sm font-heading font-semibold text-foreground mb-3">Admin Profile</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">Name</span><span className="text-foreground">{profile?.full_name ?? '-'}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="text-foreground">{user?.email ?? '-'}</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Role</span><span className="text-foreground">{profile?.role ?? 'admin'}</span></div>
        </div>
      </Card>

      <Card className="p-5">
        <h3 className="text-sm font-heading font-semibold text-foreground mb-3">Platform Info</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-muted-foreground">App</span><span className="text-foreground">PIXO Admin Hub</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Version</span><span className="text-foreground">1.0.0</span></div>
          <div className="flex justify-between"><span className="text-muted-foreground">Tagline</span><span className="text-foreground">Energy. Learn. Grow.</span></div>
        </div>
      </Card>
    </div>
  );
}
