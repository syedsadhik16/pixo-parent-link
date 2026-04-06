import { Card } from '@/components/ui/card';
import { User, Layers, Calendar } from 'lucide-react';

interface Props {
  child: any;
  progress: any;
}

export function ChildProfileCard({ child, progress }: Props) {
  if (!child) return null;
  const now = new Date();
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  return (
    <Card className="p-4 shadow-card gradient-hero text-primary-foreground rounded-2xl">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-primary-foreground/20 flex items-center justify-center">
          <User className="w-7 h-7" />
        </div>
        <div className="flex-1">
          <h1 className="font-heading font-bold text-xl">{child.display_name}</h1>
          <div className="flex flex-wrap gap-3 mt-1 text-primary-foreground/80 text-sm">
            <span className="flex items-center gap-1"><Layers className="w-3.5 h-3.5" />{progress?.current_level ?? child.level}</span>
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{monthNames[now.getMonth()]} {now.getFullYear()}</span>
          </div>
          {progress && (
            <p className="text-xs mt-1 text-primary-foreground/70">
              Month {progress.current_month} / Week {progress.current_week} / Day {progress.current_day}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
