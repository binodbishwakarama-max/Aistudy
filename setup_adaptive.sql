-- ==============================================================================
-- PHASE 5: ADAPTIVE QUIZ ENGINE
-- Run this in Supabase SQL Editor to enable adaptive quiz functionality.
-- ==============================================================================

-- 1. Topic mastery scores per user
-- Tracks how well a user knows each topic based on quiz performance.
CREATE TABLE IF NOT EXISTS public.topic_scores (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  topic text NOT NULL,
  score float DEFAULT 0.5,       -- 0.0 = completely weak, 1.0 = fully mastered
  attempts integer DEFAULT 0,
  correct integer DEFAULT 0,
  updated_at timestamptz DEFAULT timezone('utc'::text, now()),
  UNIQUE(user_id, topic)
);

-- 2. Enable RLS
ALTER TABLE public.topic_scores ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY "Users can view their own topic scores"
  ON public.topic_scores FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own topic scores"
  ON public.topic_scores FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own topic scores"
  ON public.topic_scores FOR UPDATE
  USING (auth.uid() = user_id);

-- 4. Add topics array column to flashcards for AI-tagged topic metadata
ALTER TABLE public.flashcards
  ADD COLUMN IF NOT EXISTS topics text[] DEFAULT '{}';
