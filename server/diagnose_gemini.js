require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function diagnose() {
    console.log("--- DIAGNOSTIC START ---");
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        console.log("Attempting Gemini generation...");
        const start = Date.now();
        const result = await model.generateContent("Hi");
        const response = await result.response;
        console.log(`Success! Time taken: ${Date.now() - start}ms`);
        console.log("Response:", response.text());
    } catch (error) {
        const fs = require('fs');
        const errorDetails = `Error: ${error.toString()}\nMessage: ${error.message}\nStack: ${error.stack}`;
        fs.writeFileSync('gemini_error.log', errorDetails);
        console.log("Error saved to gemini_error.log");
    }
    console.log("--- DIAGNOSTIC END ---");
}

diagnose();
