const Attempt = require('../models/Attempt');
const { sendSuccess, sendError } = require('../utils/response');
const paginate = require('../utils/paginate');

/**
 * @desc Get results by quiz (Lecturer)
 */
const getResultsByQuiz = async (req, res, next) => {
    try {
        const result = await paginate(
            Attempt,
            { quizId: req.params.quizId, isCompleted: true },
            req.query,
            (q) =>
                q.populate('studentId', 'name email')
                 .populate('quizId', 'title quizType duration')
        );
        return sendSuccess(res, result, 'Quiz results fetched successfully.');
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Student result history
 */
const getStudentResults = async (req, res, next) => {
    try {
        const result = await paginate(
            Attempt,
            { studentId: req.user._id, isCompleted: true },
            req.query,
            (q) =>
                q.populate({
                    path: 'quizId',
                    select: 'title quizType moduleId scheduledEnd',
                    populate: { path: 'moduleId', select: 'moduleName' },
                })
        );
        return sendSuccess(res, result, 'Student results fetched successfully.');
    } catch (error) {
        next(error);
    }
};

/**
 * @desc Admin/Lecturer all results
 */
const getAllResults = async (req, res, next) => {
    try {
        const result = await paginate(
            Attempt,
            { isCompleted: true },
            req.query,
            (q) =>
                q.populate('studentId', 'name email')
                 .populate({
                    path: 'quizId',
                    select: 'title quizType moduleId',
                    populate: { path: 'moduleId', select: 'moduleName' },
                 })
        );
        return sendSuccess(res, result, 'All results fetched successfully.');
    } catch (error) {
        next(error);
    }
};