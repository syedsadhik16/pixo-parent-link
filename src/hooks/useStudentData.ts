import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export function useStudentChild() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['student-child', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('profile_id', user!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });
}

export function useStudentProgressData() {
  const { data: child } = useStudentChild();
  return useQuery({
    queryKey: ['student-progress-self', child?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('student_progress')
        .select('*')
        .eq('child_id', child!.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!child,
  });
}

export function useStudentScheduleToday() {
  const { data: child } = useStudentChild();
  const today = new Date().toISOString().split('T')[0];
  return useQuery({
    queryKey: ['student-schedule-today', child?.id, today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('child_schedule')
        .select('*, curriculum_days(*)')
        .eq('child_id', child!.id)
        .eq('scheduled_date', today)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!child,
  });
}

export function useStudentAttendanceToday() {
  const { data: child } = useStudentChild();
  const today = new Date().toISOString().split('T')[0];
  return useQuery({
    queryKey: ['student-attendance-today', child?.id, today],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('attendance_records')
        .select('*')
        .eq('child_id', child!.id)
        .eq('attendance_date', today)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!child,
  });
}

export function useStudentSubscription() {
  const { data: child } = useStudentChild();
  return useQuery({
    queryKey: ['student-subscription', child?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('child_id', child!.id)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!child,
  });
}

export function useStudentRecentActivity() {
  const { data: child } = useStudentChild();
  return useQuery({
    queryKey: ['student-recent-activity', child?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lesson_activity')
        .select('*')
        .eq('child_id', child!.id)
        .order('activity_date', { ascending: false })
        .limit(10);
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!child,
  });
}

export function useMarkAttendance() {
  const queryClient = useQueryClient();
  const { data: child } = useStudentChild();
  return useMutation({
    mutationFn: async (status: 'attended' | 'missed') => {
      const today = new Date().toISOString().split('T')[0];
      const { error } = await supabase.from('attendance_records').insert({
        child_id: child!.id,
        attendance_date: today,
        status,
        class_type: 'regular',
        session_title: 'Daily Session',
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-attendance-today'] });
    },
  });
}

export function useRecordActivity() {
  const queryClient = useQueryClient();
  const { data: child } = useStudentChild();
  return useMutation({
    mutationFn: async (activity: {
      activity_type: string;
      title: string;
      description?: string;
      lesson_day?: number;
      duration_minutes?: number;
      score?: number;
    }) => {
      const today = new Date().toISOString().split('T')[0];
      const { error } = await supabase.from('lesson_activity').insert({
        child_id: child!.id,
        activity_date: today,
        ...activity,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-recent-activity'] });
    },
  });
}
