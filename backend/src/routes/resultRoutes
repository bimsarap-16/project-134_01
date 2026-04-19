const express = require('express');
const router = express.Router();
const { getResultsByQuiz, getStudentResults, getAllResults, getExamReport, getPublicExamReport, getQuizAttemptHistory } = require('../controllers/resultController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// Lecturer & Admin: view all results for a quiz
router.get('/quiz/:quizId', verifyToken, authorizeRoles('lecturer', 'admin'), getResultsByQuiz);

// Lecturer & Admin: view exam report
router.get('/report/:quizId', verifyToken, authorizeRoles('lecturer', 'admin'), getExamReport);

// Lecturer & Admin: view all results
router.get('/', verifyToken, authorizeRoles('lecturer', 'admin'), getAllResults);

// Student: view own results
router.get('/student', verifyToken, authorizeRoles('student'), getStudentResults);

// Student: view attempt history for a specific quiz
router.get('/history/:quizId', verifyToken, authorizeRoles('student'), getQuizAttemptHistory);

// Public (all students): download exam report after it ends
router.get('/quiz/:quizId/public-report', verifyToken, getPublicExamReport);

module.exports = router;