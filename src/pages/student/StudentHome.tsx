import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useStudentChild, useStudentProgressData, useStudentScheduleToday, useStudentAttendanceToday, useMarkAttendance } from '@/hooks/useStudentData';
import { BookOpen, Flame, Clock, Mic, CheckCircle2, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import pixelWelcome from '@/assets/pixel-welcome.png';

export default function StudentHome() {
  const { data: child, isLoading: childLoading } = useStudentChild();
  const { data: progress } = useStudentProgressData();
  const { data: todaySchedule } = useStudentScheduleToday();
  const { data: todayAttendance } = useStudentAttendanceToday();
  const markAttendance = useMarkAttendance();
  const navigate = useNavigate();

  if (childLoading) return <div className="animate-pulse-soft text-center py-12 text-muted-foreground">Loading...</div>;

  if (!child) {
    return (
      <div className="text-center py-16 space-y-4">
        <img src={pixelWelcome} alt="Welcome" className="w-24 h-24 mx-auto" />
        <h2 className="text-lg font-heading font-bold text-foreground">No student profile found</h2>
        <p className="text-sm text-muted-foreground">Your account is not linked to a student profile yet.</p>
      </div>
    );
  }

  const curriculum = todaySchedule?.curriculum_days as any;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome */}
      <div className="flex items-center gap-4">
        <img src={pixelWelcome} alt="Pixel" className="w-16 h-16" />
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">Hey, {child.display_name}!</h1>
          <p className="text-sm text-muted-foreground">
            {child.level} - Month {child.current_month}, Week {child.current_week}, Day {child.current_day}
          </p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Streak', value: `${progress?.streak_days ?? 0} days`, icon: Flame, color: 'energy' },
          { label: 'Lessons', value: progress?.total_lessons_completed ?? 0, icon: BookOpen, color: 'learning' },
          { label: 'Time', value: `${progress?.total_minutes_spent ?? 0}m`, icon: Clock, color: 'info' },
          { label: 'Speaking', value: progress?.total_speaking_attempts ?? 0, icon: Mic, color: 'growth' },
        ].map(stat => (
          <Card key={stat.label} className="p-4 text-center">
            <stat.icon className={`w-5 h-5 mx-auto mb-1 text-${stat.color}`} />
            <div className="text-lg font-heading font-bold text-foreground">{stat.value}</div>
            <div className="text-xs text-muted-foreground">{stat.label}</div>
          </Card>
        ))}
      </div>

      {/* Today's attendance */}
      <Card className="p-5">
        <h3 className="text-sm font-heading font-semibold text-foreground mb-3">Today's Attendance</h3>
        {todayAttendance ? (
          <div className="flex items-center gap-2">
            {todayAttendance.status === 'attended' ? (
              <><CheckCircle2 className="w-5 h-5 text-growth" /><span className="text-sm text-growth font-medium">Attended</span></>
            ) : (
              <><AlertCircle className="w-5 h-5 text-destructive" /><span className="text-sm text-destructive font-medium">Missed</span></>
            )}
          </div>
        ) : (
          <div className="flex gap-2">
            <Button size="sm" className="bg-growth hover:bg-growth/90 text-accent-foreground" onClick={() => markAttendance.mutate('attended')} disabled={markAttendance.isPending}>
              Mark Attended
            </Button>
            <Button size="sm" variant="outline" onClick={() => markAttendance.mutate('missed')} disabled={markAttendance.isPending}>
              Mark Missed
            </Button>
          </div>
        )}
      </Card>

      {/* Today's class */}
      {curriculum && (
        <Card className="p-5 border-l-4 border-l-learning">
          <h3 className="text-sm font-heading font-semibold text-foreground mb-2">Today's Class</h3>
          <p className="font-heading font-bold text-foreground">{curriculum.class_title}</p>
          <p className="text-sm text-muted-foreground mt-1">{curriculum.objective}</p>
          {curriculum.estimated_duration_minutes && (
            <p className="text-xs text-muted-foreground mt-2">{curriculum.estimated_duration_minutes} min estimated</p>
          )}
          <Button className="mt-3 gradient-hero text-primary-foreground" onClick={() => navigate('/student/lesson')}>
            Start Lesson
          </Button>
        </Card>
      )}

      {/* Skills */}
      {progress && (
        <Card className="p-5">
          <h3 className="text-sm font-heading font-semibold text-foreground mb-4">My Skills</h3>
          <div className="space-y-3">
            {[
              { label: 'Pronunciation', value: progress.pronunciation_score },
              { label: 'Phonics', value: progress.phonics_score },
              { label: 'Vocabulary', value: progress.vocabulary_score },
              { label: 'Fluency', value: progress.fluency_score },
              { label: 'Confidence', value: progress.confidence_score },
            ].map(skill => (
              <div key={skill.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">{skill.label}</span>
                  <span className="font-medium text-foreground">{skill.value ?? 0}%</span>
                </div>
                <Progress value={Number(skill.value) || 0} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
