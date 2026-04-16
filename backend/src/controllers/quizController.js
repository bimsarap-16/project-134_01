const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Module = require('../models/Module');
const { sendSuccess, sendError } = require('../utils/response');
const { sendEmail } = require('../utils/mail');
const paginate = require('../utils/paginate');

/**
 * @desc    Create a quiz
 * @route   POST /api/quizzes
 * @access  Lecturer
 */
const createQuiz = async (req, res, next) => {
    try {
        const { quizType, scheduledStart, scheduledEnd } = req.body;

        if (quizType === 'exam') {
            const overlap = await Quiz.findOne({
                quizType: 'exam',
                moduleId: req.body.moduleId,
                $or: [
                    {
                        scheduledStart: { $lt: new Date(scheduledEnd) },
                        scheduledEnd: { $gt: new Date(scheduledStart) }
                    }
                ]
            });

            if (overlap) {
                return sendError(res, `This time slot already has an exam scheduled for this module: "${overlap.title}"`, 400);
            }
        }

        const quizData = { ...req.body, createdBy: req.user._id };
        const quiz = await Quiz.create(quizData);

        if (quiz.quizType === 'exam') {
            try {
                const students = await User.find({ role: 'student' }).select('email name');
                const module = await Module.findById(quiz.moduleId);
                const lecturer = req.user;

                const scheduledDate = new Date(quiz.scheduledStart).toLocaleDateString();
                const scheduledTime = new Date(quiz.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                const emailPromises = students.map(student =>
                    sendEmail(student.email, `New Exam Published: ${quiz.title}`, `<p>Exam scheduled for ${module ? module.moduleName : 'N/A'}</p>`)
                );

                Promise.all(emailPromises).catch(err => console.error('Bulk Email Error:', err));
            } catch (err) {
                console.error('Notification Error:', err);
            }
        }

        return sendSuccess(res, quiz, 'Quiz created successfully.', 201);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get quizzes by module (paginated)
 * @route   GET /api/quizzes/module/:moduleId
 * @access  All authenticated users
 */
const getQuizzesByModule = async (req, res, next) => {
    try {
        const filter = { moduleId: req.params.moduleId };

        if (req.user.role === 'student') {
            filter.isActive = true;
        }

        const result = await paginate(Quiz, filter, req.query, (q) =>
            q.populate('createdBy', 'name email').populate('moduleId', 'moduleName moduleCode')
        );

        return sendSuccess(res, result, 'Quizzes fetched successfully.');
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get a single quiz by ID
 * @route   GET /api/quizzes/:id
 * @access  All authenticated users
 */
const getQuizById = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id)
            .populate('createdBy', 'name email')
            .populate('moduleId', 'moduleName moduleCode');

        if (!quiz) return sendError(res, 'Quiz not found.', 404);
        return sendSuccess(res, quiz, 'Quiz fetched successfully.');
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Get all quizzes (paginated, supports filtering by type)
 * @route   GET /api/quizzes
 * @access  All authenticated users
 */
const getAllQuizzes = async (req, res, next) => {
    try {
        const filter = {};
        if (req.query.quizType) filter.quizType = req.query.quizType;
        if (req.user.role === 'student') filter.isActive = true;

        const result = await paginate(Quiz, filter, req.query, (q) =>
            q.populate('createdBy', 'name email').populate('moduleId', 'moduleName moduleCode')
        );

        return sendSuccess(res, result, 'Quizzes fetched successfully.');
    } catch (error) {
        next(error);
    }
};

module.exports = { createQuiz, getQuizzesByModule, getQuizById, getAllQuizzes };