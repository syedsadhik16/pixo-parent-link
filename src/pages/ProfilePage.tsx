import { useAuth } from '@/contexts/AuthContext';
import { useChild } from '@/contexts/ChildContext';
import { useParentProfile, useNotifications } from '@/hooks/useDataHooks';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Plus, LogOut, Settings, Globe, Shield } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const { children } = useChild();
  const { data: profile } = useParentProfile();
  const { data: notifications } = useNotifications();
  const navigate = useNavigate();

  const unreadNotifications = notifications?.filter(n => !n.read) ?? [];

  const markRead = async (id: string) => {
    await supabase.from('parent_notifications').update({ read: true }).eq('id', id);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-xl font-heading font-bold text-foreground">Profile & Settings</h1>

      {/* Parent Card */}
      <Card className="p-4 shadow-card">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full gradient-hero flex items-center justify-center">
            <User className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <p className="font-heading font-bold text-foreground">{profile?.full_name || 'Parent'}</p>
            <p className="text-sm text-muted-foreground">{profile?.email ?? user?.email}</p>
            <p className="text-xs text-muted-foreground">{profile?.phone ?? ''}</p>
          </div>
        </div>
      </Card>

      {/* Linked Children */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-heading font-bold text-foreground uppercase tracking-wider">Linked Children</h2>
          <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => navigate('/link-child')}>
            <Plus className="w-3 h-3" /> Add Child
          </Button>
        </div>
        <div className="space-y-2">
          {children.map(c => (
            <Card key={c.id} className="p-3 shadow-card flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-energy-bg flex items-center justify-center">
                <User className="w-5 h-5 text-energy" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{c.display_name}</p>
                <p className="text-xs text-muted-foreground">{c.level} - Code: {c.child_code}</p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Notifications */}
      <section>
        <h2 className="text-sm font-heading font-bold text-foreground uppercase tracking-wider mb-3">
          Notifications {unreadNotifications.length > 0 && `(${unreadNotifications.length} unread)`}
        </h2>
        <div className="space-y-2">
          {notifications?.slice(0, 10).map(n => (
            <Card
              key={n.id}
              className={`p-3 shadow-card cursor-pointer ${!n.read ? 'border-l-2 border-l-primary' : ''}`}
              onClick={() => markRead(n.id)}
            >
              <div className="flex items-start gap-2">
                <Bell className={`w-4 h-4 mt-0.5 ${!n.read ? 'text-primary' : 'text-muted-foreground'}`} />
                <div>
                  <p className="text-sm font-medium text-foreground">{n.title}</p>
                  {n.body && <p className="text-xs text-muted-foreground">{n.body}</p>}
                  <p className="text-[10px] text-muted-foreground mt-1">{format(parseISO(n.created_at), 'MMM d, h:mm a')}</p>
                </div>
              </div>
            </Card>
          ))}
          {(!notifications || notifications.length === 0) && (
            <Card className="p-4 text-center text-muted-foreground text-sm">No notifications</Card>
          )}
        </div>
      </section>

      {/* Settings */}
      <section className="space-y-2">
        <Card className="p-3 shadow-card flex items-center gap-3 cursor-pointer hover:bg-muted/50">
          <Globe className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-foreground">Language: {profile?.preferred_language === 'en' ? 'English' : profile?.preferred_language}</span>
        </Card>
        <Card className="p-3 shadow-card flex items-center gap-3 cursor-pointer hover:bg-muted/50" onClick={() => navigate('/dashboard/support')}>
          <Settings className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-foreground">Help & Support</span>
        </Card>
        <Card className="p-3 shadow-card flex items-center gap-3 cursor-pointer hover:bg-muted/50">
          <Shield className="w-5 h-5 text-muted-foreground" />
          <span className="text-sm text-foreground">Privacy & Terms</span>
        </Card>
      </section>

      <Button variant="outline" className="w-full text-destructive border-destructive/30 hover:bg-destructive/10" onClick={signOut}>
        <LogOut className="w-4 h-4 mr-2" /> Sign Out
      </Button>

      <p className="text-center text-xs text-muted-foreground">PIXO Parent Connect v1.0.0</p>
    </div>
  );
}
