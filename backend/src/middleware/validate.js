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
