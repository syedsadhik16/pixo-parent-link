import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useStudentProgressData, useRecordActivity } from '@/hooks/useStudentData';
import { Mic, BookOpenCheck, Volume2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import pixelLearning from '@/assets/pixel-learning.png';

export default function PracticePage() {
  const { data: progress } = useStudentProgressData();
  const recordActivity = useRecordActivity();
  const { toast } = useToast();

  const weakSounds = Array.isArray(progress?.weak_sounds) ? progress.weak_sounds as string[] : [];
  const weakWords = Array.isArray(progress?.weak_words) ? progress.weak_words as string[] : [];

  const handlePractice = async (type: string, title: string) => {
    try {
      await recordActivity.mutateAsync({
        activity_type: type,
        title,
        duration_minutes: 5,
        score: Math.floor(Math.random() * 20) + 70,
      });
      toast({ title: 'Practice recorded', description: title });
    } catch {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-xl font-heading font-bold text-foreground">Practice Zone</h1>
        <p className="text-sm text-muted-foreground">Strengthen your skills with focused practice</p>
      </div>

      {/* Practice activities */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => handlePractice('speaking', 'Speaking Practice')}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-energy-bg flex items-center justify-center"><Mic className="w-5 h-5 text-energy" /></div>
            <h3 className="font-heading font-semibold text-foreground">Speaking Practice</h3>
          </div>
          <p className="text-sm text-muted-foreground">Practice pronunciation and speaking confidence</p>
          <Button size="sm" className="mt-3" variant="outline" disabled={recordActivity.isPending}>Start</Button>
        </Card>

        <Card className="p-5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => handlePractice('reading', 'Reading Practice')}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-learning-bg flex items-center justify-center"><BookOpenCheck className="w-5 h-5 text-learning" /></div>
            <h3 className="font-heading font-semibold text-foreground">Reading Practice</h3>
          </div>
          <p className="text-sm text-muted-foreground">Read stories and build fluency</p>
          <Button size="sm" className="mt-3" variant="outline" disabled={recordActivity.isPending}>Start</Button>
        </Card>

        <Card className="p-5 cursor-pointer hover:shadow-md transition-shadow" onClick={() => handlePractice('phonics', 'Phonics Drill')}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-growth-bg flex items-center justify-center"><Volume2 className="w-5 h-5 text-growth" /></div>
            <h3 className="font-heading font-semibold text-foreground">Phonics Drill</h3>
          </div>
          <p className="text-sm text-muted-foreground">Practice sounds and blending</p>
          <Button size="sm" className="mt-3" variant="outline" disabled={recordActivity.isPending}>Start</Button>
        </Card>
      </div>

      {/* Weak areas */}
      {weakSounds.length > 0 && (
        <Card className="p-5">
          <h3 className="text-sm font-heading font-semibold text-foreground mb-3">Focus Sounds</h3>
          <div className="flex flex-wrap gap-2">
            {weakSounds.map((s, i) => (
              <span key={i} className="px-3 py-1.5 rounded-full bg-energy-bg text-energy text-sm font-medium">/{String(s)}/</span>
            ))}
          </div>
        </Card>
      )}

      {weakWords.length > 0 && (
        <Card className="p-5">
          <h3 className="text-sm font-heading font-semibold text-foreground mb-3">Focus Words</h3>
          <div className="flex flex-wrap gap-2">
            {weakWords.map((w, i) => (
              <span key={i} className="px-3 py-1.5 rounded-full bg-learning-bg text-learning text-sm font-medium">{String(w)}</span>
            ))}
          </div>
        </Card>
      )}

      {weakSounds.length === 0 && weakWords.length === 0 && (
        <div className="text-center py-8">
          <img src={pixelLearning} alt="Great work" className="w-20 h-20 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No weak areas identified. Keep up the great work!</p>
        </div>
      )}
    </div>
  );
}
