import { Card } from '@/components/ui/card';
import { useAdminStats } from '@/hooks/useAdminData';
import { Users, UserCheck, Crown, ClipboardList } from 'lucide-react';

export default function AdminHome() {
  const { data: stats, isLoading } = useAdminStats();

  const cards = [
    { label: 'Total Students', value: stats?.totalStudents ?? 0, icon: Users, color: 'energy' },
    { label: 'Total Parents', value: stats?.totalParents ?? 0, icon: UserCheck, color: 'info' },
    { label: 'Premium Subscriptions', value: stats?.premiumSubscriptions ?? 0, icon: Crown, color: 'learning' },
    { label: "Today's Attendance", value: stats?.todayAttendance ?? 0, icon: ClipboardList, color: 'growth' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">PIXO platform overview</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map(c => (
          <Card key={c.label} className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-10 h-10 rounded-xl bg-${c.color}-bg flex items-center justify-center`}>
                <c.icon className={`w-5 h-5 text-${c.color}`} />
              </div>
            </div>
            <div className="text-2xl font-heading font-bold text-foreground">
              {isLoading ? '...' : c.value}
            </div>
            <div className="text-xs text-muted-foreground">{c.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card className="p-5">
          <h3 className="text-sm font-heading font-semibold text-foreground mb-2">Quick Actions</h3>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Manage students, curriculum, and schedules from the sidebar.</p>
            <p>Review attendance records and generate reports.</p>
            <p>Handle billing, invoices, and support requests.</p>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-heading font-semibold text-foreground mb-2">Platform Health</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-muted-foreground">Backend</span><span className="text-growth font-medium">Connected</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Auth</span><span className="text-growth font-medium">Active</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Storage</span><span className="text-growth font-medium">Ready</span></div>
          </div>
        </Card>
      </div>
    </div>
  );
}
