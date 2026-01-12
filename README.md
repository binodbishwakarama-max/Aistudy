# MindFlow - AI Study Assistant

An intelligent study companion that turns your lecture notes and PDFs into interactive flashcards and quizzes using AI.

## 🚀 Features
- **AI-Powered Generation**: Instantly generates study materials using **Groq (Llama 3)**.
- **Smart Parsing**: Upload PDF or Text files to automatically extract content.
- **Interactive Modes**:
  - **Flashcards**: Flip animations for effective recall.
  - **Quiz Mode**: Multiple-choice questions with instant feedback and explanations.
- **User Accounts**: Sign up and Login to save your progress.
- **Dashboard**: Track your history and one-click resume previous sessions.
- **Local Database**: All data is saved locally (Zero-setup required).

## 🛠️ Setup & Run

### 1. Backend (Server)
The server handles AI generation and database storage.
```bash
cd server
npm install
node index.js
```
*Runs on http://localhost:3000*

**Environment Variables (.env)**:
Ensure `server/.env` has your API Key:
```
GROQ_API_KEY=gsk_...
PORT=3000
JWT_SECRET=your-secret-key
```

### 2. Frontend (Client)
The React application for the user interface.
```bash
cd client
npm install
npm run dev
```
*Runs on http://localhost:5173*

## 📚 Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express
- **AI**: Groq SDK (Llama 3 70b)
- **Database**: NeDB (Local file-based MongoDB alternative)
- **Auth**: JWT & Bcrypt

## 📝 Usage
1. Open the app at `http://localhost:5173`.
2. **Login/Register** to enable saving.
3. Upload your study notes.
4. Click **"Quiz Mode"** or **"Flashcards"** to generate content.
5. Click **"Save Progress"** to store your session in the Dashboard.
