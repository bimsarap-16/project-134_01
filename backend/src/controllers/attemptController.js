const Quiz = require('../models/Quiz');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * @desc    Start a quiz attempt
 * @route   POST /api/attempt/start/:quizId
 * @access  Student
 */
const startAttempt = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) return sendError(res, 'Quiz not found.', 404);
        if (!quiz.isActive) return sendError(res, 'This quiz is not active.', 403);

        // ─── Exam Time Window Check ───────────────────────────────────────────────
        if (quiz.quizType === 'exam') {
            const now = new Date();
            if (now < quiz.scheduledStart) {
                return sendError(
                    res,
                    `Exam has not started yet. It starts at ${quiz.scheduledStart.toISOString()}.`,
                    403
                );
            }
            if (now > quiz.scheduledEnd) {
                return sendError(res, 'Exam time window has ended.', 403);
            }
        }

        // ─── Attempt resumes or limits ───────────────────────────────────────────
        const incompleteAttempt = await Attempt.findOne({
            studentId: req.user._id,
            quizId: quiz._id,
            isCompleted: false,
        });

        if (incompleteAttempt) {
            // Return the ongoing attempt for resuming
            return sendSuccess(res, incompleteAttempt, 'Resuming ongoing attempt.');
        }

        // If no incomplete attempt, check for completed ones
        const completedAttemptsCount = await Attempt.countDocuments({
            studentId: req.user._id,
            quizId: quiz._id,
            isCompleted: true,
        });

        if (quiz.quizType === 'exam' && completedAttemptsCount >= quiz.attemptsAllowed) {
            return sendError(res, 'You have reached the maximum number of attempts allowed for this exam.', 409);
        }

        // Practice quizzes allow unlimited completed attempts (if no ongoing)

        // ─── Fetch questions for initial attempt record ────────────────────────────
        const questions = await Question.find({ quizId: quiz._id }).select('_id');
        const answers = questions.map((q) => ({
            questionId: q._id,
            selectedOption: -1, // unanswered
        }));

        const attempt = await Attempt.create({
            studentId: req.user._id,
            quizId: quiz._id,
            answers,
            startedAt: new Date(),
        });

        return sendSuccess(res, { attempt, quiz }, 'Quiz started successfully.', 201);
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Submit a quiz attempt
 * @route   POST /api/attempt/submit/:quizId
 * @access  Student
 */
const submitAttempt = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId);
        if (!quiz) return sendError(res, 'Quiz not found.', 404);

        const attempt = await Attempt.findOne({
            studentId: req.user._id,
            quizId: quiz._id,
            isCompleted: false,
        });

        if (!attempt) return sendError(res, 'No active attempt found. Start the quiz first.', 404);
        if (attempt.isCompleted) return sendError(res, 'This attempt has already been submitted.', 409);

        // ─── Auto-submit detection ────────────────────────────────────────────────
        const now = new Date();
        const durationMs = quiz.duration * 60 * 1000;
        const isAutoSubmit =
            quiz.quizType === 'exam' &&
            now.getTime() - attempt.startedAt.getTime() > durationMs;

        // ─── Process submitted answers ────────────────────────────────────────────
        const { answers } = req.body; // [{questionId, selectedOption}]
        const questions = await Question.find({ quizId: quiz._id });

        const questionMap = {};
        questions.forEach((q) => {
            questionMap[q._id.toString()] = q;
        });

        let score = 0;
        let totalMarks = 0;
        const gradedAnswers = [];

        for (const ans of answers) {
            const question = questionMap[ans.questionId];
            if (!question) continue;

            totalMarks += question.marks;
            const isCorrect =
                ans.selectedOption !== undefined &&
                ans.selectedOption !== -1 &&
                ans.selectedOption === question.correctAnswer;

            if (isCorrect) score += question.marks;

            gradedAnswers.push({
                questionId: question._id,
                questionText: question.questionText,
                selectedOption: ans.selectedOption,
                correctAnswer: question.correctAnswer,
                isCorrect,
                explanation: question.explanation,
                options: question.options,
                marks: question.marks,
                marksEarned: isCorrect ? question.marks : 0,
            });
        }

        // ─── Save attempt ─────────────────────────────────────────────────────────
        attempt.answers = answers.map((a) => ({
            questionId: a.questionId,
            selectedOption: a.selectedOption,
        }));
        attempt.score = score;
        attempt.totalMarks = totalMarks;
        attempt.submittedAt = now;
        attempt.autoSubmitted = isAutoSubmit;
        attempt.isCompleted = true;

        await attempt.save();

        const responseData = {
            score,
            totalMarks,
            percentage: totalMarks > 0 ? ((score / totalMarks) * 100).toFixed(2) : 0,
            autoSubmitted: isAutoSubmit,
            submittedAt: attempt.submittedAt,
        };

        // Practice quiz: return detailed answer breakdown; Exam: return score only
        if (quiz.quizType === 'practice') {
            responseData.gradedAnswers = gradedAnswers;
        }

        return sendSuccess(res, responseData, 'Quiz submitted successfully.');
    } catch (error) {
        next(error);
    }
};

module.exports = { startAttempt, submitAttempt };
