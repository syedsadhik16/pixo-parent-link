import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Calendar, FileText, BarChart3, Download, BookOpen, ArrowUpCircle } from 'lucide-react';

const actions = [
  { icon: Calendar, label: 'Schedule', to: '/dashboard/schedule', pillar: 'learning' as const },
  { icon: FileText, label: 'Reports', to: '/dashboard/reports', pillar: 'growth' as const },
  { icon: BarChart3, label: 'Activity', to: '/dashboard/activity', pillar: 'energy' as const },
  { icon: ArrowUpCircle, label: 'Billing', to: '/dashboard/billing', pillar: 'learning' as const },
];

const pillarBg = { energy: 'bg-energy-bg', learning: 'bg-learning-bg', growth: 'bg-growth-bg' };
const pillarText = { energy: 'text-energy', learning: 'text-learning', growth: 'text-growth' };

export function QuickActions() {
  const navigate = useNavigate();
  return (
    <section>
      <h2 className="text-sm font-heading font-bold text-muted-foreground uppercase tracking-wider mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map(a => (
          <Card
            key={a.label}
            className={`p-3 cursor-pointer hover:shadow-card-hover transition-shadow ${pillarBg[a.pillar]} border-transparent`}
            onClick={() => navigate(a.to)}
          >
            <a.icon className={`w-6 h-6 mb-1.5 ${pillarText[a.pillar]}`} />
            <p className="text-sm font-medium text-foreground">{a.label}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
