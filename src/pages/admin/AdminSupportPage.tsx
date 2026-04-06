import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAllSupportRequests, useUpdateSupportStatus } from '@/hooks/useAdminData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

export default function AdminSupportPage() {
  const { data: requests, isLoading } = useAllSupportRequests();
  const updateStatus = useUpdateSupportStatus();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Support Requests</h1>
        <p className="text-sm text-muted-foreground">{requests?.length ?? 0} tickets</p>
      </div>
      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Subject</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Loading...</TableCell></TableRow>
            ) : requests?.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No requests</TableCell></TableRow>
            ) : requests?.map((r: any) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium max-w-[200px] truncate">{r.subject}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{r.profiles?.full_name ?? r.profiles?.email ?? '-'}</TableCell>
                <TableCell><Badge variant="outline">{r.issue_type ?? '-'}</Badge></TableCell>
                <TableCell><Badge variant={r.status === 'open' ? 'destructive' : r.status === 'resolved' ? 'default' : 'secondary'}>{r.status}</Badge></TableCell>
                <TableCell className="text-sm text-muted-foreground">{format(new Date(r.created_at), 'MMM d')}</TableCell>
                <TableCell>
                  {r.status === 'open' && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus.mutate({ id: r.id, status: 'resolved' })} disabled={updateStatus.isPending}>
                      Resolve
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
