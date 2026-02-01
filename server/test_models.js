require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const modelsToTry = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-latest",
    "gemini-1.5-flash-001",
    "gemini-1.5-pro",
    "gemini-pro"
];

async function testModels() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    for (const modelName of modelsToTry) {
        console.log(`\n--- Testing ${modelName} ---`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            const response = await result.response;
            console.log(`✅ SUCCESS! ${modelName} works.`);
            console.log(response.text());
            return; // Exit on first success
        } catch (error) {
            console.log(`❌ FAILED ${modelName}: ${error.message}`);
        }
    }
    console.log("\nAll models failed.");
}

testModels();
