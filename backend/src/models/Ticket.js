const mongoose = require("mongoose");
const ticketSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        lecturerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        fileUrl: {
            type: String,
            default: "",
        },
        fileName: {
            type: String,
            default: "",
        },
        fileType: {
            type: String,
            default: "",
        },
        status: {
            type: String,
            enum: ["open", "resolved", "closed"],
            default: "open",
        },
        response: {
            type: String,
            default: "",
        },
        respondedAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);