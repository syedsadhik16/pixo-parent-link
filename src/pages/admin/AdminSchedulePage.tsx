import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAllSchedules, useAllStudents, useAllCurriculum } from '@/hooks/useAdminData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Plus } from 'lucide-react';

export default function AdminSchedulePage() {
  const { data: schedules, isLoading } = useAllSchedules();
  const { data: students } = useAllStudents();
  const { data: curriculum } = useAllCurriculum();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [childId, setChildId] = useState('');
  const [curriculumDayId, setCurriculumDayId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [saving, setSaving] = useState(false);

  const statusColor: Record<string, string> = {
    scheduled: 'bg-info-bg text-info',
    completed: 'bg-growth-bg text-growth',
    missed: 'bg-destructive/10 text-destructive',
    pending: 'bg-learning-bg text-learning',
  };

  const handleAssign = async () => {
    if (!childId || !curriculumDayId || !scheduledDate) {
      toast({ title: 'All fields required', variant: 'destructive' }); return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from('child_schedule').insert({
        child_id: childId,
        curriculum_day_id: curriculumDayId,
        scheduled_date: scheduledDate,
        assigned_by: 'admin',
      });
      if (error) throw error;
      toast({ title: 'Schedule assigned' });
      qc.invalidateQueries({ queryKey: ['admin-schedules'] });
      setOpen(false);
      setChildId(''); setCurriculumDayId(''); setScheduledDate('');
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Schedules</h1>
          <p className="text-sm text-muted-foreground">{schedules?.length ?? 0} schedule entries</p>
        </div>
        <Button onClick={() => setOpen(true)} size="sm" className="gap-1"><Plus className="w-4 h-4" /> Assign Schedule</Button>
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Assign Schedule</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Student</label>
              <Select value={childId} onValueChange={setChildId}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>
                  {students?.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.display_name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Curriculum Day</label>
              <Select value={curriculumDayId} onValueChange={setCurriculumDayId}>
                <SelectTrigger><SelectValue placeholder="Select curriculum day" /></SelectTrigger>
                <SelectContent>
                  {curriculum?.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.level} - M{c.month_number}W{c.week_number}D{c.day_number}: {c.class_title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Scheduled Date</label>
              <Input type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleAssign} disabled={saving}>{saving ? 'Assigning...' : 'Assign'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
