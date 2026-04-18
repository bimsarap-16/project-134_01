const OpenAI = require('openai');
const { logger } = require('../utils/logger');

/**
 * Send a message to Hugging Face (Router) and get a response
 * @param {Array} messages - Array of {role, content} message objects
 * @returns {string} AI response text
 */
const askAI = async (messages) => {
    const apiKey = process.env.HUGGINGFACE_API_KEY;

    // Fallback for missing or placeholder API key
    if (!apiKey || apiKey.includes('your-') || apiKey === '') {
        logger.warn('Hugging Face API Key is missing or placeholder. Using mock response.');
        const lastMessage = messages[messages.length - 1].content.toLowerCase();
        
        if (lastMessage.includes('hello') || lastMessage.includes('hi')) {
            return "Hello! I'm your AI study assistant. (Note: Hugging Face API key is not configured, so I'm running in demo mode). How can I help you today?";
        }
        return "I'm currently running in demo mode because the Hugging Face API key is not configured. Please add a valid `HUGGINGFACE_API_KEY` to the `Backend/.env` file to enable full AI capabilities.";
    }

    try {
        const client = new OpenAI({
            apiKey: apiKey,
            baseURL: 'https://router.huggingface.co/v1',
        });

        const completion = await client.chat.completions.create({
            model: 'meta-llama/Llama-3.1-8B-Instruct',
            messages: [
                {
                    role: 'system',
                    content: 'You are a clean and concise academic assistant. Use clear bullet points and plenty of whitespace. DO NOT use markdown bolding (no ** stars). Use capitalization for emphasis instead. Keep it friendly with emojis.',
                },
                ...messages,
            ],
            max_tokens: 500,
        });

        return completion.choices[0].message.content;
    } catch (error) {
        const errorDetail = error.response?.data?.error || error.message;
        logger.error(`Hugging Face Router API Error: ${errorDetail}`);
        
        if (errorDetail.includes('503')) {
            return "The AI model is currently loading on Hugging Face. Please try again in 30 seconds.";
        }
        
        throw new Error(`AI service Error: ${errorDetail}`);
    }
};

module.exports = { askAI };
