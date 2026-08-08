-- Citations & source storage (run after setup.sql)
-- Enables flashcard source excerpts and full deck source for regeneration/chat

alter table public.decks
  add column if not exists source_text text;

alter table public.flashcards
  add column if not exists source_excerpt text,
  add column if not exists source_section text;

comment on column public.decks.source_text is 'Full parsed source material for RAG and card regeneration';
comment on column public.flashcards.source_excerpt is 'Verbatim quote from source supporting this card';
comment on column public.flashcards.source_section is 'Human-readable location e.g. page 4, section 2.1';
