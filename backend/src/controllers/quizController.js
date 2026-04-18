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
        // Scheduling logic: check for overlapping exam time slots to prevent conflicts
        // Overlap Check for Exams
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
        // Notification system: send email alerts to students when a new exam is scheduled
        // If it's an exam, notify all students
        if (quiz.quizType === 'exam') {
            try {
                // Fetch students, module and lecturer details
                const students = await User.find({ role: 'student' }).select('email name');
                const module = await Module.findById(quiz.moduleId);
                const lecturer = req.user; // Current user is the lecturer

                const scheduledDate = new Date(quiz.scheduledStart).toLocaleDateString();
                const scheduledTime = new Date(quiz.scheduledStart).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                const emailPromises = students.map(student => 
                    sendEmail(
                        student.email,
                        `New Exam Published: ${quiz.title}`,
                        `
                            <div style="font-family: 'Calibri', sans-serif; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; max-width: 600px; color: #1e293b;">
                                <h2 style="color: #6366f1; margin-top: 0;">New Exam Scheduled</h2>
                                <p>Hi <b>${student.name}</b>,</p>
                                <p>A new exam has been scheduled for your module.</p>
                                
                                <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0; border: 1px solid #f1f5f9;">
                                    <table style="width: 100%; border-collapse: collapse;">
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px; width: 120px;">Module:</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${module ? module.moduleName : 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Lecturer:</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${lecturer.name}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Exam Topic:</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${quiz.title}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Date:</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${scheduledDate}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Time:</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${scheduledTime}</td>
                                        </tr>
                                        <tr>
                                            <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Duration:</td>
                                            <td style="padding: 8px 0; color: #0f172a; font-weight: 600;">${quiz.duration} Minutes</td>
                                        </tr>
                                    </table>
                                </div>
                                
                                <p>Please ensure you are ready at the scheduled time. Good luck!</p>
                                <p style="color: #64748b; font-size: 13px; margin-top: 25px; border-top: 1px solid #f1f5f9; padding-top: 15px;">
                                    This is an automated notification from QuizHub Academic System.
                                </p>
                            </div>
                        `
                    )
                );

                // We don't necessarily need to await all of them before returning response to lecturer, 
                // but for reliability we can.
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

        // Students only see active quizzes
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
 * @desc    Update a quiz
 * @route   PUT /api/quizzes/:id
 * @access  Lecturer (owner only)
 */
const updateQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return sendError(res, 'Quiz not found.', 404);

        if (quiz.createdBy.toString() !== req.user._id.toString()) {
            return sendError(res, 'Not authorized to update this quiz.', 403);
        }

        // Overlap Check for Exams (Update)
        if (req.body.quizType === 'exam' || (quiz.quizType === 'exam' && (req.body.scheduledStart || req.body.scheduledEnd))) {
            const newStart = req.body.scheduledStart ? new Date(req.body.scheduledStart) : quiz.scheduledStart;
            const newEnd = req.body.scheduledEnd ? new Date(req.body.scheduledEnd) : quiz.scheduledEnd;

            const overlap = await Quiz.findOne({
                quizType: 'exam',
                moduleId: quiz.moduleId,
                _id: { $ne: quiz._id },
                $or: [
                    {
                        scheduledStart: { $lt: newEnd },
                        scheduledEnd: { $gt: newStart }
                    }
                ]
            });

            if (overlap) {
                return sendError(res, `This time slot already has an exam scheduled for this module: "${overlap.title}"`, 400);
            }
        }

        Object.assign(quiz, req.body);
        await quiz.save();

        return sendSuccess(res, quiz, 'Quiz updated successfully.');
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Delete a quiz
 * @route   DELETE /api/quizzes/:id
 * @access  Lecturer (owner) or Admin
 */
const deleteQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return sendError(res, 'Quiz not found.', 404);

        const isOwner = quiz.createdBy.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return sendError(res, 'Not authorized to delete this quiz.', 403);
        }

        await quiz.deleteOne();
        return sendSuccess(res, null, 'Quiz deleted successfully.');
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

module.exports = { createQuiz, getQuizzesByModule, getQuizById, updateQuiz, deleteQuiz, getAllQuizzes };
