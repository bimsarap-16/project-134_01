const Chat = require('../models/Chat');
const { askAI } = require('../services/aiService');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc    Ask AI chatbot a question
 * @route   POST /api/chatbot/ask
 * @access  Authenticated User
 */
const askChatbot = async (req, res, next) => {
    try {
        const { message } = req.body;

        // Fetch or create chat history for this user
        let chat = await Chat.findOne({ studentId: req.user._id });

        if (!chat) {
            chat = await Chat.create({
                studentId: req.user._id,
                messages: [],
            });
        }

        // Build message history for context (last 10 messages)
        const recentMessages = chat.messages.slice(-10).map((m) => ({
            role: m.role,
            content: m.content,
        }));

        // Add user message
        recentMessages.push({ role: 'user', content: message });

        // Get AI response
        const aiResponse = await askAI(recentMessages);

        // Save both messages to chat history
        chat.messages.push({ role: 'user', content: message });
        chat.messages.push({ role: 'assistant', content: aiResponse });
        await chat.save();

        return sendSuccess(
            res,
            { reply: aiResponse },
            'AI response generated successfully.'
        );
    } catch (error) {
        next(error);
    }
};


/**
 * @desc    Get chat history for current user
 * @route   GET /api/chatbot/history
 * @access  Authenticated User
 */
const getChatHistory = async (req, res, next) => {
    try {
        const chat = await Chat.findOne({ studentId: req.user._id });
        if (!chat) return sendSuccess(res, { messages: [] }, 'No chat history found.');
        return sendSuccess(res, { messages: chat.messages }, 'Chat history fetched.');
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Clear chat history for current user
 * @route   DELETE /api/chatbot/history
 * @access  Authenticated User
 */
const clearChatHistory = async (req, res, next) => {
    try {
        await Chat.findOneAndDelete({ studentId: req.user._id });
        return sendSuccess(res, null, 'Chat history cleared successfully.');
    } catch (error) {
        next(error);
    }
};

module.exports = { askChatbot, getChatHistory, clearChatHistory };
