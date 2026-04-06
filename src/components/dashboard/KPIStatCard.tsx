import { Card } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface Props {
  icon: LucideIcon;
  label: string;
  value: string;
  pillar: 'energy' | 'learning' | 'growth';
}

const pillarStyles = {
  energy: { bg: 'bg-energy-bg', icon: 'text-energy', border: 'border-energy/20' },
  learning: { bg: 'bg-learning-bg', icon: 'text-learning', border: 'border-learning/20' },
  growth: { bg: 'bg-growth-bg', icon: 'text-growth', border: 'border-growth/20' },
};

export function KPIStatCard({ icon: Icon, label, value, pillar }: Props) {
  const s = pillarStyles[pillar];
  return (
    <Card className={`p-3 ${s.bg} border ${s.border} shadow-card`}>
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${s.icon}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <p className="text-lg font-heading font-bold text-foreground">{value}</p>
    </Card>
  );
}
