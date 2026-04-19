# Deployment Guide 🚀

This guide will help you deploy your **MindFlow 2.0** application to the web so anyone can use it. With the MindFlow 2.0 architecture, the app relies on robust cloud infrastructure.

## 🏗️ Architecture Stack
- **Frontend**: React (Vite) -> Deploy on **Vercel**
- **Backend**: Node.js (Express) -> Deploy on **Render** (or Railway/Fly.io)
- **Database / Auth / Vector Store**: **Supabase** (PostgreSQL + pgvector)
- **Background Queue / Cache**: **Upstash** (Serverless Redis)
- **AI Providers**: **Gemini** (Primary) & **Groq** (Fallback)

---

## Part 1: Infrastructure Setup

### 1. Supabase (Database & Auth)
1. Go to [Supabase](https://supabase.com) and create a new project.
2. Under **Project Settings -> Database**, get your `Connection String` (URI).
3. Under **Project Settings -> API**, get your `Project URL` and `anon public` key.
4. Go to **SQL Editor** in Supabase and run the migration scripts in order:
    - `setup.sql` 
    - `supabase_schema.sql`
    - `setup_adaptive.sql`
5. Ensure Email Auth is enabled under **Authentication -> Providers**.

### 2. Upstash (Redis Queue)
1. Go to [Upstash](https://upstash.com) and create a new Redis database.
2. Select a region close to your backend Server (e.g., if Render is in US East, pick US East).
3. Copy the URL that starts with `rediss://...`.

---

## Part 2: Backend Deployment (Render)

1. **Push to GitHub**
   - Make sure your project is pushed to a GitHub repository.

2. **Create Web Service on Render**
   - Go to [render.com](https://render.com) and Sign Up/Login.
   - Click **"New +" -> "Web Service"**.
   - Connect your GitHub repository.

3. **Configure Service**
   - **Name**: `mindflow-api`
   - **Root Directory**: `server`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`

4. **Environment Variables**
   - Add the following variables:
     - `GROQ_API_KEY`: *(Your Groq API Key)*
     - `GEMINI_API_KEY`: *(Your Google/Gemini API Key)*
     - `SUPABASE_URL`: *(Your Supabase Project URL)*
     - `SUPABASE_ANON_KEY`: *(Your Supabase Anon Public Key)*
     - `SUPABASE_SERVICE_ROLE_KEY`: *(Essential for admin auth/DB write actions in the backend)*
     - `REDIS_URL`: *(Your Upstash rediss:// URL)*
     - `JWT_SECRET`: *(A long random string)*
     - `PORT`: `3000` 

5. **Deploy**
   - Click **"Create Web Service"**.
   - Once it's live, copy the URL (e.g., `https://mindflow-api.onrender.com`).

---

## Part 3: Frontend Deployment (Vercel)

1. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com) and click **"Add New..." -> "Project"**.
   - Import your GitHub repository.

2. **Configure Project**
   - **Framework Preset**: Vite (Should detect automatically)
   - **Root Directory**: Click "Edit" and select `client`.

3. **Environment Variables**
   - Add the following variables:
     - `VITE_API_URL`: **(IMPORTANT: Use the Render Backend URL from Part 2 + `/api`. Example: `https://mindflow-api.onrender.com/api`)**
     - `VITE_SUPABASE_URL`: *(Your Supabase Project URL)*
     - `VITE_SUPABASE_ANON_KEY`: *(Your Supabase Anon Public Key)*

4. **Deploy**
   - Click **"Deploy"**.
   - Once done, Vercel will give you a live URL for your frontend! 🎉

---

## Part 4: Final Configurations

- **Rate Limiting**: The backend has built-in rate limiters (`express-rate-limit`) which expect requests coming through proxies. Render sets `X-Forwarded-For` headers, which Express handles safely.
- **CORS**: Ensure your frontend URL is whitelisted in your CORS settings in `client` or `server` if you hardcode it or use Strict CORS logic. Currently `cors()` accepts all origins by default in dev mode but you may want to restrict this later.

## 🎉 You're Done!
Your AI Study Assistant is ready for the world.
1. Push your code.
2. Render builds the backend.
3. Vercel builds the frontend.
4. Share your link! 🚀
