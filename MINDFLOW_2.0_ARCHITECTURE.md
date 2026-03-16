# MindFlow 2.0: Technical Architecture & System Design
**Version:** 2.0.0 (Proposed)  
**Status:** Design Phase  
**Author:** AI Systems Architect

---

## 1️⃣ Executive Summary
MindFlow 2.0 transitions from a synchronous wrapper around an LLM API to an asynchronous, stateful, and adaptive learning platform. The core architectural shift involves moving heavy AI processing to background workers, introducing a Vector Database for long-term knowledge retrieval (RAG), and implementing a mathematical model (SM-2) for memory optimization.

---

## A. System Architecture

The system follows a **Event-Driven Micro-Service** pattern (monolith initially, separable later) to handle long-running AI tasks without blocking the UI.

### **High-Level Data Flow**
```mermaid
[Client (React)] 
      │ (1. Upload / Request)
      ▼
[API Gateway (Express)] ───► [Auth Middleware (JWT)]
      │ (2. Enqueue Job)
      ▼
[Job Queue (Redis + BullMQ)]
      │ (3. Process Job)
      ▼
[Worker Nodes] ◄───► [AI Orchestration Layer (Gemini/Groq)]
      │
      ├─► (4a. Parse PDF & Chunk) ──► [Embedding Service] ──► [Vector DB (Pinecone)]
      │                                    (Context)
      └─► (4b. Generate Content) ──► [MongoDB Atlas]
                                           ▲
                                           │ (5. Real-time updates via Polling/Socket)
[Client] ◄─────────────────────────────────┘
```

### **Core Components**
1.  **API Server**: Handles HTTP requests, Auth, and GridFS (File Storage).
2.  **Worker Service**: Dedicated process for PDF parsing, Embedding generation, and LLM interaction.
3.  **Vector Store**: Stores semantic embeddings of user notes for "Chat with PDF" features.
4.  **Primary DB**: MongoDB for relational data (Users, Decks, Schedules).
5.  **Cache/Queue**: Redis for BullMQ jobs and hot-caching user sessions.

---

## B. Retrieval-Augmented Generation (RAG) Pipeline

To enable "Ask AI" and "Context-Aware" generation, we implement a RAG pipeline.

### **1. Ingestion Pipeline**
*   **Chunking Strategy**: Recursive Character Splitter.
    *   **Chunk Size**: 512 Tokens (approx. 2000 chars).
    *   **Overlap**: 50 Tokens (preserves context between chunks).
*   **Embedding Model**: `text-embedding-3-small` (OpenAI) or `nomic-embed-text` (Local/HuggingFace) for cost efficiency.
*   **Vector Database**: **Pinecone** (Serverless) is recommended for ease of setup, or **Qdrant** (Docker) for self-hosted.

### **2. Retrieval Strategy**
*   **Hybrid Search**: Combine Keyword Search (BM25) with Semantic Search (Cosine Similarity).
*   **Retrieved Context**: Top-K (K=5) chunks.
*   **Re-ranking**: Optional second pass to order chunks by relevance before feeding to LLM.

### **3. Prompt Engineering (Context Injection)**
```javascript
const prompt = `
Context:
${retrievedChunks.join('\n---\n')}

User Query: "${userQuery}"

Instructions:
Answer strictly based on the provided context. If the answer is not in the context, state "I cannot find this in your notes."
`;
```

---

## C. Spaced Repetition System (SRS) - SuperMemo-2 (SM-2)

Percentage-based "Mastery" is insufficient. We will implement **SM-2** to predict *when* a user will forget information.

### **Algorithm Logic**
Each flashcard has:
*   `n` (repetition number)
*   `EF` (Ease Factor, starts at 2.5)
*   `I` (Interval in days)

**Input**: User Grade `q` (0-5)
*   0-2: Fail (Repeat today)
*   3: Pass (Hard)
*   4: Pass (Good)
*   5: Pass (Easy)

**Formulas**:
1.  **If q < 3**: `n = 0`, `I = 0` (Reset card)
2.  **If q >= 3**:
    *   `I(0) = 0`
    *   `I(1) = 1` day
    *   `I(2) = 6` days
    *   `I(n) = I(n-1) * EF`
3.  **New EF**: 
    `EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))`
    *   *Constraint*: `EF` never drops below 1.3

### **Selection Logic (Due Today)**
```sql
SELECT * FROM Flashcards 
WHERE 
  next_review_date <= NOW() 
  OR 
  (n = 0 AND created_at >= SESSION_START)
ORDER BY next_review_date ASC
LIMIT 20
```

---

## D. Adaptive Quiz Engine

The system adjusts difficulty dynamically based on `concept_mastery`.

### **Logic Flow**
1.  **Pre-computation**: All Flashcards/Questions are tagged with `topics` (using AI during generation).
2.  **User Profile**: DB stores `topic_scores` map: `{ "Biology": 0.8, "Chemistry": 0.2 }`.
3.  **Generation Prompt**:
    *   *If Weak Topic*: "Generate foundational questions definition-based for topic X."
    *   *If Strong Topic*: "Generate application/synthesis questions (Scenario based) for topic Y."
4.  **Real-time Adaptation**: If User answers 3 "Hard" questions wrong in a row -> Trigger switch to "Medium" difficulty for next batch.

---

## E. MongoDB Schema Design

### **1. User**
```javascript
{
  _id: ObjectId,
  email: String,
  password_hash: String,
  settings: {
    daily_goal: Number, // cards per day
    srs_enabled: Boolean
  },
  stats: {
    streak: Number,
    total_xp: Number,
    last_study_date: Date
  }
}
```

### **2. StudySet (The "Deck")**
```javascript
{
  _id: ObjectId,
  user_id: ObjectId, // Index
  title: String,
  source_file_url: String, // R2/S3 URL
  status: 'processing' | 'ready' | 'error',
  vector_index_id: String, // Namespace in Pinecone
  created_at: Date
}
```

### **3. Flashcard (The "Atom")**
```javascript
{
  _id: ObjectId,
  set_id: ObjectId, // Index
  front: String,
  back: String,
  explanation: String,
  topics: [String], // ["photosynthesis", "plant_biology"]
  
  // SRS Fields
  srs: {
    n: { type: Number, default: 0 },
    ef: { type: Number, default: 2.5 },
    interval: { type: Number, default: 0 },
    next_review: { type: Date, default: Date.now } // Index
  },
  
  difficulty_rating: 'easy' | 'medium' | 'hard'
}
```

### **4. ReviewLog (Analytics)**
```javascript
{
  _id: ObjectId,
  user_id: ObjectId,
  card_id: ObjectId,
  grade: Number, // 0-5
  time_taken_ms: Number,
  timestamp: Date // Time Series Index
}
```

---

## F. AI Reliability & Safety

### **1. Fallback Strategy (Circuit Breaker)**
```javascript
async function safeGenerate(prompt) {
  try {
    return await callGemini(prompt);
  } catch (e) {
    console.warn("Gemini Failed, failing over to Groq...");
    return await callGroq(prompt);
  }
}
```

### **2. Structured Output Enforcement**
LLMs often fail to output valid JSON. We approach this by:
1.  **System Prompt**: "You are a JSON generator. Do not output markdown."
2.  **Validation (Zod)**:
    ```javascript
    const FlashcardSchema = z.array(z.object({
      front: z.string(),
      back: z.string()
    }));
    
    const json = parseJSON(aiResponse);
    const valid = FlashcardSchema.safeParse(json);
    if (!valid.success) throw new Error("Malformed AI Response");
    ```
3.  **Auto-Correction**: If Zod fails, feed the error back to the LLM: "You generated invalid JSON (Error: X). Fix it and return only JSON."

---

## G. Background Job Queue (BullMQ)

### **Worker Setup**
*   **Queue Name**: `content-generation`
*   **Concurrency**: 5 (Keep low to avoid Rate Limits)
*   **Processor**:
    ```javascript
    worker.process(async (job) => {
       const { fileUrl, type } = job.data;
       // 1. Download File
       // 2. Extract Text
       // 3. Chunk
       // 4. Generate Embeddings -> Pinecone
       // 5. Generate Flashcards -> MongoDB
       // 6. Update StudySet status to 'ready'
    });
    ```
*   **Client Polling**: Client polls `/api/studysets/:id/status` every 2s until `ready`.

---

## H. Security Hardening

1.  **Rate Limiting**: Use `express-rate-limit` (Window: 15m, Max: 100 requests) to prevent API abuse/cost spikes.
2.  **File Validation**: Verify Magic Numbers (Hex signatures) of files, not just extensions, to prevent malicious uploads within PDFs.
3.  **Sanitization**: Use `dompurify` on the frontend before rendering Markdown/HTML from the AI to prevent XSS.
4.  **JWT Refresh**: Short-lived Access Token (15m) + Long-lived Refresh Token (7d) stored in `httpOnly` cookie.

---

## J. Implementation Roadmap (Order of Operations)

1.  **Phase 1: Persistence Upgrade** - Migrate data from NeDB to MongoDB Atlas.
2.  **Phase 2: Async Architecture** - Setup Redis & BullMQ. Move `generateFlashcards` to a background job.
3.  **Phase 3: The Brain (SRS)** - Add SRS fields to Schema, implement the SM-2 specific endpoint `/api/study/review`.
4.  **Phase 4: The Scale** - Implement Vector DB & Embeddings pipeline.

---
**End of Design Document**
