import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useStudentChild } from '@/hooks/useStudentData';
import { Home, BookOpen, Zap, Map, User } from 'lucide-react';
import pixoLogo from '@/assets/pixo-logo-full.jpg';

const navItems = [
  { to: '/student', icon: Home, label: 'Home', end: true },
  { to: '/student/lesson', icon: BookOpen, label: 'Lesson' },
  { to: '/student/practice', icon: Zap, label: 'Practice' },
  { to: '/student/journey', icon: Map, label: 'Journey' },
  { to: '/student/profile', icon: User, label: 'Profile' },
];

export default function StudentLayout() {
  const { data: child } = useStudentChild();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <img src={pixoLogo} alt="PIXO" className="h-8 object-contain" />
          <div className="flex items-center gap-3">
            {child && (
              <span className="text-sm font-heading font-semibold text-foreground">
                {child.display_name}
              </span>
            )}
            <button onClick={() => navigate('/student/profile')} className="w-8 h-8 rounded-full bg-energy-bg flex items-center justify-center">
              <User className="w-4 h-4 text-energy" />
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-6 pb-24 md:pb-6">
        <Outlet />
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t border-border">
        <div className="flex justify-around py-2">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 px-2 py-1 text-xs transition-colors ${
                  isActive ? 'text-energy font-semibold' : 'text-muted-foreground'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Desktop sidebar nav */}
      <nav className="hidden md:flex fixed left-0 top-14 bottom-0 w-56 bg-card border-r border-border flex-col p-3 gap-1">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-energy-bg text-energy' : 'text-muted-foreground hover:bg-muted'
              }`
            }
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
