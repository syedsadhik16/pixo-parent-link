import { Card } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';

interface Props {
  snapshots: any[];
}

export function WeeklyTrendChart({ snapshots }: Props) {
  if (!snapshots || snapshots.length === 0) return null;

  const chartData = snapshots.slice(0, 7).reverse().map(s => ({
    date: format(parseISO(s.snapshot_date), 'EEE'),
    pronunciation: Number(s.pronunciation_score ?? 0),
    fluency: Number(s.fluency_score ?? 0),
    vocabulary: Number(s.vocabulary_score ?? 0),
  }));

  return (
    <Card className="p-4 shadow-card">
      <h3 className="text-sm font-heading font-bold text-foreground mb-3">7-Day Performance Trend</h3>
      <ResponsiveContainer width="100%" height={180}>
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="colorPron" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(10, 85%, 55%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(10, 85%, 55%)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorFlu" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(142, 64%, 45%)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="hsl(142, 64%, 45%)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="date" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis hide domain={[0, 100]} />
          <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
          <Area type="monotone" dataKey="pronunciation" stroke="hsl(10, 85%, 55%)" fill="url(#colorPron)" strokeWidth={2} name="Pronunciation" />
          <Area type="monotone" dataKey="fluency" stroke="hsl(142, 64%, 45%)" fill="url(#colorFlu)" strokeWidth={2} name="Fluency" />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
