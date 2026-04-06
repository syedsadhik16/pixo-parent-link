import { useChild } from '@/contexts/ChildContext';
import { useStudentProgress, usePerformanceSnapshots } from '@/hooks/useDataHooks';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import pixelLearning from '@/assets/pixel-learning.png';

export default function LearningPage() {
  const { activeChild } = useChild();
  const { data: progress } = useStudentProgress(activeChild?.id);
  const { data: snapshots } = usePerformanceSnapshots(activeChild?.id, 'weekly');

  const skills = [
    { name: 'Pronunciation', score: Number(progress?.pronunciation_score ?? 0), color: 'hsl(10, 85%, 55%)' },
    { name: 'Phonics', score: Number(progress?.phonics_score ?? 0), color: 'hsl(45, 100%, 51%)' },
    { name: 'Vocabulary', score: Number(progress?.vocabulary_score ?? 0), color: 'hsl(142, 64%, 45%)' },
    { name: 'Fluency', score: Number(progress?.fluency_score ?? 0), color: 'hsl(210, 100%, 52%)' },
    { name: 'Confidence', score: Number(progress?.confidence_score ?? 0), color: 'hsl(24, 95%, 53%)' },
  ];

  const radarData = skills.map(s => ({ subject: s.name, score: s.score, fullMark: 100 }));

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center gap-3">
        <img src={pixelLearning} alt="Learning" className="w-12 h-12" loading="lazy" />
        <div>
          <h1 className="text-xl font-heading font-bold text-foreground">Learning Overview</h1>
          <p className="text-sm text-muted-foreground">{progress?.current_level ?? activeChild?.level}</p>
        </div>
      </div>

      {/* Progress Position */}
      <Card className="p-4 shadow-card bg-learning-bg border border-learning/20">
        <h3 className="text-sm font-heading font-bold text-foreground mb-2">Curriculum Progress</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div><p className="text-2xl font-heading font-bold text-learning">{progress?.current_month ?? 1}</p><p className="text-xs text-muted-foreground">Month</p></div>
          <div><p className="text-2xl font-heading font-bold text-learning">{progress?.current_week ?? 1}</p><p className="text-xs text-muted-foreground">Week</p></div>
          <div><p className="text-2xl font-heading font-bold text-learning">{progress?.current_day ?? 1}</p><p className="text-xs text-muted-foreground">Day</p></div>
        </div>
        <div className="mt-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Lessons Completed</span>
            <span>{progress?.total_lessons_completed ?? 0} / 180</span>
          </div>
          <Progress value={((progress?.total_lessons_completed ?? 0) / 180) * 100} className="h-2" />
        </div>
      </Card>

      {/* Skill Cards */}
      <section>
        <h2 className="text-sm font-heading font-bold text-foreground mb-3">Skill Breakdown</h2>
        <div className="space-y-2">
          {skills.map(skill => (
            <Card key={skill.name} className="p-3 shadow-card flex items-center gap-3">
              <div className="w-2 h-8 rounded-full" style={{ backgroundColor: skill.color }} />
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{skill.name}</span>
                  <span className="text-sm font-heading font-bold text-foreground">{skill.score}%</span>
                </div>
                <Progress value={skill.score} className="h-1.5" />
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Radar Chart */}
      <Card className="p-4 shadow-card">
        <h3 className="text-sm font-heading font-bold text-foreground mb-3">Skill Profile</h3>
        <ResponsiveContainer width="100%" height={250}>
          <RadarChart data={radarData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} />
            <Radar dataKey="score" stroke="hsl(24, 95%, 53%)" fill="hsl(24, 95%, 53%)" fillOpacity={0.3} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </Card>

      {/* Weak Areas */}
      {progress?.weak_sounds && Array.isArray(progress.weak_sounds) && (progress.weak_sounds as string[]).length > 0 && (
        <Card className="p-4 shadow-card border border-energy/20 bg-energy-bg">
          <h3 className="text-sm font-heading font-bold text-energy mb-2">Areas to Focus</h3>
          <div className="flex flex-wrap gap-2">
            {(progress.weak_sounds as string[]).map((s: string, i: number) => (
              <span key={i} className="px-2 py-1 text-xs rounded-full bg-energy/10 text-energy font-medium">{s}</span>
            ))}
          </div>
        </Card>
      )}

      {progress?.strong_areas && Array.isArray(progress.strong_areas) && (progress.strong_areas as string[]).length > 0 && (
        <Card className="p-4 shadow-card border border-growth/20 bg-growth-bg">
          <h3 className="text-sm font-heading font-bold text-growth mb-2">Strong Areas</h3>
          <div className="flex flex-wrap gap-2">
            {(progress.strong_areas as string[]).map((s: string, i: number) => (
              <span key={i} className="px-2 py-1 text-xs rounded-full bg-growth/10 text-growth font-medium">{s}</span>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
