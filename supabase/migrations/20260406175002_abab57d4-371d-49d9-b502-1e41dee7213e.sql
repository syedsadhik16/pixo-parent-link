-- Create role enum
CREATE TYPE public.app_role AS ENUM ('parent', 'student', 'admin');

-- Timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ===== PROFILES =====
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  role app_role NOT NULL DEFAULT 'parent',
  avatar_url TEXT,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, role)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NEW.email, 'parent');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===== CHILDREN =====
CREATE TABLE public.children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  child_code TEXT UNIQUE NOT NULL DEFAULT upper(substring(gen_random_uuid()::text, 1, 8)),
  display_name TEXT NOT NULL,
  age INT,
  level TEXT DEFAULT 'Level 1',
  current_month INT DEFAULT 1,
  current_week INT DEFAULT 1,
  current_day INT DEFAULT 1,
  school_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_children_updated_at BEFORE UPDATE ON public.children FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== PARENT CHILD LINKS =====
CREATE TABLE public.parent_child_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  relation_label TEXT DEFAULT 'Parent',
  is_active BOOLEAN DEFAULT true,
  linked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(parent_profile_id, child_id)
);
ALTER TABLE public.parent_child_links ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can read own links" ON public.parent_child_links FOR SELECT USING (auth.uid() = parent_profile_id);
CREATE POLICY "Parents can create links" ON public.parent_child_links FOR INSERT WITH CHECK (auth.uid() = parent_profile_id);
CREATE POLICY "Parents can update own links" ON public.parent_child_links FOR UPDATE USING (auth.uid() = parent_profile_id);

CREATE POLICY "Parents can view linked children" ON public.children FOR SELECT
USING (EXISTS (SELECT 1 FROM public.parent_child_links WHERE child_id = children.id AND parent_profile_id = auth.uid()));

-- ===== STUDENT PROGRESS =====
CREATE TABLE public.student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE UNIQUE,
  current_level TEXT DEFAULT 'Level 1',
  current_month INT DEFAULT 1,
  current_week INT DEFAULT 1,
  current_day INT DEFAULT 1,
  total_lessons_completed INT DEFAULT 0,
  total_speaking_attempts INT DEFAULT 0,
  total_reading_sessions INT DEFAULT 0,
  total_minutes_spent INT DEFAULT 0,
  streak_days INT DEFAULT 0,
  pronunciation_score NUMERIC(5,2),
  phonics_score NUMERIC(5,2),
  vocabulary_score NUMERIC(5,2),
  fluency_score NUMERIC(5,2),
  confidence_score NUMERIC(5,2),
  weak_sounds JSONB DEFAULT '[]',
  weak_words JSONB DEFAULT '[]',
  strong_areas JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.student_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can view linked child progress" ON public.student_progress FOR SELECT
USING (EXISTS (SELECT 1 FROM public.parent_child_links WHERE child_id = student_progress.child_id AND parent_profile_id = auth.uid()));
CREATE TRIGGER update_student_progress_updated_at BEFORE UPDATE ON public.student_progress FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== ATTENDANCE RECORDS =====
CREATE TABLE public.attendance_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  attendance_date DATE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('attended','missed','pending')),
  class_type TEXT,
  session_title TEXT,
  minutes_attended INT DEFAULT 0,
  reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(child_id, attendance_date)
);
ALTER TABLE public.attendance_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can view linked child attendance" ON public.attendance_records FOR SELECT
USING (EXISTS (SELECT 1 FROM public.parent_child_links WHERE child_id = attendance_records.child_id AND parent_profile_id = auth.uid()));

-- ===== LESSON ACTIVITY =====
CREATE TABLE public.lesson_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  activity_date DATE NOT NULL,
  activity_type TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  lesson_day INT,
  duration_minutes INT,
  score NUMERIC(5,2),
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.lesson_activity ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can view linked child activities" ON public.lesson_activity FOR SELECT
USING (EXISTS (SELECT 1 FROM public.parent_child_links WHERE child_id = lesson_activity.child_id AND parent_profile_id = auth.uid()));

-- ===== CURRICULUM DAYS =====
CREATE TABLE public.curriculum_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL,
  month_number INT NOT NULL,
  week_number INT NOT NULL,
  day_number INT NOT NULL,
  class_title TEXT NOT NULL,
  objective TEXT,
  target_skills JSONB DEFAULT '[]',
  target_content JSONB DEFAULT '[]',
  lesson_parts JSONB DEFAULT '[]',
  home_practice TEXT,
  praise_line TEXT,
  estimated_duration_minutes INT DEFAULT 30,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.curriculum_days ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated users can view curriculum" ON public.curriculum_days FOR SELECT TO authenticated USING (true);

-- ===== CHILD SCHEDULE =====
CREATE TABLE public.child_schedule (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  curriculum_day_id UUID NOT NULL REFERENCES public.curriculum_days(id),
  scheduled_date DATE NOT NULL,
  class_status TEXT NOT NULL DEFAULT 'scheduled' CHECK (class_status IN ('scheduled','completed','missed','pending')),
  assigned_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(child_id, scheduled_date)
);
ALTER TABLE public.child_schedule ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can view linked child schedule" ON public.child_schedule FOR SELECT
USING (EXISTS (SELECT 1 FROM public.parent_child_links WHERE child_id = child_schedule.child_id AND parent_profile_id = auth.uid()));

-- ===== PERFORMANCE SNAPSHOTS =====
CREATE TABLE public.performance_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  snapshot_date DATE NOT NULL,
  period_type TEXT NOT NULL CHECK (period_type IN ('daily','weekly','monthly')),
  pronunciation_score NUMERIC(5,2),
  phonics_score NUMERIC(5,2),
  vocabulary_score NUMERIC(5,2),
  fluency_score NUMERIC(5,2),
  confidence_score NUMERIC(5,2),
  attendance_percentage NUMERIC(5,2),
  lessons_completed INT DEFAULT 0,
  time_spent_minutes INT DEFAULT 0,
  speaking_attempts INT DEFAULT 0,
  reading_sessions INT DEFAULT 0,
  weak_sounds JSONB DEFAULT '[]',
  weak_words JSONB DEFAULT '[]',
  summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.performance_snapshots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can view linked child snapshots" ON public.performance_snapshots FOR SELECT
USING (EXISTS (SELECT 1 FROM public.parent_child_links WHERE child_id = performance_snapshots.child_id AND parent_profile_id = auth.uid()));

-- ===== WEEKLY REPORTS =====
CREATE TABLE public.weekly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  week_label TEXT NOT NULL,
  summary TEXT,
  strengths JSONB DEFAULT '[]',
  improvement_areas JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  confidence_note TEXT,
  premium_insights JSONB,
  report_status TEXT DEFAULT 'ready',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.weekly_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can view linked child weekly reports" ON public.weekly_reports FOR SELECT
USING (EXISTS (SELECT 1 FROM public.parent_child_links WHERE child_id = weekly_reports.child_id AND parent_profile_id = auth.uid()));

-- ===== MONTHLY REPORTS =====
CREATE TABLE public.monthly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  month_label TEXT NOT NULL,
  summary TEXT,
  strengths JSONB DEFAULT '[]',
  improvement_areas JSONB DEFAULT '[]',
  recommendations JSONB DEFAULT '[]',
  premium_insights JSONB,
  attendance_percentage NUMERIC(5,2),
  lessons_completed INT DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.monthly_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can view linked child monthly reports" ON public.monthly_reports FOR SELECT
USING (EXISTS (SELECT 1 FROM public.parent_child_links WHERE child_id = monthly_reports.child_id AND parent_profile_id = auth.uid()));

-- ===== SUBSCRIPTIONS =====
CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL DEFAULT 'Freemium',
  billing_cycle_months INT DEFAULT 0,
  status TEXT DEFAULT 'active',
  start_date DATE,
  expiry_date DATE,
  level_access JSONB DEFAULT '["Level 1"]',
  is_premium BOOLEAN DEFAULT false,
  payment_status TEXT DEFAULT 'none',
  razorpay_customer_id TEXT,
  razorpay_subscription_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can view linked child subscriptions" ON public.subscriptions FOR SELECT
USING (EXISTS (SELECT 1 FROM public.parent_child_links WHERE child_id = subscriptions.child_id AND parent_profile_id = auth.uid()));
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON public.subscriptions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ===== PAYMENT TRANSACTIONS =====
CREATE TABLE public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  payment_status TEXT DEFAULT 'pending',
  payment_method TEXT,
  paid_at TIMESTAMPTZ,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can view linked child payments" ON public.payment_transactions FOR SELECT
USING (EXISTS (SELECT 1 FROM public.parent_child_links WHERE child_id = payment_transactions.child_id AND parent_profile_id = auth.uid()));

-- ===== BILLING HISTORY =====
CREATE TABLE public.billing_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID NOT NULL REFERENCES public.children(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES public.subscriptions(id),
  invoice_number TEXT,
  invoice_url TEXT,
  amount NUMERIC(10,2) NOT NULL,
  currency TEXT DEFAULT 'INR',
  payment_date TIMESTAMPTZ,
  payment_status TEXT DEFAULT 'paid',
  payment_provider TEXT DEFAULT 'razorpay',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.billing_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can view linked child billing" ON public.billing_history FOR SELECT
USING (EXISTS (SELECT 1 FROM public.parent_child_links WHERE child_id = billing_history.child_id AND parent_profile_id = auth.uid()));

-- ===== SUPPORT REQUESTS =====
CREATE TABLE public.support_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  child_id UUID REFERENCES public.children(id),
  issue_type TEXT,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can view own support requests" ON public.support_requests FOR SELECT USING (auth.uid() = parent_profile_id);
CREATE POLICY "Parents can create support requests" ON public.support_requests FOR INSERT WITH CHECK (auth.uid() = parent_profile_id);

-- ===== PARENT NOTIFICATIONS =====
CREATE TABLE public.parent_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  child_id UUID REFERENCES public.children(id),
  title TEXT NOT NULL,
  body TEXT,
  category TEXT,
  notification_type TEXT,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.parent_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can read own notifications" ON public.parent_notifications FOR SELECT USING (auth.uid() = parent_profile_id);
CREATE POLICY "Parents can update own notifications" ON public.parent_notifications FOR UPDATE USING (auth.uid() = parent_profile_id);

-- ===== APP SETTINGS =====
CREATE TABLE public.app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone authenticated can read settings" ON public.app_settings FOR SELECT TO authenticated USING (true);

-- ===== INDEXES =====
CREATE INDEX idx_attendance_child_date ON public.attendance_records(child_id, attendance_date);
CREATE INDEX idx_lesson_activity_child_date ON public.lesson_activity(child_id, activity_date);
CREATE INDEX idx_child_schedule_child_date ON public.child_schedule(child_id, scheduled_date);
CREATE INDEX idx_performance_child_date ON public.performance_snapshots(child_id, snapshot_date);
CREATE INDEX idx_notifications_parent ON public.parent_notifications(parent_profile_id, read);
CREATE INDEX idx_children_code ON public.children(child_code);