# Deployment Guide 🚀

This guide will help you deploy your **MindFlow** application to the web so anyone can use it.

## 🏗️ Architecture
- **Frontend**: React (Vite) -> Deployed on **Vercel**
- **Backend**: Node.js (Express) -> Deployed on **Render** (or Railway/Fly.io)
- **Database**: NeDB (File-based) -> *Note: On free cloud hosting, data may reset when the server restarts. For permanent data, consider switching to MongoDB Atlas.*

---

## Part 1: Backend Deployment (Render)

1. **Push to GitHub**
   - Make sure your project is pushed to a GitHub repository.

2. **Create Web Service on Render**
   - Go to [render.com](https://render.com) and Sign Up/Login.
   - Click **"New +"** -> **"Web Service"**.
   - Connect your GitHub repository.

3. **Configure Service**
   - **Name**: `mindflow-api` (or similar)
   - **Root Directory**: `server` (Important!)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`

4. **Environment Variables**
   - Scroll down to "Environment Variables" and add:
     - `GROQ_API_KEY`: *(Your Groq API Key)*
     - `JWT_SECRET`: *(A long random string, e.g., 'super-secret-key-123')*
     - `MONGODB_URI`: *(Your MongoDB connection string from Atlas, e.g. mongodb+srv://...)*
     - `PORT`: `3000` (Render might override this, which is fine)

5. **Deploy**
   - Click **"Create Web Service"**.
   - Wait for it to finish. You will get a URL like `https://mindflow-api.onrender.com`.
   - **Copy this URL**, you need it for the frontend.

---

## Part 2: Frontend Deployment (Vercel)

1. **Configure API URL**
   - You need to tell the frontend where the backend lives.
   - In your local code, open `client/src/services/api.js`.
   - Change `const API_URL = 'http://localhost:3000/api';` to:
     ```javascript
     const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
     ```
     *(I will do this code change for you in the next step!)*

2. **Deploy on Vercel**
   - Go to [vercel.com](https://vercel.com) and Sign Up/Login.
   - Click **"Add New..."** -> **"Project"**.
   - Import your GitHub repository.

3. **Configure Project**
   - **Framework Preset**: Vite (Should detect automatically)
   - **Root Directory**: Click "Edit" and select `client`.

4. **Environment Variables**
   - Add a new variable:
     - **Name**: `VITE_API_URL`
     - **Value**: `https://mindflow-api.onrender.com/api` (The URL from Part 1 + `/api`)

5. **Deploy**
   - Click **"Deploy"**.
   - Once done, you will get your live website URL! 🎉

---

## Part 3: Database Strategy (Important)
- **Automatic Switching**: Your app is now smart! 🧠
  - If you provide `MONGODB_URI` on Render, it uses **MongoDB Atlas** (Persistent data).
  - If you DON'T provide it, it falls back to **NeDB** (Local files), which is fine for testing but data might wipe on restart.
- **Recommendation**: For a real deployed app, definitely set up the `MONGODB_URI`.

## 🎉 You're Done!
Your AI Study Assistant is ready for the world.
1. Push your code.
2. Render builds the backend.
3. Vercel builds the frontend.
4. Share your link! 🚀
