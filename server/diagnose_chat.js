require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Groq = require('groq-sdk');

const fs = require('fs');

async function diagnose() {
    let log = "--- DIAGNOSTIC START ---\n";
    const append = (msg) => { console.log(msg); log += msg + "\n"; };

    // 1. Check Keys
    const geminiKey = process.env.GEMINI_API_KEY;
    const groqKey = process.env.GROQ_API_KEY;

    append(`Gemini Key: ${geminiKey ? (geminiKey.substring(0, 8) + "...") : "MISSING"}`);
    append(`Groq Key: ${groqKey ? (groqKey.substring(0, 8) + "...") : "MISSING"}`);

    // 2. Test Gemini
    append("\n--- TESTING GEMINI ---");
    if (geminiKey) {
        // Test 1: Simple Generation
        try {
            const genAI = new GoogleGenerativeAI(geminiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
            const result = await model.generateContent("Hello?");
            append("✓ Gemini (Simple) Success: " + result.response.text());
        } catch (e) {
            append("X Gemini (Simple) Failed: " + e.message);
        }

        // Test 2: Chat with System Instruction
        try {
            const genAI = new GoogleGenerativeAI(geminiKey);
            const model = genAI.getGenerativeModel({
                model: "gemini-flash-latest",
                systemInstruction: "You are a helpful test bot."
            });
            const chat = model.startChat({
                history: []
            });
            const result = await chat.sendMessage("Hello test context?");
            append("✓ Gemini (Chat+System) Success: " + result.response.text());
        } catch (e) {
            append("X Gemini (Chat+System) Failed: " + e.message);
        }
    } else {
        append("Skipping Gemini (No Key)");
    }

    // 3. Test Groq
    append("\n--- TESTING GROQ ---");
    if (groqKey) {
        try {
            const groq = new Groq({ apiKey: groqKey });
            const completion = await groq.chat.completions.create({
                messages: [{ role: "user", content: "Hello" }],
                model: "llama-3.3-70b-versatile",
            });
            append("✓ Groq Success: " + completion.choices[0]?.message?.content);
        } catch (e) {
            append("X Groq Failed: " + e.message);
        }
    } else {
        append("Skipping Groq (No Key)");
    }

    append("\n--- DIAGNOSTIC END ---");
    fs.writeFileSync('diagnosis_result.log', log);
}

diagnose();
