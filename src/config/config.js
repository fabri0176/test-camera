require('dotenv').config();

const requiredEnvVars = ['OPENROUTER_API_KEY', 'OPENROUTER_URL'];
requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    throw new Error(`Missing required environment variable: ${varName}`);
  }
});

module.exports = {
  port: process.env.PORT || 3000,
  openRouter: {
    apiKey: process.env.OPENROUTER_API_KEY,
    model: process.env.OPENROUTER_MODEL || 'google/gemma-3-27b-it',
    apiUrl: process.env.OPENROUTER_URL,
    prompt: process.env.OPENROUTER_PROMPT || ``,
    maxTokens: Number.parseInt(process.env.OPENROUTER_MAX_TOKENS) || 0
  }
};