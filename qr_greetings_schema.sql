-- ============================================================
-- QR GREETINGS & EMOTIONAL PAGES — Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. QR Pages
CREATE TABLE IF NOT EXISTS public.qr_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('romantic','birthday','apology','friendship','casual','eid','motivational')),
  message TEXT NOT NULL,
  sender_name TEXT,
  recipient_name TEXT,
  music_url TEXT,
  images TEXT[] DEFAULT '{}',
  theme TEXT DEFAULT 'midnight' CHECK (theme IN ('midnight','rose','ocean','sunset','aurora')),
  is_premium BOOLEAN DEFAULT false,
  is_private BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. QR Page Views (analytics)
CREATE TABLE IF NOT EXISTS public.qr_page_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID REFERENCES public.qr_pages(id) ON DELETE CASCADE,
  viewed_at TIMESTAMPTZ DEFAULT now(),
  referrer TEXT,
  user_agent TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_qr_pages_slug ON public.qr_pages(slug);
CREATE INDEX IF NOT EXISTS idx_qr_pages_user ON public.qr_pages(user_id);
CREATE INDEX IF NOT EXISTS idx_qr_page_views_page ON public.qr_page_views(page_id);

-- RLS
ALTER TABLE public.qr_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qr_page_views ENABLE ROW LEVEL SECURITY;

-- Anyone can read pages (for the experience viewer)
CREATE POLICY "Public read qr_pages" ON public.qr_pages FOR SELECT USING (true);

-- Authenticated users can insert their own pages
CREATE POLICY "Users insert own qr_pages" ON public.qr_pages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Authenticated users can update their own pages
CREATE POLICY "Users update own qr_pages" ON public.qr_pages FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Authenticated users can delete their own pages
CREATE POLICY "Users delete own qr_pages" ON public.qr_pages FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Anyone can insert view records (anonymous viewers)
CREATE POLICY "Anyone insert views" ON public.qr_page_views FOR INSERT WITH CHECK (true);

-- Page owners can read views of their pages
CREATE POLICY "Public read views" ON public.qr_page_views FOR SELECT USING (true);

-- Function: increment view count
CREATE OR REPLACE FUNCTION public.increment_qr_view_count(page_slug TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE public.qr_pages SET view_count = view_count + 1 WHERE slug = page_slug;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
