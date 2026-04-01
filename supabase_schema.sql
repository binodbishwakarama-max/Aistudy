-- Enable pgvector for embeddings (RAG)
create extension if not exists vector;

-- 1. Profiles (Users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  email text unique not null,
  full_name text,
  username text unique,
  avatar_url text,
  settings jsonb default '{"daily_goal": 20, "srs_enabled": true}',
  stats jsonb default '{"total_xp": 0, "streak": 0, "level": 1, "cards_mastered": 0}',
  created_at timestamptz default now()
);

-- 2. Decks (Study Sets)
create table public.decks (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  description text,
  is_public boolean default false,
  card_count integer default 0,
  question_count integer default 0,
  tags text[], 
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. Flashcards (The Core Content)
create table public.flashcards (
  id uuid default gen_random_uuid() primary key,
  deck_id uuid references public.decks(id) on delete cascade not null,
  front text not null, -- The Question
  back text not null,  -- The Answer
  explanation text,    -- AI generated context
  
  -- Spaced Repetition (SM-2) Fields
  srs_level integer default 0,    -- Box number (0-5)
  srs_ease_factor float default 2.5, -- Multiplier
  srs_interval integer default 0, -- Days until next review
  next_review_at timestamptz default now(), -- The date it is due
  
  created_at timestamptz default now()
);

-- 4. Quiz Questions
create table public.quiz_questions (
  id uuid default gen_random_uuid() primary key,
  deck_id uuid references public.decks(id) on delete cascade not null,
  prompt text not null,
  options text[] not null check (array_length(options, 1) = 4),
  correct_index integer not null check (correct_index between 0 and 3),
  explanation text,
  created_at timestamptz default now()
);

-- 5. Note Chunks (For RAG / Chat with PDF)
create table public.note_chunks (
  id uuid default gen_random_uuid() primary key,
  deck_id uuid references public.decks(id) on delete cascade not null,
  content text not null,
  embedding vector(1536), -- Compatible with OpenAI/Gemini embeddings
  metadata jsonb,
  created_at timestamptz default now()
);

-- 6. Study Sessions (Analytics)
create table public.study_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  deck_id uuid references public.decks(id) on delete set null,
  mode text check (mode in ('flashcard', 'quiz', 'srs')),
  duration_seconds integer default 0,
  cards_reviewed integer default 0,
  correct_count integer default 0,
  xp_earned integer default 0,
  started_at timestamptz default now()
);

-- RLS Policies (Security)
alter table public.profiles enable row level security;
alter table public.decks enable row level security;
alter table public.flashcards enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.note_chunks enable row level security;
alter table public.study_sessions enable row level security;

-- Allow users to see only their own data
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

create policy "Users can view own decks" on public.decks for select using (auth.uid() = user_id);
create policy "Users can insert own decks" on public.decks for insert with check (auth.uid() = user_id);
create policy "Users can update own decks" on public.decks for update using (auth.uid() = user_id);
create policy "Users can delete own decks" on public.decks for delete using (auth.uid() = user_id);

-- Similar policies for cards, chunks, sessions...
create policy "Users can manage own cards" on public.flashcards for all using (
  exists (select 1 from public.decks where id = flashcards.deck_id and user_id = auth.uid())
);

create policy "Users can manage own quiz questions" on public.quiz_questions for all using (
  exists (select 1 from public.decks where id = quiz_questions.deck_id and user_id = auth.uid())
);

create policy "Users can manage own note chunks" on public.note_chunks for all using (
  exists (select 1 from public.decks where id = note_chunks.deck_id and user_id = auth.uid())
);
