-- ==============================================================================
-- DSU HUB: PREVIOUS YEAR QUESTIONS (PYQs) & EXAM GUIDANCE ARCHIVE
-- Run this in Supabase Dashboard -> SQL Editor to initialize DSU Hub tables.
-- ==============================================================================

-- 1. Create Branches Table
CREATE TABLE IF NOT EXISTS public.branches (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  description text,
  icon text DEFAULT 'BookOpen',
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Semesters Table
CREATE TABLE IF NOT EXISTS public.semesters (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  branch_id uuid REFERENCES public.branches(id) ON DELETE CASCADE NOT NULL,
  number integer NOT NULL CHECK (number >= 1 AND number <= 8),
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(branch_id, number)
);

-- 3. Create Subjects Table
CREATE TABLE IF NOT EXISTS public.subjects (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  semester_id uuid REFERENCES public.semesters(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  code text NOT NULL,
  slug text NOT NULL,
  credits integer DEFAULT 4,
  created_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(semester_id, code)
);

-- 4. Create PYQs (Question Papers) Table
CREATE TABLE IF NOT EXISTS public.pyqs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id uuid REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  year integer NOT NULL,
  exam_type text NOT NULL CHECK (exam_type IN ('mid1', 'mid2', 'end_sem', 'other')),
  file_url text NOT NULL,
  file_size_kb integer DEFAULT 0,
  uploaded_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Subject Guidance Notes Table
CREATE TABLE IF NOT EXISTS public.subject_guidance (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  subject_id uuid REFERENCES public.subjects(id) ON DELETE CASCADE NOT NULL UNIQUE,
  notes text NOT NULL,
  passing_tips text,
  high_yield_topics text[],
  updated_at timestamptz DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Public SELECT: All users & search engine crawlers can read DSU Hub freely.
-- Admin Write: Restricted to service_role or admin users.
-- ==============================================================================

ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pyqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subject_guidance ENABLE ROW LEVEL SECURITY;

-- Public read policies
CREATE POLICY "Public read access on branches" ON public.branches FOR SELECT USING (true);
CREATE POLICY "Public read access on semesters" ON public.semesters FOR SELECT USING (true);
CREATE POLICY "Public read access on subjects" ON public.subjects FOR SELECT USING (true);
CREATE POLICY "Public read access on pyqs" ON public.pyqs FOR SELECT USING (true);
CREATE POLICY "Public read access on subject_guidance" ON public.subject_guidance FOR SELECT USING (true);

-- Indexes for lightning-fast queries & SEO joins
CREATE INDEX IF NOT EXISTS idx_branches_slug ON public.branches(slug);
CREATE INDEX IF NOT EXISTS idx_semesters_branch_num ON public.semesters(branch_id, number);
CREATE INDEX IF NOT EXISTS idx_subjects_semester_code ON public.subjects(semester_id, code);
CREATE INDEX IF NOT EXISTS idx_pyqs_subject_year ON public.pyqs(subject_id, year DESC);
CREATE INDEX IF NOT EXISTS idx_guidance_subject ON public.subject_guidance(subject_id);

-- ==============================================================================
-- STORAGE BUCKET: pyqs (Public Read, Authenticated/Service Role Write)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('pyqs', 'pyqs', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public read access on pyqs bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'pyqs');
