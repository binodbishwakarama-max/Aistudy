-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- 1. Create 'decks' table
create table if not exists public.decks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text default 'Untitled Deck',
  description text,
  card_count integer default 0,
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

-- 3. Enable Row Level Security (RLS)
alter table public.decks enable row level security;
alter table public.flashcards enable row level security;

-- 4. Create Policies for Decks
create policy "Users can view their own decks"
  on public.decks for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own decks"
  on public.decks for insert
  with check ( auth.uid() = user_id );

create policy "Users can delete their own decks"
  on public.decks for delete
  using ( auth.uid() = user_id );

-- 5. Create Policies for Flashcards
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
