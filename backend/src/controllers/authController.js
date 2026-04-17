const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/Otp');
const { sendSuccess, sendError } = require('../utils/response');
const { sendEmail } = require('../utils/mail');

/**
 * Generate JWT token
 */
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
};


/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res, next) => {
    try {
        let { name, email, password, role, otp } = req.body;

        if (!email) return sendError(res, 'Email is required.', 400);
        email = email.toLowerCase().trim();
        if (otp) otp = otp.trim();

        if (!otp) {
            return sendError(res, 'Verification code is required.', 400);
        }

        const validOtp = await Otp.findOne({ email, otp });
        if (!validOtp) {
            return sendError(res, 'Invalid or expired verification code.', 400);
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendError(res, 'Email is already registered.', 400);
        }

        const user = await User.create({ name, email, password, role });
        const token = generateToken(user._id);

        // Send Registration Successful Email
        await sendEmail(
            email,
            'Registration Successful - QuizHub',
            `
                <div style="font-family: 'Calibri', sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
                    <h2 style="color: #6366f1;">Registration Successful!</h2>
                    <p>Hi <b>${name}</b>,</p>
                    <p>You have registered successfully on QuizHub as a <b>${role}</b>.</p>
                    <p>You can now log in and start your academic journey with us.</p>
                    <p style="color: #666; font-size: 13px; margin-top: 20px;">Welcome aboard!</p>
                </div>
            `
        );

        return sendSuccess(
            res,
            {
                token,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
            'User registered successfully.',
            201
        );
    } catch (error) {
        next(error);
    }
};