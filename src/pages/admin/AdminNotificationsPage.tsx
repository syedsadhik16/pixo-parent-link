import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAllNotifications } from '@/hooks/useAdminData';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

export default function AdminNotificationsPage() {
  const { data: notifications, isLoading } = useAllNotifications();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Notifications</h1>
        <p className="text-sm text-muted-foreground">{notifications?.length ?? 0} notifications</p>
      </div>
      <Card className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Parent</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Read</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Loading...</TableCell></TableRow>
            ) : notifications?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No notifications</TableCell></TableRow>
            ) : notifications?.map((n: any) => (
              <TableRow key={n.id}>
                <TableCell className="font-medium">{n.title}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{n.profiles?.full_name ?? '-'}</TableCell>
                <TableCell><Badge variant="outline">{n.category ?? n.notification_type ?? '-'}</Badge></TableCell>
                <TableCell>{n.read ? <span className="text-growth text-xs">Read</span> : <span className="text-energy text-xs font-medium">Unread</span>}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{format(new Date(n.created_at), 'MMM d, HH:mm')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
