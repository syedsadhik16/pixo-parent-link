import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAllAttendance } from '@/hooks/useAdminData';
import { format } from 'date-fns';

export default function AdminAttendancePage() {
  const { data: records, isLoading } = useAllAttendance();

  const statusStyle: Record<string, string> = {
    attended: 'text-growth bg-growth-bg',
    missed: 'text-destructive bg-destructive/10',
    pending: 'text-learning bg-learning-bg',
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Attendance Records</h1>
        <p className="text-sm text-muted-foreground">Last 30 days - {records?.length ?? 0} records</p>
      </div>
      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Session</TableHead>
              <TableHead>Minutes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Loading...</TableCell></TableRow>
            ) : records?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No records</TableCell></TableRow>
            ) : records?.map((r: any) => (
              <TableRow key={r.id}>
                <TableCell className="text-sm">{format(new Date(r.attendance_date), 'MMM d, yyyy')}</TableCell>
                <TableCell className="font-medium">{r.children?.display_name ?? '-'}</TableCell>
                <TableCell><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle[r.status] ?? ''}`}>{r.status}</span></TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.session_title ?? '-'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.minutes_attended ?? 0}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
