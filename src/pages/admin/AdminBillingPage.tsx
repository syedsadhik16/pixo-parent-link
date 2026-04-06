import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAllSubscriptions, useAllPayments } from '@/hooks/useAdminData';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function AdminBillingPage() {
  const { data: subs, isLoading: sLoading } = useAllSubscriptions();
  const { data: payments, isLoading: pLoading } = useAllPayments();

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
                </TableRow>
              </TableHeader>
              <TableBody>
                {sLoading ? (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
                ) : subs?.map((s: any) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.children?.display_name ?? '-'}</TableCell>
                    <TableCell>{s.plan_name}</TableCell>
                    <TableCell><Badge variant="outline">{s.status}</Badge></TableCell>
                    <TableCell>{s.is_premium ? <Badge className="bg-learning text-learning-bg">Premium</Badge> : <Badge variant="secondary">Free</Badge>}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{s.expiry_date ? format(new Date(s.expiry_date), 'MMM d, yyyy') : '-'}</TableCell>
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
    </div>
  );
}
