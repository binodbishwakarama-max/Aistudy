require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();

process.on('uncaughtException', (err) => {
    console.error('UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', (reason, p) => {
    console.error('UNHANDLED REJECTION:', reason);
});

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '1024mb' }));

// Routes
const authRoutes = require('./routes/auth');
const studyRoutes = require('./routes/study');
app.use('/api/auth', authRoutes);
app.use('/api/study', studyRoutes);

// --- AI CONFIGURATION ---
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy");
let isGeminiActive = false;

// Smart Startup Check
async function checkGeminiConnection() {
    if (!process.env.GEMINI_API_KEY) {
        console.log("ℹ️  No Gemini API Key found. Using Groq.");
        return;
    }

    console.log("🔄 Testing Gemini Connection...");
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        await model.generateContent("Test");
        isGeminiActive = true;
        console.log("✅ Gemini is ONLINE and Active. (Primary Model)");
    } catch (err) {
        console.warn("⚠️ Gemini Connection Failed on Startup. Defaulting to Groq for all requests.");
        // console.warn(`   Reason: ${err.message}`);
        isGeminiActive = false;
    }
}

// Run check on start (allow event loop to proceed)
checkGeminiConnection();

app.post('/api/generate', async (req, res) => {
    try {
        const { prompt, system } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        let responseContent = "";
        let usedProvider = "";

        // 1. Try Gemini (only if active)
        if (isGeminiActive) {
            try {
                const model = genAI.getGenerativeModel({
                    model: "gemini-1.5-flash",
                    systemInstruction: system || "You are a helpful study assistant."
                });
                const result = await model.generateContent(prompt);
                const response = await result.response;
                responseContent = response.text();
                usedProvider = "Gemini";
            } catch (gemError) {
                console.warn('⚠️ Gemini Failed during request. Switching to Groq...');
                isGeminiActive = false; // Disable for future requests to save time
            }
        }

        // 2. Fallback to Groq (if Gemini skipped or failed)
        if (!responseContent) {
            try {
                const completion = await groq.chat.completions.create({
                    messages: [
                        { role: "system", content: system || "You are a helpful study assistant." },
                        { role: "user", content: prompt }
                    ],
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.5,
                    max_tokens: 4096,
                });
                responseContent = completion.choices[0]?.message?.content || "";
                usedProvider = "Groq";
            } catch (groqError) {
                console.error('❌ Groq Also Failed:', groqError.message);
                throw new Error("All AI services failed.");
            }
        }

        res.json({
            content: [{ text: responseContent }],
            provider: usedProvider
        });

    } catch (error) {
        console.error('⚠️ GENERATION API ERROR:', error.message);
        res.status(500).json({ error: error.message || 'Failed to generate content' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
