import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAllAttendance } from '@/hooks/useAdminData';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Pencil } from 'lucide-react';

export default function AdminAttendancePage() {
  const { data: records, isLoading } = useAllAttendance();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [editRecord, setEditRecord] = useState<any>(null);
  const [editStatus, setEditStatus] = useState('');
  const [editMinutes, setEditMinutes] = useState('');
  const [editReason, setEditReason] = useState('');
  const [saving, setSaving] = useState(false);

  const statusStyle: Record<string, string> = {
    attended: 'text-growth bg-growth-bg',
    missed: 'text-destructive bg-destructive/10',
    pending: 'text-learning bg-learning-bg',
  };

  const openEdit = (r: any) => {
    setEditRecord(r);
    setEditStatus(r.status);
    setEditMinutes(r.minutes_attended?.toString() ?? '0');
    setEditReason(r.reason ?? '');
  };

  const handleSave = async () => {
    if (!editRecord) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('attendance_records').update({
        status: editStatus as any,
        minutes_attended: parseInt(editMinutes) || 0,
        reason: editReason.trim() || null,
      }).eq('id', editRecord.id);
      if (error) throw error;
      toast({ title: 'Attendance updated' });
      qc.invalidateQueries({ queryKey: ['admin-attendance'] });
      setEditRecord(null);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
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
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Loading...</TableCell></TableRow>
            ) : records?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No records</TableCell></TableRow>
            ) : records?.map((r: any) => (
              <TableRow key={r.id}>
                <TableCell className="text-sm">{format(new Date(r.attendance_date), 'MMM d, yyyy')}</TableCell>
                <TableCell className="font-medium">{r.children?.display_name ?? '-'}</TableCell>
                <TableCell><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusStyle[r.status] ?? ''}`}>{r.status}</span></TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.session_title ?? '-'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.minutes_attended ?? 0}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(r)}><Pencil className="w-3.5 h-3.5" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!editRecord} onOpenChange={(o) => !o && setEditRecord(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Override Attendance</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Student</label>
              <p className="text-sm text-muted-foreground">{editRecord?.children?.display_name} - {editRecord?.attendance_date}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={editStatus} onValueChange={setEditStatus}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="attended">Attended</SelectItem>
                  <SelectItem value="missed">Missed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Minutes Attended</label>
              <Input type="number" value={editMinutes} onChange={e => setEditMinutes(e.target.value)} />
            </div>
            <div>
              <label className="text-sm font-medium">Reason / Note</label>
              <Input value={editReason} onChange={e => setEditReason(e.target.value)} placeholder="Optional override reason" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRecord(null)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Update'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
