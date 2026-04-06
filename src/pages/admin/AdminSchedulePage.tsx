import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAllSchedules } from '@/hooks/useAdminData';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function AdminSchedulePage() {
  const { data: schedules, isLoading } = useAllSchedules();

  const statusColor: Record<string, string> = {
    scheduled: 'bg-info-bg text-info',
    completed: 'bg-growth-bg text-growth',
    missed: 'bg-destructive/10 text-destructive',
    pending: 'bg-learning-bg text-learning',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Schedules</h1>
        <p className="text-sm text-muted-foreground">{schedules?.length ?? 0} schedule entries</p>
      </div>
      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned By</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Loading...</TableCell></TableRow>
            ) : schedules?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No schedules</TableCell></TableRow>
            ) : schedules?.map((s: any) => (
              <TableRow key={s.id}>
                <TableCell className="text-sm">{format(new Date(s.scheduled_date), 'MMM d, yyyy')}</TableCell>
                <TableCell className="font-medium">{s.children?.display_name ?? '-'}</TableCell>
                <TableCell className="text-sm">{s.curriculum_days?.class_title ?? '-'}</TableCell>
                <TableCell><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColor[s.class_status] ?? ''}`}>{s.class_status}</span></TableCell>
                <TableCell className="text-sm text-muted-foreground">{s.assigned_by ?? 'system'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
