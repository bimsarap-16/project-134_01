const OpenAI = require('openai');
require('dotenv').config();

const apiKey = process.env.HUGGINGFACE_API_KEY;

async function run() {
    try {
        const client = new OpenAI({
            apiKey: apiKey,
            baseURL: 'https://router.huggingface.co/v1',
        });

        console.log('Testing Router with model: meta-llama/Llama-3.1-8B-Instruct');
        const completion = await client.chat.completions.create({
            model: 'meta-llama/Llama-3.1-8B-Instruct',
            messages: [{ role: 'user', content: 'What are the main components of a computer?' }],
            max_tokens: 100,
        });

        console.log('--- SUCCESS ---');
        console.log('Response:', completion.choices[0].message.content);
    } catch (err) {
        console.log('--- FAILED ---');
        console.log('Error Status:', err.status);
        console.log('Error Message:', err.message);
    }
}

run();
