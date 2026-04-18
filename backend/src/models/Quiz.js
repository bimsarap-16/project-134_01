const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Quiz title is required'],
            trim: true,
        },
        moduleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Module',
            required: true,
            index: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        quizType: {
            type: String,
            enum: ['practice', 'exam'],
            required: true,
        },
        // scheduling validation logic
        scheduledStart: {
            type: Date,
            default: null,
        },
        scheduledEnd: {
            type: Date,
            default: null,
        },
        duration: {
            type: Number,
            required: [true, 'Duration is required'],
            min: [1, 'Duration must be at least 1 minute'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        attemptsAllowed: {
            type: Number,
            default: 1,
            min: [1, 'At least 1 attempt must be allowed'],
        },
    },
    { timestamps: true }
);

QuizSchema.pre('save', async function () {
    if (this.quizType === 'exam') {
        if (!this.scheduledStart || !this.scheduledEnd) {
            throw new Error('Exam quizzes must have scheduledStart and scheduledEnd');
        }
        if (this.scheduledEnd <= this.scheduledStart) {
            throw new Error('scheduledEnd must be after scheduledStart');
        }
    }
});

module.exports = mongoose.model('Quiz', QuizSchema);