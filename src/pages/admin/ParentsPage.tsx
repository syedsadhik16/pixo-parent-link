import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAllParents } from '@/hooks/useAdminData';

export default function ParentsPage() {
  const { data: parents, isLoading } = useAllParents();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Parents</h1>
        <p className="text-sm text-muted-foreground">{parents?.length ?? 0} parent profiles</p>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Language</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">Loading...</TableCell></TableRow>
            ) : parents?.length === 0 ? (
              <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground py-8">No parents found</TableCell></TableRow>
            ) : parents?.map(p => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.full_name ?? '-'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.email ?? '-'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.phone ?? '-'}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{p.preferred_language ?? 'en'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
