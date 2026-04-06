import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole, AppRole } from '@/hooks/useRole';
import pixelSad from '@/assets/pixel-sad.png';
import { Button } from '@/components/ui/button';

function LoadingScreen() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse-soft text-muted-foreground font-heading">Loading...</div>
    </div>
  );
}

function WrongRoleScreen({ expected, actual }: { expected: AppRole; actual: AppRole | null }) {
  const { signOut } = useAuth();
  const roleLabels: Record<AppRole, string> = { parent: 'Parent Connect', student: 'Student', admin: 'Admin Hub' };
  const roleRoutes: Record<AppRole, string> = { parent: '/dashboard', student: '/student', admin: '/admin' };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="text-center space-y-4 max-w-sm">
        <img src={pixelSad} alt="Access restricted" className="w-24 h-24 mx-auto" />
        <h1 className="text-xl font-heading font-bold text-foreground">Access Restricted</h1>
        <p className="text-sm text-muted-foreground">
          This area is for {roleLabels[expected]} users. Your account is registered as {actual ? `a ${actual}` : 'unknown'}.
        </p>
        {actual && (
          <Button asChild variant="outline" className="mr-2">
            <a href={roleRoutes[actual]}>Go to {roleLabels[actual]}</a>
          </Button>
        )}
        <Button variant="ghost" onClick={() => signOut()}>Sign out</Button>
      </div>
    </div>
  );
}

export function RoleGuard({ allowedRole, children }: { allowedRole: AppRole; children: ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useRole();

  if (authLoading || roleLoading) return <LoadingScreen />;
  if (!user) return <Navigate to="/auth" replace />;
  if (role && role !== allowedRole) return <WrongRoleScreen expected={allowedRole} actual={role} />;
  return <>{children}</>;
}
