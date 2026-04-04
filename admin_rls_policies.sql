-- ============================================================
-- ADMIN RLS POLICIES for asadaweis05@gmail.com
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================

-- Admin can read ALL courses (including unpublished drafts)
CREATE POLICY "Admin read all courses" ON public.lp_courses
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'email' = 'asadaweis05@gmail.com');

-- Admin full CRUD on courses
CREATE POLICY "Admin manage courses" ON public.lp_courses
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'asadaweis05@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'asadaweis05@gmail.com');

-- Admin full CRUD on lessons  
CREATE POLICY "Admin manage lessons" ON public.lp_lessons
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'asadaweis05@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'asadaweis05@gmail.com');

-- Admin full CRUD on categories
CREATE POLICY "Admin manage categories" ON public.lp_categories
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'asadaweis05@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'asadaweis05@gmail.com');
