import { useChild } from '@/contexts/ChildContext';
import { useTodaySchedule, useUpcomingSchedule } from '@/hooks/useDataHooks';
import { Card } from '@/components/ui/card';
import { format, parseISO } from 'date-fns';
import { Calendar, BookOpen, Clock, Target, CheckCircle, XCircle } from 'lucide-react';

export default function SchedulePage() {
  const { activeChild } = useChild();
  const { data: today } = useTodaySchedule(activeChild?.id);
  const { data: upcoming } = useUpcomingSchedule(activeChild?.id, 14);

  const statusIcon = (s: string) => {
    if (s === 'completed') return <CheckCircle className="w-4 h-4 text-growth" />;
    if (s === 'missed') return <XCircle className="w-4 h-4 text-destructive" />;
    return <Clock className="w-4 h-4 text-secondary" />;
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-xl font-heading font-bold text-foreground">Class Schedule</h1>

      {/* Today's Class */}
      <section>
        <h2 className="text-sm font-heading font-bold text-learning uppercase tracking-wider mb-3">Today</h2>
        {today ? (
          <Card className="p-4 bg-learning-bg border border-learning/20 shadow-card space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-heading font-bold text-foreground text-lg">{today.curriculum_days?.class_title}</p>
                <p className="text-sm text-muted-foreground">{today.curriculum_days?.objective}</p>
              </div>
              {statusIcon(today.class_status)}
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{today.curriculum_days?.estimated_duration_minutes ?? 30} min</span>
              <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5" />
                {Array.isArray(today.curriculum_days?.target_skills) ? (today.curriculum_days.target_skills as string[]).join(', ') : 'Skills'}
              </span>
            </div>
            {today.curriculum_days?.home_practice && (
              <div className="bg-card/60 rounded-lg p-3 mt-2">
                <p className="text-xs font-medium text-learning">Home Practice</p>
                <p className="text-sm text-foreground">{today.curriculum_days.home_practice}</p>
              </div>
            )}
            {today.curriculum_days?.praise_line && (
              <p className="text-sm text-growth italic">"{today.curriculum_days.praise_line}"</p>
            )}
          </Card>
        ) : (
          <Card className="p-4 bg-muted border-border text-center">
            <Calendar className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No class scheduled for today</p>
          </Card>
        )}
      </section>

      {/* Upcoming */}
      <section>
        <h2 className="text-sm font-heading font-bold text-foreground uppercase tracking-wider mb-3">Upcoming Classes</h2>
        <div className="space-y-2">
          {upcoming?.filter(s => s.scheduled_date !== new Date().toISOString().split('T')[0]).map(s => (
            <Card key={s.id} className="p-3 shadow-card flex items-center gap-3">
              {statusIcon(s.class_status)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{s.curriculum_days?.class_title}</p>
                <div className="flex gap-2 mt-0.5 text-xs text-muted-foreground">
                  <span>{format(parseISO(s.scheduled_date), 'EEE, MMM d')}</span>
                  <span>{s.curriculum_days?.estimated_duration_minutes ?? 30} min</span>
                </div>
              </div>
            </Card>
          ))}
          {(!upcoming || upcoming.length <= 1) && (
            <Card className="p-4 text-center text-muted-foreground text-sm">No upcoming classes scheduled</Card>
          )}
        </div>
      </section>
    </div>
  );
}
