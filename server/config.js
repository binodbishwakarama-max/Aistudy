require('dotenv').config();

const requiredEnv = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];

const missingRequiredEnv = requiredEnv.filter((name) => !process.env[name]);

if (missingRequiredEnv.length > 0) {
    throw new Error(
        `Missing required environment variables: ${missingRequiredEnv.join(', ')}`
    );
}

const parsePort = (value, fallback) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const serverConfig = {
    port: parsePort(process.env.PORT, 3000),
    supabase: {
        url: process.env.SUPABASE_URL,
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY
    },
    ai: {
        geminiApiKey: process.env.GEMINI_API_KEY || '',
        groqApiKey: process.env.GROQ_API_KEY || '',
        geminiModel: process.env.GEMINI_MODEL || 'gemini-flash-latest',
        groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile'
    }
};

module.exports = { serverConfig };
