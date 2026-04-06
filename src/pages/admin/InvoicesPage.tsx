import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAllBillingHistory } from '@/hooks/useAdminData';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function InvoicesPage() {
  const { data: invoices, isLoading } = useAllBillingHistory();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Invoices</h1>
        <p className="text-sm text-muted-foreground">{invoices?.length ?? 0} invoice records</p>
      </div>
      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Loading...</TableCell></TableRow>
            ) : invoices?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No invoices</TableCell></TableRow>
            ) : invoices?.map((inv: any) => (
              <TableRow key={inv.id}>
                <TableCell className="font-medium">{inv.invoice_number ?? '-'}</TableCell>
                <TableCell>{inv.children?.display_name ?? '-'}</TableCell>
                <TableCell>{inv.currency ?? 'INR'} {inv.amount}</TableCell>
                <TableCell><Badge variant={inv.payment_status === 'paid' ? 'default' : 'secondary'}>{inv.payment_status}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{inv.payment_provider ?? '-'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{inv.payment_date ? format(new Date(inv.payment_date), 'MMM d, yyyy') : '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
