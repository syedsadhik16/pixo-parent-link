import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStudentScheduleToday, useRecordActivity } from '@/hooks/useStudentData';
import { BookOpen, Target, Clock, CheckCircle2 } from 'lucide-react';
import pixelLearning from '@/assets/pixel-learning.png';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export default function LessonPage() {
  const { data: schedule, isLoading } = useStudentScheduleToday();
  const recordActivity = useRecordActivity();
  const { toast } = useToast();
  const [completed, setCompleted] = useState(false);

  const curriculum = schedule?.curriculum_days as any;

  if (isLoading) return <div className="animate-pulse-soft text-center py-12 text-muted-foreground">Loading lesson...</div>;

  if (!curriculum) {
    return (
      <div className="text-center py-16 space-y-4">
        <img src={pixelLearning} alt="No lesson" className="w-24 h-24 mx-auto" />
        <h2 className="text-lg font-heading font-bold text-foreground">No lesson scheduled today</h2>
        <p className="text-sm text-muted-foreground">Check your schedule for upcoming classes.</p>
      </div>
    );
  }

  const lessonParts = Array.isArray(curriculum.lesson_parts) ? curriculum.lesson_parts : [];
  const targetSkills = Array.isArray(curriculum.target_skills) ? curriculum.target_skills : [];
  const targetContent = Array.isArray(curriculum.target_content) ? curriculum.target_content : [];

  const handleComplete = async () => {
    try {
      await recordActivity.mutateAsync({
        activity_type: 'lesson_completion',
        title: `Completed: ${curriculum.class_title}`,
        description: curriculum.objective,
        lesson_day: curriculum.day_number,
        duration_minutes: curriculum.estimated_duration_minutes ?? 30,
        score: 85,
      });
      setCompleted(true);
      toast({ title: 'Lesson completed', description: 'Great work today!' });
    } catch {
      toast({ title: 'Error', description: 'Could not save lesson completion.', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-heading font-bold text-foreground">{curriculum.class_title}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {curriculum.level} - Month {curriculum.month_number}, Week {curriculum.week_number}, Day {curriculum.day_number}
        </p>
      </div>

      <Card className="p-5 border-l-4 border-l-learning">
        <div className="flex items-start gap-3">
          <Target className="w-5 h-5 text-learning mt-0.5" />
          <div>
            <h3 className="text-sm font-heading font-semibold text-foreground">Objective</h3>
            <p className="text-sm text-muted-foreground mt-1">{curriculum.objective}</p>
          </div>
        </div>
      </Card>

      {targetSkills.length > 0 && (
        <Card className="p-5">
          <h3 className="text-sm font-heading font-semibold text-foreground mb-3">Target Skills</h3>
          <div className="flex flex-wrap gap-2">
            {targetSkills.map((skill: string, i: number) => (
              <span key={i} className="px-3 py-1 rounded-full bg-learning-bg text-learning text-xs font-medium">{skill}</span>
            ))}
          </div>
        </Card>
      )}

      {lessonParts.length > 0 && (
        <Card className="p-5">
          <h3 className="text-sm font-heading font-semibold text-foreground mb-3">Lesson Parts</h3>
          <div className="space-y-3">
            {lessonParts.map((part: any, i: number) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                <div className="w-6 h-6 rounded-full bg-energy-bg flex items-center justify-center text-xs font-bold text-energy">{i + 1}</div>
                <div className="text-sm text-foreground">{typeof part === 'string' ? part : part.title ?? JSON.stringify(part)}</div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {curriculum.home_practice && (
        <Card className="p-5 bg-growth-bg/50">
          <h3 className="text-sm font-heading font-semibold text-foreground mb-2">Home Practice</h3>
          <p className="text-sm text-muted-foreground">{curriculum.home_practice}</p>
        </Card>
      )}

      <div className="flex items-center gap-2">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{curriculum.estimated_duration_minutes ?? 30} minutes</span>
      </div>

      {completed ? (
        <div className="flex items-center gap-2 p-4 rounded-xl bg-growth-bg">
          <CheckCircle2 className="w-6 h-6 text-growth" />
          <span className="font-heading font-semibold text-growth">Lesson Complete!</span>
        </div>
      ) : (
        <Button className="w-full gradient-hero text-primary-foreground" onClick={handleComplete} disabled={recordActivity.isPending}>
          {recordActivity.isPending ? 'Saving...' : 'Mark Lesson Complete'}
        </Button>
      )}

      {curriculum.praise_line && completed && (
        <p className="text-center text-sm font-medium text-learning italic">{curriculum.praise_line}</p>
      )}
    </div>
  );
}
