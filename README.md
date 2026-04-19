# MindFlow 2.0 - Advanced AI Study Assistant

An intelligent study companion that turns your lecture notes and PDFs into interactive flashcards and quizzes using AI. MindFlow 2.0 represents a huge architectural leap from synchronous processing to an asynchronous, stateful, and adaptive learning platform.

## 🚀 Key Features
- **Semantic Search (RAG)**: Uses Supabase `pgvector` to find insights across your entire knowledge base instantly using 768-dimensional AI embeddings.
- **Spaced Repetition (SM-2)**: Smartly schedules your flashcard reviews so you review weak concepts earlier and strong concepts later.
- **Adaptive Quiz Engine**: Automatically downshifts and upshifts multiple-choice question difficulty in real-time based on concept mastery scores.
- **Asynchronous AI Queue**: Document processing (BullMQ + Redis) happens in the background, keeping the user interface fast and unblocked. If Redis fails, gracefully falls back to synchronous processing!
- **AI Reliability**: Automatically falls back between **Google Gemini (Llama 3)** and **Groq** if rate limits hit.
- **Gamification**: XP, level-ups, and daily study streaks built-in to keep you motivated.

## 🛠️ Setup & Run

### 1. Prerequisites
- [Supabase](https://supabase.com) Project (Run `setup.sql`, `supabase_schema.sql`, and `setup_adaptive.sql`)
- [Upstash Redis](https://upstash.com/) Database URL
- Google Gemini API Key and/or Groq API Key

### 2. Backend (Server)
The server handles AI generation and asynchronous jobs.
```bash
cd server
npm install
node index.js
```
*Runs on http://localhost:3000*

**Environment Variables (.env)** `server/.env`:
```
PORT=3000
JWT_SECRET=your-secret-key
GEMINI_API_KEY=AI...
GROQ_API_KEY=gsk_...
SUPABASE_URL=https://...supabase.co
SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
REDIS_URL=rediss://...upstash.io:6379
```

### 3. Frontend (Client)
The React application via Vite.
```bash
cd client
npm install
npm run dev
```
*Runs on http://localhost:5173*

**Environment Variables (.env)** `client/.env`:
```
VITE_API_URL=http://localhost:3000/api
VITE_SUPABASE_URL=https://...supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

## 📚 Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express, BullMQ
- **AI Models**: Google Gemini (text & embedding), Groq (Llama 3 fallback)
- **Database**: Supabase (PostgreSQL + pgvector for Embeddings)
- **Queue/Cache**: Upstash (Serverless Redis)
- **Auth**: Supabase Auth + JWT

## 📝 Usage
1. Open the app at `http://localhost:5173`.
2. **Login/Register** to save progress.
3. Upload study notes or PDFs.
4. **Adaptive Quiz Mode** automatically adapts to what you know.
5. Review flashcards regularly to engage the **Spaced Repetition** engine.
