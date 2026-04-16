const Question = require('../models/Question');
const Quiz = require('../models/Quiz');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc    Add question to a quiz
 * @route   POST /api/questions
 * @access  Lecturer
 */
const createQuestion = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.body.quizId);
        if (!quiz) return sendError(res, 'Quiz not found.', 404);

        if (quiz.createdBy.toString() !== req.user._id.toString()) {
            return sendError(res, 'Not authorized to add questions to this quiz.', 403);
        }

        const question = await Question.create(req.body);
        return sendSuccess(res, question, 'Question created successfully.', 201);
    } catch (error) {
        next(error);
    }
};

module.exports = { createQuestion };