import { Card } from '@/components/ui/card';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface Props {
  attendance: any;
}

export function AttendanceStatusCard({ attendance }: Props) {
  const status = attendance?.status ?? 'pending';
  const config = {
    attended: { icon: CheckCircle, text: 'Attended today', color: 'text-growth', bg: 'bg-growth-bg', border: 'border-growth/20' },
    missed: { icon: XCircle, text: 'Missed today\'s session', color: 'text-destructive', bg: 'bg-destructive/10', border: 'border-destructive/20' },
    pending: { icon: Clock, text: 'Today\'s session is pending', color: 'text-secondary', bg: 'bg-secondary/20', border: 'border-secondary/30' },
  }[status] ?? { icon: Clock, text: 'No session data', color: 'text-muted-foreground', bg: 'bg-muted', border: 'border-border' };

  const Icon = config.icon;

  return (
    <Card className={`p-3 ${config.bg} border ${config.border} flex items-center gap-3`}>
      <Icon className={`w-6 h-6 ${config.color}`} />
      <div>
        <p className={`font-heading font-bold text-sm ${config.color}`}>{config.text}</p>
        {attendance?.session_title && (
          <p className="text-xs text-muted-foreground">{attendance.session_title}</p>
        )}
      </div>
    </Card>
  );
}
