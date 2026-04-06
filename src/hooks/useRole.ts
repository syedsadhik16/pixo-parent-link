import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type AppRole = 'parent' | 'student' | 'admin';

export function useRole() {
  const { user } = useAuth();
  const query = useQuery({
    queryKey: ['user-role', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user!.id)
        .single();
      if (error) throw error;
      return data.role as AppRole;
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
  });
  return { role: query.data ?? null, loading: query.isLoading, error: query.error };
}
