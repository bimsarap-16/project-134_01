const express = require('express');
const router = express.Router();
const { startAttempt, submitAttempt } = require('../controllers/attemptController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');

// Students only
router.post('/start/:quizId', verifyToken, authorizeRoles('student'), startAttempt);
router.post('/submit/:quizId', verifyToken, authorizeRoles('student'), submitAttempt);

module.exports = router;
