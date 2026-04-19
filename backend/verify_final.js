require('dotenv').config();
const { askAI } = require('./src/services/aiService');

(async () => {
    console.log('--- FINAL VERIFICATION ---');
    try {
        const response = await askAI([{ role: 'user', content: 'Say "System is Ready"' }]);
        console.log('AI Response:', response);
    } catch (e) {
        console.error('FAILED:', e.message);
    }
})();
