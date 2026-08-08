-- Study sessions analytics (run after setup.sql)
create table if not exists public.study_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  deck_id uuid references public.decks(id) on delete set null,
  mode text not null check (mode in ('flashcard', 'quiz', 'srs', 'adaptive')),
  duration_seconds integer default 0,
  cards_reviewed integer default 0,
  correct_count integer default 0,
  xp_earned integer default 0,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.study_sessions enable row level security;

create policy "Users can view own study sessions"
  on public.study_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert own study sessions"
  on public.study_sessions for insert
  with check (auth.uid() = user_id);

create index if not exists study_sessions_user_started_idx
  on public.study_sessions (user_id, started_at desc);
