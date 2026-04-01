alter table public.decks
add column if not exists question_count integer default 0;

create table if not exists public.quiz_questions (
  id uuid default gen_random_uuid() primary key,
  deck_id uuid references public.decks(id) on delete cascade not null,
  prompt text not null,
  options text[] not null check (array_length(options, 1) = 4),
  correct_index integer not null check (correct_index between 0 and 3),
  explanation text,
  created_at timestamptz default now()
);

alter table public.quiz_questions enable row level security;

drop policy if exists "Users can manage own quiz questions" on public.quiz_questions;
create policy "Users can manage own quiz questions"
  on public.quiz_questions
  for all
  using (
    exists (
      select 1
      from public.decks
      where id = quiz_questions.deck_id
      and user_id = auth.uid()
    )
  );
