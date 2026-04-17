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


/**
 * @desc    Send OTP to email
 * @route   POST /api/auth/send-otp
 * @access  Public
 */
const sendOTP = async (req, res, next) => {
    try {
        let { email } = req.body;
        if (!email) return sendError(res, 'Email is required.', 400);
        email = email.toLowerCase().trim();

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) return sendError(res, 'Email is already registered.', 400);

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // Save OTP to DB
        await Otp.findOneAndUpdate(
            { email },
            { otp, createdAt: Date.now() },
            { upsert: true, new: true }
        );

        // Send Email using utility
        const emailSent = await sendEmail(
            email,
            'QuizHub Verification Code',
            `
                <div style="font-family: 'Calibri', sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 12px;">
                    <h2 style="color: #6366f1;">Welcome to QuizHub!</h2>
                    <p>Use the code below to complete your registration:</p>
                    <div style="background: #f3f4f6; padding: 16px; border-radius: 8px; font-size: 24px; font-weight: 800; letter-spacing: 4px; text-align: center; color: #1e2d45;">
                        ${otp}
                    </div>
                    <p style="color: #666; font-size: 13px; margin-top: 20px;">This code will expire in 10 minutes.</p>
                </div>
            `
        );

        if (!emailSent) {
            console.log(`[OTP FALLBACK] Verification code: ${otp} for ${email}`);
        }

        return sendSuccess(res, null, 'Verification code sent successfully to your email.');
    } catch (error) {
        next(error);
    }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return sendError(res, 'Wrong password or username', 401);
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return sendError(res, 'Wrong password or username', 401);
        }

        const token = generateToken(user._id);

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
            'Login successful.'
        );
    } catch (error) {
        next(error);
    }
};