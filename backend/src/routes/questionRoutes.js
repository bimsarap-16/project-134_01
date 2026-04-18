const express = require('express');
const router = express.Router();
const {
    createQuestion,
    getQuestionsByQuiz,
    updateQuestion,
    deleteQuestion,
} = require('../controllers/questionController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const { validate, questionSchema } = require('../middleware/validate');

// All authenticated users can get questions for a quiz
router.get('/quiz/:quizId', verifyToken, getQuestionsByQuiz);

// Lecturer & Admin only
router.post('/', verifyToken, authorizeRoles('lecturer', 'admin'), validate(questionSchema), createQuestion);
router.put('/:id', verifyToken, authorizeRoles('lecturer', 'admin'), updateQuestion);
router.delete('/:id', verifyToken, authorizeRoles('lecturer', 'admin'), deleteQuestion);

module.exports = router;
