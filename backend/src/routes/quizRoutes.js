const express = require('express');
const router = express.Router();
const {
    createQuiz,
    getQuizzesByModule,
    getQuizById,
    updateQuiz,
    deleteQuiz,
    getAllQuizzes,
} = require('../controllers/quizController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const { validate, quizSchema } = require('../middleware/validate');

// All authenticated users
router.get('/', verifyToken, getAllQuizzes);
router.get('/module/:moduleId', verifyToken, getQuizzesByModule);
router.get('/:id', verifyToken, getQuizById);

// Lecturer & Admin only
router.post('/', verifyToken, authorizeRoles('lecturer', 'admin'), validate(quizSchema), createQuiz);
router.put('/:id', verifyToken, authorizeRoles('lecturer', 'admin'), updateQuiz);
router.delete('/:id', verifyToken, authorizeRoles('lecturer', 'admin'), deleteQuiz);

module.exports = router;
