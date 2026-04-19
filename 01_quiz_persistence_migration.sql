-- ==============================================================================
-- MIGRATION: Quiz Persistence Validation
-- Run this in your Supabase SQL Editor.
-- This ensures 'quiz_questions' table exists and 'decks' table has 'question_count'.
-- ==============================================================================

-- 1. Add question_count to decks table if it does not exist
ALTER TABLE public.decks 
ADD COLUMN IF NOT EXISTS question_count integer default 0;

-- 2. Create quiz_questions table if it does not exist
CREATE TABLE IF NOT EXISTS public.quiz_questions (
  id uuid default gen_random_uuid() primary key,
  deck_id uuid references public.decks(id) on delete cascade not null,
  prompt text not null,
  options text[] not null check (array_length(options, 1) = 4),
  correct_index integer not null check (correct_index between 0 and 3),
  explanation text,
  created_at timestamptz default now()
);

-- 3. Enable RLS on quiz_questions
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;

-- 4. Safely recreate Policies for quiz_questions
-- We drop existing ones to make the script idempotent without errors
DROP POLICY IF EXISTS "Users can manage own quiz questions" ON public.quiz_questions;
DROP POLICY IF EXISTS "Users can view their own quiz questions" ON public.quiz_questions;
DROP POLICY IF EXISTS "Users can insert their own quiz questions" ON public.quiz_questions;
DROP POLICY IF EXISTS "Users can update their own quiz questions" ON public.quiz_questions;
DROP POLICY IF EXISTS "Users can delete their own quiz questions" ON public.quiz_questions;

CREATE POLICY "Users can manage own quiz questions" ON public.quiz_questions
  FOR ALL
  USING (
    exists (select 1 from public.decks where id = quiz_questions.deck_id and user_id = auth.uid())
  );
