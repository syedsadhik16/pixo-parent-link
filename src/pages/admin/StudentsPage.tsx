import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAllStudents } from '@/hooks/useAdminData';
import { Badge } from '@/components/ui/badge';

export default function StudentsPage() {
  const { data: students, isLoading } = useAllStudents();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Students</h1>
          <p className="text-sm text-muted-foreground">{students?.length ?? 0} students registered</p>
        </div>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>School</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Loading...</TableCell></TableRow>
            ) : students?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No students found</TableCell></TableRow>
            ) : students?.map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.display_name}</TableCell>
                <TableCell><code className="text-xs bg-muted px-2 py-0.5 rounded">{s.child_code}</code></TableCell>
                <TableCell><Badge variant="outline">{s.level}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">M{s.current_month} W{s.current_week} D{s.current_day}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{s.school_name ?? '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
