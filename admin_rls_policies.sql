-- ============================================================
-- ADMIN RLS POLICIES for asadaweis05@gmail.com
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard)
-- ============================================================

-- 1. Admin can read ALL courses (including unpublished drafts)
DROP POLICY IF EXISTS "Admin read all courses" ON public.lp_courses;
CREATE POLICY "Admin read all courses" ON public.lp_courses
  FOR SELECT TO authenticated
  USING (auth.jwt() ->> 'email' = 'asadaweis05@gmail.com');

-- 2. Admin full CRUD on courses
DROP POLICY IF EXISTS "Admin manage courses" ON public.lp_courses;
CREATE POLICY "Admin manage courses" ON public.lp_courses
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'asadaweis05@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'asadaweis05@gmail.com');

-- 3. Admin full CRUD on lessons  
DROP POLICY IF EXISTS "Admin manage lessons" ON public.lp_lessons;
CREATE POLICY "Admin manage lessons" ON public.lp_lessons
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'asadaweis05@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'asadaweis05@gmail.com');

-- 4. Admin full CRUD on categories
DROP POLICY IF EXISTS "Admin manage categories" ON public.lp_categories;
CREATE POLICY "Admin manage categories" ON public.lp_categories
  FOR ALL TO authenticated
  USING (auth.jwt() ->> 'email' = 'asadaweis05@gmail.com')
  WITH CHECK (auth.jwt() ->> 'email' = 'asadaweis05@gmail.com');
