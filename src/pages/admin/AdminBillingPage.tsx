import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAllSubscriptions, useAllPayments } from '@/hooks/useAdminData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Pencil } from 'lucide-react';

export default function AdminBillingPage() {
  const { data: subs, isLoading: sLoading } = useAllSubscriptions();
  const { data: payments, isLoading: pLoading } = useAllPayments();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [editSub, setEditSub] = useState<any>(null);
  const [subForm, setSubForm] = useState({ plan_name: '', status: '', is_premium: false, expiry_date: '' });
  const [saving, setSaving] = useState(false);

  const openEdit = (s: any) => {
    setEditSub(s);
    setSubForm({
      plan_name: s.plan_name,
      status: s.status ?? 'active',
      is_premium: s.is_premium ?? false,
      expiry_date: s.expiry_date ?? '',
    });
  };

  const handleSave = async () => {
    if (!editSub) return;
    setSaving(true);
    try {
      const { error } = await supabase.from('subscriptions').update({
        plan_name: subForm.plan_name,
        status: subForm.status,
        is_premium: subForm.is_premium,
        expiry_date: subForm.expiry_date || null,
      }).eq('id', editSub.id);
      if (error) throw error;
      toast({ title: 'Subscription updated' });
      qc.invalidateQueries({ queryKey: ['admin-subscriptions'] });
      setEditSub(null);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Billing & Payments</h1>
      </div>

      <Tabs defaultValue="subscriptions">
        <TabsList>
          <TabsTrigger value="subscriptions">Subscriptions ({subs?.length ?? 0})</TabsTrigger>
          <TabsTrigger value="payments">Payments ({payments?.length ?? 0})</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions">
          <Card className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Premium</TableHead>
                  <TableHead>Expiry</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sLoading ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
                ) : subs?.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No subscriptions</TableCell></TableRow>
                ) : subs?.map((s: any) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.children?.display_name ?? '-'}</TableCell>
                    <TableCell>{s.plan_name}</TableCell>
                    <TableCell><Badge variant="outline">{s.status}</Badge></TableCell>
                    <TableCell>{s.is_premium ? <Badge className="bg-learning text-learning-bg">Premium</Badge> : <Badge variant="secondary">Free</Badge>}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{s.expiry_date ? format(new Date(s.expiry_date), 'MMM d, yyyy') : '-'}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm" onClick={() => openEdit(s)}><Pencil className="w-3.5 h-3.5" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
                ) : payments?.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No payments</TableCell></TableRow>
                ) : payments?.map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.children?.display_name ?? '-'}</TableCell>
                    <TableCell>{p.currency ?? 'INR'} {p.amount}</TableCell>
                    <TableCell><Badge variant={p.payment_status === 'paid' ? 'default' : 'secondary'}>{p.payment_status}</Badge></TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.payment_method ?? '-'}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{p.paid_at ? format(new Date(p.paid_at), 'MMM d, yyyy') : '-'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!editSub} onOpenChange={(o) => !o && setEditSub(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Subscription</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Student</label>
              <p className="text-sm text-muted-foreground">{editSub?.children?.display_name}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Plan Name</label>
              <Input value={subForm.plan_name} onChange={e => setSubForm(f => ({ ...f, plan_name: e.target.value }))} />
            </div>
            <div>
              <label className="text-sm font-medium">Status</label>
              <Select value={subForm.status} onValueChange={v => setSubForm(f => ({ ...f, status: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Premium Access</label>
              <Switch checked={subForm.is_premium} onCheckedChange={v => setSubForm(f => ({ ...f, is_premium: v }))} />
            </div>
            <div>
              <label className="text-sm font-medium">Expiry Date</label>
              <Input type="date" value={subForm.expiry_date} onChange={e => setSubForm(f => ({ ...f, expiry_date: e.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditSub(null)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : 'Update'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
