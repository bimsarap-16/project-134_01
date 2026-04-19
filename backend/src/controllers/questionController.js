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

/**
 * @desc    Get all questions for a quiz
 * @route   GET /api/questions/quiz/:quizId
 * @access  All authenticated users
 */
const getQuestionsByQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) return sendError(res, 'Quiz not found.', 404);

        // Students don't see correct answers while an exam quiz is active
        let projection = {};
        if (req.user.role === 'student' && quiz.quizType === 'exam') {
            projection = { correctAnswer: 0, explanation: 0 };
        }

        const questions = await Question.find(
            { quizId: req.params.quizId },
            projection
        );

        return sendSuccess(res, questions, 'Questions fetched successfully.');
    } catch (error) {
        next(error);
    }
};