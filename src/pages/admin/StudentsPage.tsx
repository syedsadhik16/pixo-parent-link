import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAllStudents } from '@/hooks/useAdminData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Plus, Pencil } from 'lucide-react';

interface StudentForm {
  display_name: string;
  age: string;
  level: string;
  school_name: string;
}

const emptyForm: StudentForm = { display_name: '', age: '', level: 'Level 1', school_name: '' };

export default function StudentsPage() {
  const { data: students, isLoading } = useAllStudents();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<StudentForm>(emptyForm);
  const [saving, setSaving] = useState(false);

  const openCreate = () => { setEditId(null); setForm(emptyForm); setOpen(true); };
  const openEdit = (s: any) => {
    setEditId(s.id);
    setForm({ display_name: s.display_name, age: s.age?.toString() ?? '', level: s.level ?? 'Level 1', school_name: s.school_name ?? '' });
    setOpen(true);
  };

  const handleSave = async () => {
    if (!form.display_name.trim()) { toast({ title: 'Name is required', variant: 'destructive' }); return; }
    setSaving(true);
    try {
      const payload = {
        display_name: form.display_name.trim(),
        age: form.age ? parseInt(form.age) : null,
        level: form.level || 'Level 1',
        school_name: form.school_name.trim() || null,
      };

      if (editId) {
        const { error } = await supabase.from('children').update(payload).eq('id', editId);
        if (error) throw error;
        toast({ title: 'Student updated' });
      } else {
        const { error } = await supabase.from('children').insert(payload);
        if (error) throw error;
        toast({ title: 'Student created' });
      }
      qc.invalidateQueries({ queryKey: ['admin-students'] });
      setOpen(false);
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
          <h1 className="text-2xl font-heading font-bold text-foreground">Students</h1>
          <p className="text-sm text-muted-foreground">{students?.length ?? 0} students registered</p>
        </div>
        <Button onClick={openCreate} size="sm" className="gap-1"><Plus className="w-4 h-4" /> Add Student</Button>
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
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Loading...</TableCell></TableRow>
            ) : students?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No students found</TableCell></TableRow>
            ) : students?.map(s => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.display_name}</TableCell>
                <TableCell><code className="text-xs bg-muted px-2 py-0.5 rounded">{s.child_code}</code></TableCell>
                <TableCell><Badge variant="outline">{s.level}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">M{s.current_month} W{s.current_week} D{s.current_day}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{s.school_name ?? '-'}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => openEdit(s)}><Pencil className="w-3.5 h-3.5" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editId ? 'Edit Student' : 'Add Student'}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Display Name</label>
              <Input value={form.display_name} onChange={e => setForm(f => ({ ...f, display_name: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium">Age</label>
                <Input type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: e.target.value }))} />
              </div>
              <div>
                <label className="text-sm font-medium">Level</label>
                <Input value={form.level} onChange={e => setForm(f => ({ ...f, level: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">School Name</label>
              <Input value={form.school_name} onChange={e => setForm(f => ({ ...f, school_name: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editId ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
