import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useAllStudents() {
  return useQuery({
    queryKey: ['admin-students'],
    queryFn: async () => {
      const { data, error } = await supabase.from('children').select('*, student_progress(*)').order('display_name');
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAllParents() {
  return useQuery({
    queryKey: ['admin-parents'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('role', 'parent').order('full_name');
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAllLinks() {
  return useQuery({
    queryKey: ['admin-links'],
    queryFn: async () => {
      const { data, error } = await supabase.from('parent_child_links').select('*, profiles!parent_child_links_parent_profile_id_fkey(full_name, email), children!parent_child_links_child_id_fkey(display_name, child_code)');
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAllCurriculum() {
  return useQuery({
    queryKey: ['admin-curriculum'],
    queryFn: async () => {
      const { data, error } = await supabase.from('curriculum_days').select('*').order('level').order('month_number').order('week_number').order('day_number');
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAllSchedules() {
  return useQuery({
    queryKey: ['admin-schedules'],
    queryFn: async () => {
      const { data, error } = await supabase.from('child_schedule').select('*, children(display_name), curriculum_days(class_title, level, day_number)').order('scheduled_date', { ascending: false }).limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAllAttendance(days = 30) {
  return useQuery({
    queryKey: ['admin-attendance', days],
    queryFn: async () => {
      const start = new Date();
      start.setDate(start.getDate() - days);
      const { data, error } = await supabase.from('attendance_records').select('*, children(display_name)').gte('attendance_date', start.toISOString().split('T')[0]).order('attendance_date', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAllWeeklyReports() {
  return useQuery({
    queryKey: ['admin-weekly-reports'],
    queryFn: async () => {
      const { data, error } = await supabase.from('weekly_reports').select('*, children(display_name)').order('created_at', { ascending: false }).limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAllMonthlyReports() {
  return useQuery({
    queryKey: ['admin-monthly-reports'],
    queryFn: async () => {
      const { data, error } = await supabase.from('monthly_reports').select('*, children(display_name)').order('created_at', { ascending: false }).limit(50);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAllSubscriptions() {
  return useQuery({
    queryKey: ['admin-subscriptions'],
    queryFn: async () => {
      const { data, error } = await supabase.from('subscriptions').select('*, children(display_name)').order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAllPayments() {
  return useQuery({
    queryKey: ['admin-payments'],
    queryFn: async () => {
      const { data, error } = await supabase.from('payment_transactions').select('*, children(display_name)').order('created_at', { ascending: false }).limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAllBillingHistory() {
  return useQuery({
    queryKey: ['admin-billing-history'],
    queryFn: async () => {
      const { data, error } = await supabase.from('billing_history').select('*, children(display_name)').order('created_at', { ascending: false }).limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAllNotifications() {
  return useQuery({
    queryKey: ['admin-notifications'],
    queryFn: async () => {
      const { data, error } = await supabase.from('parent_notifications').select('*, profiles!parent_notifications_parent_profile_id_fkey(full_name)').order('created_at', { ascending: false }).limit(100);
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAllSupportRequests() {
  return useQuery({
    queryKey: ['admin-support-requests'],
    queryFn: async () => {
      const { data, error } = await supabase.from('support_requests').select('*, profiles!support_requests_parent_profile_id_fkey(full_name, email)').order('created_at', { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useAdminStats() {
  return useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const [students, parents, subs, attendance] = await Promise.all([
        supabase.from('children').select('id', { count: 'exact', head: true }),
        supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('role', 'parent'),
        supabase.from('subscriptions').select('id', { count: 'exact', head: true }).eq('is_premium', true),
        supabase.from('attendance_records').select('id', { count: 'exact', head: true }).eq('attendance_date', new Date().toISOString().split('T')[0]),
      ]);
      return {
        totalStudents: students.count ?? 0,
        totalParents: parents.count ?? 0,
        premiumSubscriptions: subs.count ?? 0,
        todayAttendance: attendance.count ?? 0,
      };
    },
  });
}

export function useUpdateSupportStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from('support_requests').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-support-requests'] }),
  });
}
