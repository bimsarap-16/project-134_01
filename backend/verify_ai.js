require('dotenv').config();
const { askAI } = require('./src/services/aiService');

async function test() {
    console.log('Testing Zephyr (Hugging Face) service...');
    try {
        const response = await askAI([{ role: 'user', content: 'Say "Hello, Zephyr!"' }]);
        console.log('Response:', response);
    } catch (error) {
        console.error('Test Failed:', error.message);
    }
}
test();
