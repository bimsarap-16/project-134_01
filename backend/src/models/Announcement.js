const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Announcement title is required"],
            trim: true,
        },
        description: {
            type: String,
            required: [true, "Announcement description is required"],
        },
        fileUrl: {
            type: String,
            default: null,
        },
        fileName: {
            type: String,
            default: null,
        },
        fileType: {
            type: String,
            default: null,
        },
        moduleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Module",
            required: false,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Lecturer ID is required"],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Announcement", announcementSchema);
