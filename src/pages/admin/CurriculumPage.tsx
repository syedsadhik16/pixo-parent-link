import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAllCurriculum } from '@/hooks/useAdminData';
import { Badge } from '@/components/ui/badge';

export default function CurriculumPage() {
  const { data: days, isLoading } = useAllCurriculum();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Curriculum Days</h1>
        <p className="text-sm text-muted-foreground">{days?.length ?? 0} curriculum entries</p>
      </div>
      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Level</TableHead>
              <TableHead>M</TableHead>
              <TableHead>W</TableHead>
              <TableHead>D</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Skills</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Loading...</TableCell></TableRow>
            ) : days?.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No curriculum data</TableCell></TableRow>
            ) : days?.map(d => {
              const skills = Array.isArray(d.target_skills) ? d.target_skills : [];
              return (
                <TableRow key={d.id}>
                  <TableCell><Badge variant="outline">{d.level}</Badge></TableCell>
                  <TableCell>{d.month_number}</TableCell>
                  <TableCell>{d.week_number}</TableCell>
                  <TableCell>{d.day_number}</TableCell>
                  <TableCell className="font-medium max-w-[200px] truncate">{d.class_title}</TableCell>
                  <TableCell className="text-sm text-muted-foreground">{d.estimated_duration_minutes ?? 30}m</TableCell>
                  <TableCell>
                    <div className="flex gap-1 flex-wrap">
                      {skills.slice(0, 2).map((s: any, i: number) => (
                        <span key={i} className="text-xs bg-learning-bg text-learning px-2 py-0.5 rounded-full">{String(s)}</span>
                      ))}
                      {skills.length > 2 && <span className="text-xs text-muted-foreground">+{skills.length - 2}</span>}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
