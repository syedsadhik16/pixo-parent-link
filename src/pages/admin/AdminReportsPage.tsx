import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAllWeeklyReports, useAllMonthlyReports } from '@/hooks/useAdminData';
import { Badge } from '@/components/ui/badge';

export default function AdminReportsPage() {
  const { data: weeklyReports, isLoading: wLoading } = useAllWeeklyReports();
  const { data: monthlyReports, isLoading: mLoading } = useAllMonthlyReports();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Reports</h1>
        <p className="text-sm text-muted-foreground">Review student reports</p>
      </div>

      <Tabs defaultValue="weekly">
        <TabsList>
          <TabsTrigger value="weekly">Weekly ({weeklyReports?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="monthly">Monthly ({monthlyReports?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="weekly">
          <Card className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Week</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Summary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {wLoading ? (
                  <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Loading...</TableCell></TableRow>
                ) : weeklyReports?.map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.children?.display_name ?? '-'}</TableCell>
                    <TableCell>{r.week_label}</TableCell>
                    <TableCell><Badge variant="outline">{r.report_status}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">{r.summary ?? '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="monthly">
          <Card className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Month</TableHead>
                  <TableHead>Attendance</TableHead>
                  <TableHead>Lessons</TableHead>
                  <TableHead>Summary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Loading...</TableCell></TableRow>
                ) : monthlyReports?.map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.children?.display_name ?? '-'}</TableCell>
                    <TableCell>{r.month_label}</TableCell>
                    <TableCell>{r.attendance_percentage ?? '-'}%</TableCell>
                    <TableCell>{r.lessons_completed ?? 0}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[300px] truncate">{r.summary ?? '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
