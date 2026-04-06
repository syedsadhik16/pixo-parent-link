
-- Security definer function to check admin role without recursion
CREATE OR REPLACE FUNCTION public.is_admin(check_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles WHERE id = check_user_id AND role = 'admin'
  );
$$;

-- Security definer function to get child_id for a student
CREATE OR REPLACE FUNCTION public.get_student_child_id(student_user_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.children WHERE profile_id = student_user_id LIMIT 1;
$$;

-- STUDENT RLS POLICIES

-- Students can view own child record
CREATE POLICY "Students can view own child" ON public.children
FOR SELECT TO authenticated
USING (profile_id = auth.uid());

-- Student progress: student read/write own
CREATE POLICY "Students can view own progress" ON public.student_progress
FOR SELECT TO authenticated
USING (child_id = public.get_student_child_id(auth.uid()));

CREATE POLICY "Students can update own progress" ON public.student_progress
FOR UPDATE TO authenticated
USING (child_id = public.get_student_child_id(auth.uid()));

CREATE POLICY "Students can insert own progress" ON public.student_progress
FOR INSERT TO authenticated
WITH CHECK (child_id = public.get_student_child_id(auth.uid()));

-- Attendance: student insert and read own
CREATE POLICY "Students can insert attendance" ON public.attendance_records
FOR INSERT TO authenticated
WITH CHECK (child_id = public.get_student_child_id(auth.uid()));

CREATE POLICY "Students can view own attendance" ON public.attendance_records
FOR SELECT TO authenticated
USING (child_id = public.get_student_child_id(auth.uid()));

-- Lesson activity: student insert and read own
CREATE POLICY "Students can insert activities" ON public.lesson_activity
FOR INSERT TO authenticated
WITH CHECK (child_id = public.get_student_child_id(auth.uid()));

CREATE POLICY "Students can view own activities" ON public.lesson_activity
FOR SELECT TO authenticated
USING (child_id = public.get_student_child_id(auth.uid()));

-- Child schedule: student read own
CREATE POLICY "Students can view own schedule" ON public.child_schedule
FOR SELECT TO authenticated
USING (child_id = public.get_student_child_id(auth.uid()));

-- Subscriptions: student read own
CREATE POLICY "Students can view own subscription" ON public.subscriptions
FOR SELECT TO authenticated
USING (child_id = public.get_student_child_id(auth.uid()));

-- Performance snapshots: student read own
CREATE POLICY "Students can view own snapshots" ON public.performance_snapshots
FOR SELECT TO authenticated
USING (child_id = public.get_student_child_id(auth.uid()));

-- ADMIN RLS POLICIES (full access)

CREATE POLICY "Admins full access profiles" ON public.profiles
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins full access children" ON public.children
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins full access parent_child_links" ON public.parent_child_links
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins full access student_progress" ON public.student_progress
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins full access attendance" ON public.attendance_records
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins full access lesson_activity" ON public.lesson_activity
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins full access curriculum_days" ON public.curriculum_days
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins full access child_schedule" ON public.child_schedule
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins full access performance_snapshots" ON public.performance_snapshots
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins full access weekly_reports" ON public.weekly_reports
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins full access monthly_reports" ON public.monthly_reports
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins full access subscriptions" ON public.subscriptions
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins full access payment_transactions" ON public.payment_transactions
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins full access billing_history" ON public.billing_history
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins full access parent_notifications" ON public.parent_notifications
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins full access support_requests" ON public.support_requests
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins full access app_settings" ON public.app_settings
FOR ALL TO authenticated
USING (public.is_admin(auth.uid()));
