import { useChild } from '@/contexts/ChildContext';
import { useStudentProgress, useTodayAttendance, useTodaySchedule, useSubscription, useAttendanceRecords, usePerformanceSnapshots } from '@/hooks/useDataHooks';
import { KPIStatCard } from '@/components/dashboard/KPIStatCard';
import { TodayClassCard } from '@/components/dashboard/TodayClassCard';
import { AttendanceStatusCard } from '@/components/dashboard/AttendanceStatusCard';
import { SubscriptionCard } from '@/components/dashboard/SubscriptionCard';
import { QuickActions } from '@/components/dashboard/QuickActions';
import { WeeklyTrendChart } from '@/components/dashboard/WeeklyTrendChart';
import { ChildProfileCard } from '@/components/dashboard/ChildProfileCard';
import { InsightsCard } from '@/components/dashboard/InsightsCard';
import { Flame, BookOpen, Mic, Clock, Target, TrendingUp } from 'lucide-react';

export default function DashboardHome() {
  const { activeChild } = useChild();
  const { data: progress } = useStudentProgress(activeChild?.id);
  const { data: todayAttendance } = useTodayAttendance(activeChild?.id);
  const { data: todaySchedule } = useTodaySchedule(activeChild?.id);
  const { data: subscription } = useSubscription(activeChild?.id);
  const { data: attendance } = useAttendanceRecords(activeChild?.id, 7);
  const { data: snapshots } = usePerformanceSnapshots(activeChild?.id, 'daily');

  const weekAttended = attendance?.filter(a => a.status === 'attended').length ?? 0;

  return (
    <div className="space-y-5 animate-fade-in">
      <ChildProfileCard child={activeChild} progress={progress} />

      {/* Energy Section */}
      <section>
        <h2 className="text-sm font-heading font-bold text-energy uppercase tracking-wider mb-3">Energy</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KPIStatCard icon={Flame} label="Streak" value={`${progress?.streak_days ?? 0} days`} pillar="energy" />
          <KPIStatCard icon={Target} label="Attended This Week" value={`${weekAttended}/7`} pillar="energy" />
          <KPIStatCard icon={Clock} label="Time This Week" value={`${progress?.total_minutes_spent ?? 0} min`} pillar="energy" />
          <KPIStatCard icon={TrendingUp} label="Total Lessons" value={`${progress?.total_lessons_completed ?? 0}`} pillar="energy" />
        </div>
      </section>

      <AttendanceStatusCard attendance={todayAttendance} />

      {/* Learning Section */}
      <section>
        <h2 className="text-sm font-heading font-bold text-learning uppercase tracking-wider mb-3">Learning</h2>
        <TodayClassCard schedule={todaySchedule} />
      </section>

      {/* Growth Section */}
      <section>
        <h2 className="text-sm font-heading font-bold text-growth uppercase tracking-wider mb-3">Growth</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <KPIStatCard icon={Mic} label="Speaking Attempts" value={`${progress?.total_speaking_attempts ?? 0}`} pillar="growth" />
          <KPIStatCard icon={BookOpen} label="Reading Sessions" value={`${progress?.total_reading_sessions ?? 0}`} pillar="growth" />
          <KPIStatCard icon={Target} label="Pronunciation" value={`${progress?.pronunciation_score ?? '-'}%`} pillar="growth" />
          <KPIStatCard icon={TrendingUp} label="Fluency" value={`${progress?.fluency_score ?? '-'}%`} pillar="growth" />
        </div>
      </section>

      <WeeklyTrendChart snapshots={snapshots ?? []} />
      <InsightsCard progress={progress} attendance={attendance ?? []} subscription={subscription} />
      <SubscriptionCard subscription={subscription} />
      <QuickActions />
    </div>
  );
}
