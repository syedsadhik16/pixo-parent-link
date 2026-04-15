import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useChild } from '@/contexts/ChildContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNotifications } from '@/hooks/useDataHooks';
import { Home, BookOpen, Activity, FileText, User, Bell, ChevronDown } from 'lucide-react';
import pixoLogo from '@/assets/pixo-logo-full.jpg';
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';

const navItems = [
  { to: '/dashboard', icon: Home, label: 'Home', end: true },
  { to: '/dashboard/learning', icon: BookOpen, label: 'Learning' },
  { to: '/dashboard/activity', icon: Activity, label: 'Activity' },
  { to: '/dashboard/reports', icon: FileText, label: 'Reports' },
  { to: '/dashboard/profile', icon: User, label: 'Profile' },
];

export default function DashboardLayout() {
  const { activeChild, children, setActiveChildId } = useChild();
  const { data: notifications } = useNotifications();
  const navigate = useNavigate();
  const [showChildPicker, setShowChildPicker] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const unreadCount = notifications?.filter(n => !n.read).length ?? 0;
  const recentNotifications = (notifications ?? []).slice(0, 8);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const markRead = async (id: string) => {
    await supabase.from('parent_notifications').update({ read: true }).eq('id', id);
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-card">
        <div className="container flex items-center justify-between h-14 px-4">
          <div className="flex items-center gap-3">
            <img src={pixoLogo} alt="PIXO" className="h-8 object-contain" />
            <span className="hidden md:inline text-sm font-heading font-bold text-foreground">Parent Connect</span>
          </div>

          {activeChild && (
            <div className="relative">
              <button
                onClick={() => children.length > 1 && setShowChildPicker(!showChildPicker)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-energy-bg text-sm font-medium text-foreground"
              >
                <span>{activeChild.display_name}</span>
                {children.length > 1 && <ChevronDown className="w-4 h-4" />}
              </button>
              {showChildPicker && children.length > 1 && (
                <div className="absolute right-0 top-10 bg-card rounded-lg shadow-card-hover border border-border p-2 min-w-[180px] z-50">
                  {children.map(c => (
                    <button
                      key={c.id}
                      className={`block w-full text-left px-3 py-2 rounded text-sm ${c.id === activeChild.id ? 'bg-energy-bg font-medium' : 'hover:bg-muted'}`}
                      onClick={() => { setActiveChildId(c.id); setShowChildPicker(false); }}
                    >
                      {c.display_name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <Bell className="w-5 h-5 text-muted-foreground" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 text-[10px] font-bold rounded-full gradient-energy text-primary-foreground flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-11 w-80 max-h-96 overflow-y-auto bg-card rounded-lg shadow-card-hover border border-border z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <p className="text-sm font-heading font-bold text-foreground">Notifications</p>
                  {unreadCount > 0 && (
                    <span className="text-xs text-primary font-medium">{unreadCount} unread</span>
                  )}
                </div>
                {recentNotifications.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-muted-foreground">No notifications yet</p>
                ) : (
                  recentNotifications.map(n => (
                    <button
                      key={n.id}
                      className={`w-full text-left px-4 py-3 border-b border-border last:border-0 hover:bg-muted transition-colors ${!n.read ? 'bg-primary/5' : ''}`}
                      onClick={() => { if (!n.read) markRead(n.id); }}
                    >
                      <p className={`text-sm ${!n.read ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{n.title}</p>
                      {n.body && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{n.body}</p>}
                      <p className="text-[10px] text-muted-foreground mt-1">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                      </p>
                    </button>
                  ))
                )}
                <button
                  className="w-full px-4 py-2.5 text-xs font-medium text-primary hover:bg-muted transition-colors"
                  onClick={() => { setShowNotifications(false); navigate('/dashboard/profile'); }}
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </div>

        <nav className="hidden md:flex container px-4 gap-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors ${
                  isActive ? 'bg-background text-primary border-b-2 border-primary' : 'text-muted-foreground hover:text-foreground'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="container px-4 py-4 md:py-6">
        <Outlet />
      </main>

      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-40 shadow-card">
        <div className="flex justify-around py-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-2 text-[11px] font-medium transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}