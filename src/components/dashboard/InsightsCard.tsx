import { Card } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

interface Props {
  progress: any;
  attendance: any[];
  subscription: any;
}

export function InsightsCard({ progress, attendance, subscription }: Props) {
  const insights: string[] = [];

  if (progress) {
    const scores = [
      { name: 'Vocabulary', score: progress.vocabulary_score },
      { name: 'Pronunciation', score: progress.pronunciation_score },
      { name: 'Phonics', score: progress.phonics_score },
      { name: 'Fluency', score: progress.fluency_score },
    ].filter(s => s.score != null);

    if (scores.length > 0) {
      const best = scores.reduce((a, b) => (Number(a.score) > Number(b.score) ? a : b));
      insights.push(`Your child is strongest in ${best.name} this week.`);
    }

    if (progress.weak_sounds && Array.isArray(progress.weak_sounds) && progress.weak_sounds.length > 0) {
      insights.push(`Top weak sounds: ${(progress.weak_sounds as string[]).slice(0, 3).join(', ')}.`);
    }

    if (progress.streak_days >= 5) {
      insights.push(`Great consistency with a ${progress.streak_days}-day streak!`);
    }
  }

  if (attendance) {
    const missed = attendance.filter(a => a.status === 'missed').length;
    if (missed > 2) {
      insights.push(`${missed} sessions missed this week. Encourage regular practice.`);
    }
  }

  if (subscription?.expiry_date) {
    const daysLeft = Math.max(0, differenceInDays(parseISO(subscription.expiry_date), new Date()));
    if (daysLeft > 0 && daysLeft <= 14) {
      insights.push(`${daysLeft} subscription days remaining.`);
    }
  }

  if (insights.length === 0) return null;

  return (
    <Card className="p-4 shadow-card bg-info-bg border border-info/20">
      <div className="flex items-center gap-2 mb-2">
        <Lightbulb className="w-4 h-4 text-info" />
        <h3 className="text-sm font-heading font-bold text-foreground">Parent Insights</h3>
      </div>
      <ul className="space-y-1.5">
        {insights.map((insight, i) => (
          <li key={i} className="text-sm text-foreground flex items-start gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-info mt-1.5 shrink-0" />
            {insight}
          </li>
        ))}
      </ul>
    </Card>
  );
}
