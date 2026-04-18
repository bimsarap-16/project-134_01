const Joi = require('joi');
const { sendError } = require('../utils/response');

/**
 * Validate request body against a Joi schema
 * Usage: validate(schema)
 */
const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
        const message = error.details.map((d) => d.message.replace(/"/g, '')).join(', ');
        return sendError(res, message, 422);
    }
    next();
};

// ─── Auth Schemas ───────────────────────────────────────────────────────────


const registerSchema = Joi.object({
    name: Joi.string().min(4).max(100).required(),
    email: Joi.string().email().lowercase().trim().required(),
    password: Joi.string()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
        .required()
        .messages({
            'string.pattern.base': 'Password must be at least 8 characters long and include: uppercase, lowercase, and number.',
        }),
    otp: Joi.string().length(6).required(),
    role: Joi.string().valid('admin', 'lecturer', 'student').default('student'),
});

// ─── Question Schemas ────────────────────────────────────────────────────────

const questionSchema = Joi.object({
    quizId: Joi.string().required(),
    questionText: Joi.string().min(5).required(),
    options: Joi.array().items(Joi.string()).length(4).required(),
    correctAnswer: Joi.number().min(0).max(3).required(),
    topic: Joi.string().allow(''),
    marks: Joi.number().min(1).default(1),
}).unknown(true);

// ─── Chatbot Schema ───────────────────────────────────────────────────────────

const chatSchema = Joi.object({
    message: Joi.string().min(1).max(2000).required(),
});

module.exports = {
    validate,
    registerSchema,
    adminUserSchema,
    loginSchema,
    moduleSchema,
    quizSchema,
    questionSchema,
    chatSchema,
};
