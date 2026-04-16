const Quiz = require('../models/Quiz');
const User = require('../models/User');
const Module = require('../models/Module');
const { sendSuccess, sendError } = require('../utils/response');
const { sendEmail } = require('../utils/mail');

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

module.exports = { createQuiz };