import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface Child {
  id: string;
  display_name: string;
  child_code: string;
  age: number | null;
  level: string | null;
  current_month: number | null;
  current_week: number | null;
  current_day: number | null;
  avatar_url: string | null;
  school_name: string | null;
}

interface ChildContextType {
  children: Child[];
  activeChild: Child | null;
  setActiveChildId: (id: string) => void;
  loading: boolean;
  refetch: () => void;
}

const ChildContext = createContext<ChildContextType>({
  children: [],
  activeChild: null,
  setActiveChildId: () => {},
  loading: true,
  refetch: () => {},
});

export function ChildProvider({ children: childrenProp }: { children: ReactNode }) {
  const { user } = useAuth();
  const [linkedChildren, setLinkedChildren] = useState<Child[]>([]);
  const [activeChildId, setActiveChildId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchChildren = async () => {
    if (!user) {
      setLinkedChildren([]);
      setLoading(false);
      return;
    }
    const { data } = await supabase
      .from('parent_child_links')
      .select('child_id, children(*)')
      .eq('parent_profile_id', user.id)
      .eq('is_active', true);

    if (data) {
      const kids = data.map((link: any) => link.children).filter(Boolean) as Child[];
      setLinkedChildren(kids);
      if (kids.length > 0 && !activeChildId) {
        setActiveChildId(kids[0].id);
      }
    }
    setLoading(false);
  };

  useEffect(() => { fetchChildren(); }, [user]);

  const activeChild = linkedChildren.find(c => c.id === activeChildId) || null;

  return (
    <ChildContext.Provider value={{
      children: linkedChildren,
      activeChild,
      setActiveChildId,
      loading,
      refetch: fetchChildren,
    }}>
      {childrenProp}
    </ChildContext.Provider>
  );
}

export const useChild = () => useContext(ChildContext);
