const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require('groq-sdk');

// Initialize AI Clients (re-using env vars)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "dummy");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post('/', async (req, res) => {
    try {
        const { message, context, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        // System Prompt with Context
        const systemPrompt = `You are a helpful and encouraging AI Study Tutor called "MindFlow AI".
        
        CONTEXT:
        The user is studying the following text:
        """${context ? context.substring(0, 5000) : "No specific context provided."}"""
        
        INSTRUCTIONS:
        - Answer the user's question based on the context provided above.
        - If the answer is not in the context, use your general knowledge but mention that it's outside the provided notes.
        - Be concise, friendly, and use emojis occasionally.
        - If the user asks for a quiz or flashcard, politely direct them to use the "Generate" buttons instead.
        `;

        let responseText = "";

        // 1. Try Gemini
        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-flash-latest",
                systemInstruction: systemPrompt
            });

            // Convert history to Gemini format if needed (simplified for now)
            // GEMINI FIX: History should NOT include the current message, as sendMessage adds it.
            // Check if the last message in history is the same as the current 'message'.
            const validHistory = history ? history.slice(0, -1) : []; // Remove the last message (which is the current user prompt)

            const chat = model.startChat({
                history: validHistory.map(h => ({
                    role: h.role === 'user' ? 'user' : 'model',
                    parts: [{ text: h.content }]
                }))
            });

            console.log("DEBUG: chat.sendMessage sending:", message);

            const result = await chat.sendMessage(message);
            const response = await result.response;
            responseText = response.text();

        } catch (geminiError) {
            console.warn("Gemini Chat Failed, switching to Groq:", geminiError.message);

            // 2. Fallback to Groq
            const completion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: systemPrompt },
                    ...history || [],
                    { role: "user", content: message }
                ],
                model: "llama-3.3-70b-versatile",
            });
            responseText = completion.choices[0]?.message?.content || "";
        }

        res.json({ role: 'assistant', content: responseText });

    } catch (error) {
        console.error("Chat API Error:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
});

module.exports = router;
