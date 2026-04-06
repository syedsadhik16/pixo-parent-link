import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard, Users, UserCheck, Link2, BookOpen, CalendarDays,
  ClipboardList, FileBarChart, CreditCard, FileText, Bell, HeadphonesIcon, Settings, LogOut
} from 'lucide-react';
import pixoLogo from '@/assets/pixo-logo-full.jpg';

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/students', icon: Users, label: 'Students' },
  { to: '/admin/parents', icon: UserCheck, label: 'Parents' },
  { to: '/admin/links', icon: Link2, label: 'Links' },
  { to: '/admin/curriculum', icon: BookOpen, label: 'Curriculum' },
  { to: '/admin/schedule', icon: CalendarDays, label: 'Schedule' },
  { to: '/admin/attendance', icon: ClipboardList, label: 'Attendance' },
  { to: '/admin/reports', icon: FileBarChart, label: 'Reports' },
  { to: '/admin/billing', icon: CreditCard, label: 'Billing' },
  { to: '/admin/invoices', icon: FileText, label: 'Invoices' },
  { to: '/admin/notifications', icon: Bell, label: 'Notifications' },
  { to: '/admin/support', icon: HeadphonesIcon, label: 'Support' },
  { to: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout() {
  const { signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-60 bg-card border-r border-border flex-col fixed inset-y-0 left-0 z-40">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <img src={pixoLogo} alt="PIXO" className="h-7 object-contain" />
          <span className="text-xs font-heading font-bold text-muted-foreground">ADMIN HUB</span>
        </div>
        <nav className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive ? 'bg-info-bg text-info' : 'text-muted-foreground hover:bg-muted'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-border">
          <button onClick={() => signOut()} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors w-full px-3 py-2 rounded-lg hover:bg-muted">
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 md:ml-60">
        {/* Mobile header */}
        <header className="md:hidden sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={pixoLogo} alt="PIXO" className="h-7 object-contain" />
            <span className="text-xs font-heading font-bold text-muted-foreground">ADMIN</span>
          </div>
        </header>

        <main className="p-4 md:p-6 max-w-7xl mx-auto">
          <Outlet />
        </main>

        {/* Mobile bottom nav - show top 5 items */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border">
          <div className="flex justify-around py-2">
            {navItems.slice(0, 5).map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors ${
                    isActive ? 'text-info font-semibold' : 'text-muted-foreground'
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
    </div>
  );
}
