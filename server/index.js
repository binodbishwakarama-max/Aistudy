require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Groq = require('groq-sdk');

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

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

app.post('/api/generate', async (req, res) => {
    try {
        const { prompt, system } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const completion = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: system || "You are a helpful study assistant."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.5,
            max_tokens: 4096,
            top_p: 1,
            stop: null,
            stream: false,
        });

        // Use the response format the frontend expects (previously Anthropic)
        const responseContent = completion.choices[0]?.message?.content || "";

        // Map to Anthropic-like structure so specific frontend logic doesn't break
        res.json({
            content: [{ text: responseContent }]
        });

    } catch (error) {
        console.error('----------------------------------------');
        console.error('⚠️ GROQ API ERROR:', error.message);
        console.error('----------------------------------------');

        res.status(500).json({ error: error.message || 'Failed to generate content' });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
