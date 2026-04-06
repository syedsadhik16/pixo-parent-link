import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useStudentChild, useStudentProgressData, useStudentRecentActivity } from '@/hooks/useStudentData';
import { format } from 'date-fns';
import { Trophy, Star, Zap } from 'lucide-react';
import pixelCelebrate from '@/assets/pixel-celebrate.png';

export default function JourneyPage() {
  const { data: child } = useStudentChild();
  const { data: progress } = useStudentProgressData();
  const { data: activities } = useStudentRecentActivity();

  const totalDays = 180;
  const completedDays = progress?.total_lessons_completed ?? 0;
  const progressPercent = Math.min((completedDays / totalDays) * 100, 100);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-heading font-bold text-foreground">My Journey</h1>
        <p className="text-sm text-muted-foreground">Track your learning progress</p>
      </div>

      {/* Progress overview */}
      <Card className="p-5">
        <div className="flex items-center gap-4 mb-4">
          <img src={pixelCelebrate} alt="Journey" className="w-14 h-14" />
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-foreground">{child?.level ?? 'Level 1'} Journey</h3>
            <p className="text-sm text-muted-foreground">{completedDays} of {totalDays} lessons completed</p>
          </div>
        </div>
        <Progress value={progressPercent} className="h-3" />
        <p className="text-xs text-muted-foreground mt-2 text-right">{progressPercent.toFixed(0)}% complete</p>
      </Card>

      {/* Position */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <div className="text-lg font-heading font-bold text-foreground">M{progress?.current_month ?? child?.current_month ?? 1}</div>
          <div className="text-xs text-muted-foreground">Month</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-lg font-heading font-bold text-foreground">W{progress?.current_week ?? child?.current_week ?? 1}</div>
          <div className="text-xs text-muted-foreground">Week</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-lg font-heading font-bold text-foreground">D{progress?.current_day ?? child?.current_day ?? 1}</div>
          <div className="text-xs text-muted-foreground">Day</div>
        </Card>
      </div>

      {/* Milestones */}
      <Card className="p-5">
        <h3 className="text-sm font-heading font-semibold text-foreground mb-3">Milestones</h3>
        <div className="space-y-3">
          {[
            { days: 7, label: 'First Week', icon: Star },
            { days: 30, label: '30-Day Streak', icon: Zap },
            { days: 90, label: 'Halfway There', icon: Trophy },
            { days: 180, label: 'Journey Complete', icon: Trophy },
          ].map(m => {
            const reached = completedDays >= m.days;
            return (
              <div key={m.days} className={`flex items-center gap-3 p-3 rounded-lg ${reached ? 'bg-growth-bg' : 'bg-muted/50'}`}>
                <m.icon className={`w-5 h-5 ${reached ? 'text-growth' : 'text-muted-foreground'}`} />
                <div className="flex-1">
                  <span className={`text-sm font-medium ${reached ? 'text-growth' : 'text-muted-foreground'}`}>{m.label}</span>
                  <span className="text-xs text-muted-foreground ml-2">{m.days} lessons</span>
                </div>
                {reached && <span className="text-xs font-medium text-growth">Earned</span>}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recent activity */}
      {activities && activities.length > 0 && (
        <Card className="p-5">
          <h3 className="text-sm font-heading font-semibold text-foreground mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {activities.slice(0, 5).map(a => (
              <div key={a.id} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                <div>
                  <p className="text-sm font-medium text-foreground">{a.title}</p>
                  <p className="text-xs text-muted-foreground">{a.activity_type}</p>
                </div>
                <span className="text-xs text-muted-foreground">{format(new Date(a.activity_date), 'MMM d')}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
