const express = require('express');
const router = express.Router();
const { register, login, getMe, sendOTP, forgotPassword, resetPassword } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');
const { validate, registerSchema, loginSchema } = require('../middleware/validate');

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/send-otp', sendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', verifyToken, getMe);

module.exports = router;
