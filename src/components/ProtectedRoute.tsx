import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useChild } from '@/contexts/ChildContext';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-pulse-soft text-muted-foreground">Loading...</div></div>;
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}

export function RequireChild({ children }: { children: ReactNode }) {
  const { children: kids, loading, activeChild } = useChild();
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-pulse-soft text-muted-foreground">Loading...</div></div>;
  if (kids.length === 0) return <Navigate to="/link-child" replace />;
  if (!activeChild && kids.length > 1) return <Navigate to="/child-selector" replace />;
  return <>{children}</>;
}
