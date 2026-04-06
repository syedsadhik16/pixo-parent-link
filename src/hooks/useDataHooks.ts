import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useParentProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['parent-profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useStudentProgress(childId: string | undefined) {
  return useQuery({
    queryKey: ['student-progress', childId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_progress')
        .select('*')
        .eq('child_id', childId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!childId,
  });
}

export function useAttendanceRecords(childId: string | undefined, days = 30) {
  return useQuery({
    queryKey: ['attendance', childId, days],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('child_id', childId!)
        .gte('attendance_date', startDate.toISOString().split('T')[0])
        .order('attendance_date', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!childId,
  });
}

export function useTodayAttendance(childId: string | undefined) {
  const today = new Date().toISOString().split('T')[0];
  return useQuery({
    queryKey: ['today-attendance', childId, today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('child_id', childId!)
        .eq('attendance_date', today)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!childId,
  });
}

export function useLessonActivity(childId: string | undefined, days = 30) {
  return useQuery({
    queryKey: ['lesson-activity', childId, days],
    queryFn: async () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
      const { data, error } = await supabase
        .from('lesson_activity')
        .select('*')
        .eq('child_id', childId!)
        .gte('activity_date', startDate.toISOString().split('T')[0])
        .order('activity_date', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!childId,
  });
}

export function useTodaySchedule(childId: string | undefined) {
  const today = new Date().toISOString().split('T')[0];
  return useQuery({
    queryKey: ['today-schedule', childId, today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('child_schedule')
        .select('*, curriculum_days(*)')
        .eq('child_id', childId!)
        .eq('scheduled_date', today)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!childId,
  });
}

export function useUpcomingSchedule(childId: string | undefined, daysAhead = 7) {
  const today = new Date().toISOString().split('T')[0];
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + daysAhead);
  return useQuery({
    queryKey: ['upcoming-schedule', childId, daysAhead],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('child_schedule')
        .select('*, curriculum_days(*)')
        .eq('child_id', childId!)
        .gte('scheduled_date', today)
        .lte('scheduled_date', endDate.toISOString().split('T')[0])
        .order('scheduled_date', { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!childId,
  });
}

export function useWeeklyReports(childId: string | undefined) {
  return useQuery({
    queryKey: ['weekly-reports', childId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('weekly_reports')
        .select('*')
        .eq('child_id', childId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!childId,
  });
}

export function useMonthlyReports(childId: string | undefined) {
  return useQuery({
    queryKey: ['monthly-reports', childId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('monthly_reports')
        .select('*')
        .eq('child_id', childId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!childId,
  });
}

export function usePerformanceSnapshots(childId: string | undefined, periodType?: string) {
  return useQuery({
    queryKey: ['performance-snapshots', childId, periodType],
    queryFn: async () => {
      let query = supabase
        .from('performance_snapshots')
        .select('*')
        .eq('child_id', childId!)
        .order('snapshot_date', { ascending: false })
        .limit(30);
      if (periodType) query = query.eq('period_type', periodType);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!childId,
  });
}

export function useSubscription(childId: string | undefined) {
  return useQuery({
    queryKey: ['subscription', childId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('child_id', childId!)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!childId,
  });
}

export function useBillingHistory(childId: string | undefined) {
  return useQuery({
    queryKey: ['billing-history', childId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('billing_history')
        .select('*')
        .eq('child_id', childId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!childId,
  });
}

export function usePaymentTransactions(childId: string | undefined) {
  return useQuery({
    queryKey: ['payment-transactions', childId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('payment_transactions')
        .select('*')
        .eq('child_id', childId!)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!childId,
  });
}

export function useNotifications() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('parent_notifications')
        .select('*')
        .eq('parent_profile_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });
}

export function useSupportRequests() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['support-requests', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('support_requests')
        .select('*')
        .eq('parent_profile_id', user!.id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!user,
  });
}
