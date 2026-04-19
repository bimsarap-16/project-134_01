const mongoose = require('mongoose');

const AttemptSchema = new mongoose.Schema(
    {
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        quizId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz',
            required: true,
            index: true,
        },
        answers: [
            {
                questionId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Question',
                },
                selectedOption: {
                    type: Number, // index 0-3, or -1 for unanswered
                    default: -1,
                },
            },
        ],
        score: {
            type: Number,
            default: 0,
        },
        totalMarks: {
            type: Number,
            default: 0,
        },
        submittedAt: {
            type: Date,
            default: null,
        },
        startedAt: {
            type: Date,
            default: Date.now,
        },
        autoSubmitted: {
            type: Boolean,
            default: false,
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Compound index to prevent duplicate attempts per student per quiz
AttemptSchema.index({ studentId: 1, quizId: 1 });

module.exports = mongoose.model('Attempt', AttemptSchema);
