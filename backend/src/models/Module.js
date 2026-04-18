const mongoose = require('mongoose');

const ModuleSchema = new mongoose.Schema(
    {
        moduleName: {
            type: String,
            required: [true, 'Module name is required'],
            trim: true,
        },
       moduleCode: {
            type: String,
            required: [true, "Module code is required"],
            unique: true,
            trim: true,
            uppercase: true,
},
        semester: {
            type: String,
            required: [true, 'Semester is required'],
            trim: true,
        },
        description: {
            type: String,
            trim: true,
            maxlength: [1000, 'Description cannot exceed 1000 characters'],
        },
        topics: {
            type: [String],
            default: [],
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Module', ModuleSchema);
