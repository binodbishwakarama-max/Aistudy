require('dotenv').config();

const requiredEnv = ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];

const missingRequiredEnv = requiredEnv.filter((name) => !process.env[name]);

if (missingRequiredEnv.length > 0) {
    if (process.env.NODE_ENV === 'test') {
        process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'https://mock.supabase.co';
        process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-role-key';
    } else {
        throw new Error(
            `Missing required environment variables: ${missingRequiredEnv.join(', ')}`
        );
    }
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
        geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
        groqModel: process.env.GROQ_MODEL || 'llama-3.1-8b-instant'
    }
};

module.exports = { serverConfig };
