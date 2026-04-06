import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAllLinks } from '@/hooks/useAdminData';
import { Badge } from '@/components/ui/badge';

export default function LinksPage() {
  const { data: links, isLoading } = useAllLinks();

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Parent-Child Links</h1>
        <p className="text-sm text-muted-foreground">{links?.length ?? 0} active links</p>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Parent</TableHead>
              <TableHead>Child</TableHead>
              <TableHead>Code</TableHead>
              <TableHead>Relation</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">Loading...</TableCell></TableRow>
            ) : links?.length === 0 ? (
              <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No links found</TableCell></TableRow>
            ) : links?.map((l: any) => (
              <TableRow key={l.id}>
                <TableCell className="font-medium">{l.profiles?.full_name ?? l.profiles?.email ?? '-'}</TableCell>
                <TableCell>{l.children?.display_name ?? '-'}</TableCell>
                <TableCell><code className="text-xs bg-muted px-2 py-0.5 rounded">{l.children?.child_code ?? '-'}</code></TableCell>
                <TableCell className="text-sm text-muted-foreground">{l.relation_label ?? 'Parent'}</TableCell>
                <TableCell><Badge variant={l.is_active ? 'default' : 'secondary'}>{l.is_active ? 'Active' : 'Inactive'}</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
