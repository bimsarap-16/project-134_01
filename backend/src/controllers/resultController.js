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

const Question = require('../models/Question');

/**
 * @desc Exam report analytics
 */
const getExamReport = async (req, res, next) => {
    try {
        const { quizId } = req.params;

        const attempts = await Attempt.find({ quizId, isCompleted: true })
            .populate('studentId', 'name email studentIdNumber')
            .lean();

        const questions = await Question.find({ quizId }).lean();

        const questionMap = {};
        questions.forEach(q => {
            questionMap[q._id.toString()] = q;
        });

        const questionStats = questions.map(q => ({
            questionId: q._id,
            questionText: q.questionText,
            options: q.options || [],
            correctAnswer: q.correctAnswer,
            correctCount: 0,
            optionCounts: new Array(q.options?.length || 4).fill(0)
        }));

        const topicStatsMap = {};
        questions.forEach(q => {
            const t = q.topic || 'Uncategorized';
            if (!topicStatsMap[t]) {
                topicStatsMap[t] = {
                    topic: t,
                    totalQuestions: 0,
                    totalAttempts: 0,
                    correctAnswers: 0
                };
            }
            topicStatsMap[t].totalQuestions++;
        });

        const reportData = [];
        let totalPasses = 0;
        let totalFails = 0;

        const gradeDistribution = {
            'A+': 0, 'A': 0, 'A-': 0,
            'B+': 0, 'B': 0, 'B-': 0,
            'C+': 0, 'C': 0, 'Fail': 0
        };

        for (const attempt of attempts) {
            let correctCount = 0;
            let wrongCount = 0;
            let answeredCount = 0;

            attempt.answers.forEach(ans => {
                if (ans.selectedOption !== undefined && ans.selectedOption !== -1) {
                    answeredCount++;
                    const q = questionMap[ans.questionId.toString()];

                    if (q && q.correctAnswer === ans.selectedOption) {
                        correctCount++;
                    } else {
                        wrongCount++;
                    }
                }
            });

            const percentage = attempt.totalMarks
                ? (attempt.score / attempt.totalMarks) * 100
                : 0;

            let grade = 'Fail';
            if (percentage > 90) grade = 'A+';
            else if (percentage > 84) grade = 'A';
            else if (percentage > 75) grade = 'A-';
            else if (percentage > 70) grade = 'B+';
            else if (percentage > 65) grade = 'B';
            else if (percentage > 60) grade = 'B-';
            else if (percentage > 55) grade = 'C+';
            else if (percentage > 45) grade = 'C';

            const isPass = percentage > 45;

            gradeDistribution[grade]++;
            if (isPass) totalPasses++;
            else totalFails++;

            reportData.push({
                studentId: attempt.studentId,
                attemptId: attempt._id,
                score: attempt.score,
                totalMarks: attempt.totalMarks,
                percentage: parseFloat(percentage.toFixed(2)),
                correctCount,
                wrongCount,
                answeredCount,
                grade,
                isPass
            });
        }

        const aggregate = {
            totalAttempts: attempts.length,
            totalPasses,
            totalFails,
            gradeDistribution,
            questionStats,
            topicStats: Object.values(topicStatsMap)
        };

        return sendSuccess(res, { attempts: reportData, aggregate }, 'Exam report fetched successfully.');
    } catch (error) {
        next(error);
    }
};
