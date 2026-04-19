-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- 1. Create 'decks' table
create table if not exists public.decks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text default 'Untitled Deck',
  description text,
  card_count integer default 0,
  question_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create 'flashcards' table
create table if not exists public.flashcards (
  id uuid default uuid_generate_v4() primary key,
  deck_id uuid references public.decks(id) on delete cascade not null,
  front text not null,
  back text not null,
  explanation text,
  
  -- Spaced Repetition Fields
  srs_interval integer default 0,
  srs_ease_factor float default 2.5,
  srs_repetitions integer default 0,
  next_review_at timestamp with time zone default timezone('utc'::text, now()),
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create 'quiz_questions' table
create table if not exists public.quiz_questions (
  id uuid default uuid_generate_v4() primary key,
  deck_id uuid references public.decks(id) on delete cascade not null,
  prompt text not null,
  options text[] not null check (array_length(options, 1) = 4),
  correct_index integer not null check (correct_index between 0 and 3),
  explanation text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Enable Row Level Security (RLS)
alter table public.decks enable row level security;
alter table public.flashcards enable row level security;
alter table public.quiz_questions enable row level security;

-- 5. Create Policies for Decks
create policy "Users can view their own decks"
  on public.decks for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own decks"
  on public.decks for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own decks"
  on public.decks for delete
  using ( auth.uid() = user_id );

-- 6. Create Policies for Flashcards
-- (Simple approach: If you own the deck, you own the cards)
create policy "Users can view their own flashcards"
  on public.flashcards for select
  using ( exists ( select 1 from public.decks where decks.id = flashcards.deck_id and decks.user_id = auth.uid() ) );

create policy "Users can insert their own flashcards"
  on public.flashcards for insert
  with check ( exists ( select 1 from public.decks where decks.id = deck_id and decks.user_id = auth.uid() ) );

create policy "Users can update their own flashcards"
  on public.flashcards for update
  using ( exists ( select 1 from public.decks where decks.id = deck_id and decks.user_id = auth.uid() ) );

create policy "Users can delete their own flashcards"
  on public.flashcards for delete
  using ( exists ( select 1 from public.decks where decks.id = deck_id and decks.user_id = auth.uid() ) );

-- 7. Create Policies for Quiz Questions
create policy "Users can view their own quiz questions"
  on public.quiz_questions for select
  using ( exists ( select 1 from public.decks where decks.id = quiz_questions.deck_id and decks.user_id = auth.uid() ) );

create policy "Users can insert their own quiz questions"
  on public.quiz_questions for insert
  with check ( exists ( select 1 from public.decks where decks.id = deck_id and decks.user_id = auth.uid() ) );

create policy "Users can update their own quiz questions"
  on public.quiz_questions for update
  using ( exists ( select 1 from public.decks where decks.id = deck_id and decks.user_id = auth.uid() ) );

create policy "Users can delete their own quiz questions"
  on public.quiz_questions for delete
  using ( exists ( select 1 from public.decks where decks.id = deck_id and decks.user_id = auth.uid() ) );

-- 8. Create 'user_stats' table (Gamification)
create table if not exists public.user_stats (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null unique,
  xp integer default 0,
  level integer default 1,
  streak integer default 0,
  last_active date,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Enable RLS for user_stats
alter table public.user_stats enable row level security;

-- 10. Create Policies for user_stats
create policy "Users can view their own stats"
  on public.user_stats for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own stats"
  on public.user_stats for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own stats"
  on public.user_stats for update
  using ( auth.uid() = user_id );

-- ==============================================================================
-- PHASE 4: SEMANTIC SEARCH (PGVECTOR)
-- Run this section to enable semantic search across your flashcards.
-- ==============================================================================

-- 11. Enable the pgvector extension natively in Supabase
create extension if not exists vector;

-- 12. Add the 768-dimensional embedding column (matches Gemini text-embedding-004)
alter table public.flashcards 
add column if not exists embedding vector(768);

-- 13. Create a Postgres function to search flashcards by Cosine Distance
-- Note: This function respects RLS! It will only return decks owned by the query_user_id.
create or replace function match_flashcards (
  query_embedding vector(768),
  match_threshold float,
  match_count int,
  query_user_id uuid
)
returns table (
  id uuid,
  deck_id uuid,
  front text,
  back text,
  explanation text,
  similarity float
)
language sql stable
as $$
  select
    flashcards.id,
    flashcards.deck_id,
    flashcards.front,
    flashcards.back,
    flashcards.explanation,
    1 - (flashcards.embedding <=> query_embedding) as similarity
  from public.flashcards
  join public.decks on decks.id = flashcards.deck_id
  where decks.user_id = query_user_id
    and flashcards.embedding is not null
    and 1 - (flashcards.embedding <=> query_embedding) > match_threshold
  order by flashcards.embedding <=> query_embedding
  limit match_count;
$$;
