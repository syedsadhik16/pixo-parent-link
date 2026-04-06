import { Card } from '@/components/ui/card';
import { BookOpen, Clock, Target } from 'lucide-react';

interface Props {
  schedule: any;
}

export function TodayClassCard({ schedule }: Props) {
  if (!schedule) {
    return (
      <Card className="p-4 bg-learning-bg border border-learning/20">
        <div className="flex items-center gap-3">
          <BookOpen className="w-8 h-8 text-learning" />
          <div>
            <p className="font-heading font-bold text-foreground">No class scheduled today</p>
            <p className="text-sm text-muted-foreground">Check the schedule for upcoming sessions</p>
          </div>
        </div>
      </Card>
    );
  }

  const cd = schedule.curriculum_days;
  return (
    <Card className="p-4 bg-learning-bg border border-learning/20 shadow-card space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-learning font-medium uppercase">Today's Class</p>
          <p className="font-heading font-bold text-foreground text-lg">{cd?.class_title ?? 'Class'}</p>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          schedule.class_status === 'completed' ? 'bg-growth text-primary-foreground' :
          schedule.class_status === 'missed' ? 'bg-destructive text-destructive-foreground' :
          'bg-secondary text-secondary-foreground'
        }`}>
          {schedule.class_status}
        </span>
      </div>
      {cd?.objective && (
        <p className="text-sm text-muted-foreground">{cd.objective}</p>
      )}
      <div className="flex gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{cd?.estimated_duration_minutes ?? 30} min</span>
        <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5" />
          {Array.isArray(cd?.target_skills) ? (cd.target_skills as string[]).join(', ') : 'Skills practice'}
        </span>
      </div>
      {cd?.home_practice && (
        <div className="bg-card/60 rounded-lg p-3">
          <p className="text-xs font-medium text-learning">Home Practice</p>
          <p className="text-sm text-foreground">{cd.home_practice}</p>
        </div>
      )}
    </Card>
  );
}
