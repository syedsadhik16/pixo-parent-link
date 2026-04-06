import { useChild } from '@/contexts/ChildContext';
import { useWeeklyReports, useMonthlyReports, usePerformanceSnapshots, useTodayAttendance, useSubscription } from '@/hooks/useDataHooks';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { format, parseISO } from 'date-fns';
import { Download, Lock, FileText, TrendingUp } from 'lucide-react';
import pixelCelebrate from '@/assets/pixel-celebrate.png';
import { exportReportAsPdf } from '@/lib/pdfExport';

function PremiumLockCard() {
  return (
    <Card className="p-4 border border-learning/20 bg-learning-bg/50 relative overflow-hidden">
      <div className="absolute inset-0 backdrop-blur-sm bg-card/30 flex flex-col items-center justify-center z-10">
        <Lock className="w-8 h-8 text-learning mb-2" />
        <p className="font-heading font-bold text-foreground text-sm">Premium Insights</p>
        <p className="text-xs text-muted-foreground mb-2">Unlock deeper analysis with Premium</p>
        <Button size="sm" className="gradient-hero text-primary-foreground text-xs">Upgrade to Premium</Button>
      </div>
      <div className="opacity-30 space-y-2">
        <p className="text-sm font-medium">Phonics Error Patterns</p>
        <p className="text-sm font-medium">Confidence Indicators</p>
        <p className="text-sm font-medium">Vocabulary Retention</p>
      </div>
    </Card>
  );
}

export default function ReportsPage() {
  const { activeChild } = useChild();
  const { data: weeklyReports } = useWeeklyReports(activeChild?.id);
  const { data: monthlyReports } = useMonthlyReports(activeChild?.id);
  const { data: dailySnapshots } = usePerformanceSnapshots(activeChild?.id, 'daily');
  const { data: todayAttendance } = useTodayAttendance(activeChild?.id);
  const { data: subscription } = useSubscription(activeChild?.id);
  const isPremium = subscription?.is_premium ?? false;

  const todaySnapshot = dailySnapshots?.[0];

  const trendData = dailySnapshots?.slice(0, 7).reverse().map(s => ({
    date: format(parseISO(s.snapshot_date), 'EEE'),
    pronunciation: Number(s.pronunciation_score ?? 0),
    fluency: Number(s.fluency_score ?? 0),
  })) ?? [];

  const handleDownloadPdf = (reportType: string, periodLabel: string) => {
    exportReportAsPdf(activeChild?.display_name ?? 'Student', reportType, periodLabel);
  };

  return (
    <div className="space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-heading font-bold text-foreground">Reports</h1>
      </div>

      <Tabs defaultValue="daily" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        {/* Daily */}
        <TabsContent value="daily" className="space-y-4 mt-4">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => handleDownloadPdf('Daily', format(new Date(), 'MMM d, yyyy'))}>
              <Download className="w-3 h-3" /> Download PDF
            </Button>
          </div>
          <div id="report-print-area">
            <Card className="p-4 shadow-card">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-5 h-5 text-growth" />
                <h3 className="font-heading font-bold text-foreground">Today's Report</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="stat-card"><p className="text-xs text-muted-foreground">Attendance</p><p className="font-heading font-bold text-foreground capitalize">{todayAttendance?.status ?? 'Pending'}</p></div>
                <div><p className="text-xs text-muted-foreground">Minutes</p><p className="font-heading font-bold text-foreground">{todayAttendance?.minutes_attended ?? 0}</p></div>
                <div><p className="text-xs text-muted-foreground">Pronunciation</p><p className="font-heading font-bold text-foreground">{todaySnapshot?.pronunciation_score ?? '-'}%</p></div>
                <div><p className="text-xs text-muted-foreground">Speaking</p><p className="font-heading font-bold text-foreground">{todaySnapshot?.speaking_attempts ?? 0} attempts</p></div>
              </div>
              {todaySnapshot?.summary && <p className="text-sm text-muted-foreground mt-3">{todaySnapshot.summary}</p>}
            </Card>

            {/* Trend Chart */}
            {trendData.length > 0 && (
              <Card className="p-4 shadow-card mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-4 h-4 text-growth" />
                  <h3 className="text-sm font-heading font-bold text-foreground">7-Day Score Trend</h3>
                </div>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis hide domain={[0, 100]} />
                    <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                    <Line type="monotone" dataKey="pronunciation" stroke="hsl(10, 85%, 55%)" strokeWidth={2} dot={{ r: 3 }} name="Pronunciation" />
                    <Line type="monotone" dataKey="fluency" stroke="hsl(142, 64%, 45%)" strokeWidth={2} dot={{ r: 3 }} name="Fluency" />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            )}
          </div>
          {!isPremium && <PremiumLockCard />}
        </TabsContent>

        {/* Weekly */}
        <TabsContent value="weekly" className="space-y-4 mt-4">
          {weeklyReports?.map(wr => (
            <Card key={wr.id} className="p-4 shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-foreground">{wr.week_label}</h3>
                <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => handleDownloadPdf('Weekly', wr.week_label)}>
                  <Download className="w-3 h-3" /> PDF
                </Button>
              </div>
              {wr.summary && <p className="text-sm text-muted-foreground">{wr.summary}</p>}
              {wr.strengths && Array.isArray(wr.strengths) && (wr.strengths as string[]).length > 0 && (
                <div>
                  <p className="text-xs font-medium text-growth mb-1">Strengths</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(wr.strengths as string[]).map((s, i) => <span key={i} className="text-xs bg-growth-bg text-growth px-2 py-0.5 rounded-full">{s}</span>)}
                  </div>
                </div>
              )}
              {wr.improvement_areas && Array.isArray(wr.improvement_areas) && (wr.improvement_areas as string[]).length > 0 && (
                <div>
                  <p className="text-xs font-medium text-energy mb-1">Areas to Improve</p>
                  <div className="flex flex-wrap gap-1.5">
                    {(wr.improvement_areas as string[]).map((s, i) => <span key={i} className="text-xs bg-energy-bg text-energy px-2 py-0.5 rounded-full">{s}</span>)}
                  </div>
                </div>
              )}
              {wr.confidence_note && <p className="text-sm text-info italic">{wr.confidence_note}</p>}
            </Card>
          ))}
          {(!weeklyReports || weeklyReports.length === 0) && (
            <Card className="p-6 text-center"><img src={pixelCelebrate} alt="" className="w-16 h-16 mx-auto mb-2" loading="lazy" /><p className="text-sm text-muted-foreground">No weekly reports yet</p></Card>
          )}
          {!isPremium && <PremiumLockCard />}
        </TabsContent>

        {/* Monthly */}
        <TabsContent value="monthly" className="space-y-4 mt-4">
          {monthlyReports?.map(mr => (
            <Card key={mr.id} className="p-4 shadow-card space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-bold text-foreground">{mr.month_label}</h3>
                <Button variant="outline" size="sm" className="text-xs gap-1" onClick={() => handleDownloadPdf('Monthly', mr.month_label)}>
                  <Download className="w-3 h-3" /> PDF
                </Button>
              </div>
              {mr.summary && <p className="text-sm text-muted-foreground">{mr.summary}</p>}
              <div className="grid grid-cols-2 gap-3">
                <div><p className="text-xs text-muted-foreground">Attendance</p><p className="font-heading font-bold text-foreground">{mr.attendance_percentage ?? '-'}%</p></div>
                <div><p className="text-xs text-muted-foreground">Lessons</p><p className="font-heading font-bold text-foreground">{mr.lessons_completed ?? 0}</p></div>
              </div>
              {mr.strengths && Array.isArray(mr.strengths) && (mr.strengths as string[]).length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {(mr.strengths as string[]).map((s, i) => <span key={i} className="text-xs bg-growth-bg text-growth px-2 py-0.5 rounded-full">{s}</span>)}
                </div>
              )}
            </Card>
          ))}
          {(!monthlyReports || monthlyReports.length === 0) && (
            <Card className="p-6 text-center"><p className="text-sm text-muted-foreground">No monthly reports yet</p></Card>
          )}
          {!isPremium && <PremiumLockCard />}
        </TabsContent>
      </Tabs>
    </div>
  );
}
