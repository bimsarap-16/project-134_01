// ─── Quiz Schemas ────────────────────────────────────────────────────────────

const quizSchema = Joi.object({
    title: Joi.string().min(3).max(300).required(),
    moduleId: Joi.string().required(),
    quizType: Joi.string().valid('practice', 'exam').required(),
    scheduledStart: Joi.date().when('quizType', { is: 'exam', then: Joi.required() }),
    scheduledEnd: Joi.date().when('quizType', { is: 'exam', then: Joi.required() }),
    duration: Joi.number().min(1).required(),
    isActive: Joi.boolean(),
    attemptsAllowed: Joi.number().min(1).default(1),
}).unknown(true);


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
