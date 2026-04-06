
-- Fix: Allow any authenticated user to look up children by child_code for linking
CREATE POLICY "Authenticated can lookup children by code"
ON public.children FOR SELECT TO authenticated
USING (true);

-- Drop the old restrictive policy
DROP POLICY IF EXISTS "Parents can view linked children" ON public.children;

-- Re-create the old policy name but keep the permissive one above
-- Actually we want: parents can see all children (needed for lookup), 
-- but RLS on other tables still restricts via parent_child_links

-- Add seed notifications
INSERT INTO public.parent_notifications (parent_profile_id, child_id, title, body, category, notification_type, read, created_at)
SELECT 
  pcl.parent_profile_id,
  pcl.child_id,
  n.title,
  n.body,
  n.category,
  n.notification_type,
  n.read,
  n.created_at
FROM (VALUES
  ('Aarav completed Day 12 speaking practice', 'Great progress on vowel sounds today.', 'learning', 'lesson_complete', false, now() - interval '1 hour'),
  ('Weekly report is ready', 'Check Week 3 performance summary for Aarav.', 'report', 'report_ready', false, now() - interval '1 day'),
  ('Missed today''s session', 'Aarav did not attend today''s PIXO class.', 'attendance', 'missed_class', true, now() - interval '3 days'),
  ('Streak milestone reached', 'Aarav has maintained a 5-day learning streak!', 'achievement', 'streak', true, now() - interval '5 days'),
  ('Subscription reminder', '12 days remaining on your Premium plan.', 'billing', 'subscription_expiry', false, now() - interval '2 days')
) AS n(title, body, category, notification_type, read, created_at)
CROSS JOIN (
  SELECT parent_profile_id, child_id FROM parent_child_links LIMIT 1
) pcl
WHERE EXISTS (SELECT 1 FROM parent_child_links);
