const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema(
    {
        quizId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quiz',
            required: true,
            index: true,
        },
        questionText: {
            type: String,
            required: [true, 'Question text is required'],
            trim: true,
        },
        options: {
            type: [String],
            validate: {
                validator: function (v) {
                    return v.length === 4;
                },
                message: 'Each question must have exactly 4 options',
            },
            required: true,
        },
        correctAnswer: {
            type: Number, // index 0-3
            required: [true, 'Correct answer index is required'],
            min: 0,
            max: 3,
        },
        topic: {
            type: String,
            trim: true,
            default: '',
        },
        marks: {
            type: Number,
            required: [true, 'Marks is required'],
            min: [1, 'Marks must be at least 1'],
            default: 1,
        },
        explanation: {
            type: String,
            trim: true,
            default: '',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Question', QuestionSchema);
