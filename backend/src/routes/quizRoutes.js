const express = require('express');
const router = express.Router();
const {
    createQuiz,
    getQuizzesByModule,
    getQuizById,
    getAllQuizzes,
    updateQuiz,
} = require('../controllers/quizController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const { validate, quizSchema } = require('../middleware/validate');

router.get('/', verifyToken, getAllQuizzes);
router.get('/module/:moduleId', verifyToken, getQuizzesByModule);
router.get('/:id', verifyToken, getQuizById);
router.post('/', verifyToken, authorizeRoles('lecturer', 'admin'), validate(quizSchema), createQuiz);
router.put('/:id', verifyToken, authorizeRoles('lecturer', 'admin'), updateQuiz);

module.exports = router;