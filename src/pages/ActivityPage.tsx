import { useState } from 'react';
import { useChild } from '@/contexts/ChildContext';
import { useAttendanceRecords, useLessonActivity } from '@/hooks/useDataHooks';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { CheckCircle, XCircle, Clock, BookOpen, Mic, Eye } from 'lucide-react';

const activityIcons: Record<string, any> = {
  lesson: BookOpen,
  speaking: Mic,
  reading: Eye,
};

export default function ActivityPage() {
  const { activeChild } = useChild();
  const { data: attendance } = useAttendanceRecords(activeChild?.id, 30);
  const { data: activities } = useLessonActivity(activeChild?.id, 30);

  const attendedCount = attendance?.filter(a => a.status === 'attended').length ?? 0;
  const missedCount = attendance?.filter(a => a.status === 'missed').length ?? 0;
  const totalDays = attendance?.length ?? 0;
  const attendanceRate = totalDays > 0 ? Math.round((attendedCount / totalDays) * 100) : 0;

  const chartData = attendance?.slice(0, 14).reverse().map(a => ({
    date: format(parseISO(a.attendance_date), 'dd'),
    minutes: a.minutes_attended ?? 0,
    status: a.status,
  })) ?? [];

  return (
    <div className="space-y-5 animate-fade-in">
      <h1 className="text-xl font-heading font-bold text-foreground">Activity & Attendance</h1>

      <Tabs defaultValue="attendance" className="w-full">
        <TabsList className="w-full grid grid-cols-2">
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-4 mt-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-3 bg-growth-bg border border-growth/20 text-center">
              <p className="text-2xl font-heading font-bold text-growth">{attendedCount}</p>
              <p className="text-xs text-muted-foreground">Attended</p>
            </Card>
            <Card className="p-3 bg-destructive/10 border border-destructive/20 text-center">
              <p className="text-2xl font-heading font-bold text-destructive">{missedCount}</p>
              <p className="text-xs text-muted-foreground">Missed</p>
            </Card>
            <Card className="p-3 bg-info-bg border border-info/20 text-center">
              <p className="text-2xl font-heading font-bold text-info">{attendanceRate}%</p>
              <p className="text-xs text-muted-foreground">Rate</p>
            </Card>
          </div>

          {/* Chart */}
          <Card className="p-4 shadow-card">
            <h3 className="text-sm font-heading font-bold text-foreground mb-3">Daily Minutes (Last 14 Days)</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={chartData}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="minutes" fill="hsl(24, 95%, 53%)" radius={[4, 4, 0, 0]} name="Minutes" />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Attendance Calendar */}
          <Card className="p-4 shadow-card">
            <h3 className="text-sm font-heading font-bold text-foreground mb-3">Attendance Log</h3>
            <div className="space-y-2">
              {attendance?.slice(0, 14).map(a => (
                <div key={a.id} className="flex items-center gap-3 py-1.5 border-b border-border last:border-0">
                  {a.status === 'attended' ? <CheckCircle className="w-4 h-4 text-growth" /> :
                   a.status === 'missed' ? <XCircle className="w-4 h-4 text-destructive" /> :
                   <Clock className="w-4 h-4 text-secondary" />}
                  <span className="text-sm text-foreground flex-1">{format(parseISO(a.attendance_date), 'EEE, MMM d')}</span>
                  <span className="text-xs text-muted-foreground">{a.minutes_attended ?? 0} min</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="space-y-3 mt-4">
          {activities?.length === 0 && (
            <Card className="p-6 text-center text-muted-foreground">No recent activity</Card>
          )}
          {activities?.map(a => {
            const Icon = activityIcons[a.activity_type] ?? BookOpen;
            return (
              <Card key={a.id} className="p-3 shadow-card flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-learning-bg flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-learning" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">{a.title}</p>
                  {a.description && <p className="text-xs text-muted-foreground mt-0.5">{a.description}</p>}
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{format(parseISO(a.activity_date), 'MMM d')}</span>
                    {a.duration_minutes && <span>{a.duration_minutes} min</span>}
                    {a.score && <span>Score: {a.score}%</span>}
                  </div>
                </div>
              </Card>
            );
          })}
        </TabsContent>
      </Tabs>
    </div>
  );
}
