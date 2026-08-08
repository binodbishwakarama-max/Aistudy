# MindFlow database migrations

Run these **in order** on your Supabase project (SQL Editor).

| Order | File | Purpose |
|-------|------|---------|
| 1 | `setup.sql` | Core tables, RLS, pgvector search |
| 2 | `setup_adaptive.sql` | Topic scores, adaptive quiz |
| 3 | `setup_study_sessions.sql` | Session analytics (heatmap, weekly charts) |
| 4 | `setup_citations.sql` | Source text, flashcard citations |

## Quick verify

After running migrations 3–4:

```sql
select column_name from information_schema.columns
where table_name = 'study_sessions';

select column_name from information_schema.columns
where table_name = 'flashcards' and column_name in ('source_excerpt', 'source_section');

select column_name from information_schema.columns
where table_name = 'decks' and column_name = 'source_text';
```

## Production checklist

- [ ] All four migration files applied
- [ ] `GEMINI_API_KEY` or `GROQ_API_KEY` set on API server
- [ ] `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` on frontend
- [ ] `VITE_API_URL` points to deployed API `/api`
