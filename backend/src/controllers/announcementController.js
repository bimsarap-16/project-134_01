const Announcement = require("../models/Announcement");
const Module = require("../models/Module");

exports.createAnnouncement = async (req, res) => {
    try {
        const { title, description, moduleId } = req.body;
        let fileUrl = null;
        let fileName = null;
        let fileType = null;

        // Check if module exists only if provided
        if (moduleId) {
            const moduleExists = await Module.findById(moduleId);
            if (!moduleExists) {
                return res.status(404).json({ success: false, message: "Module not found." });
            }
        }

        if (req.file) {
            // Create a URL path relative to the domain, e.g., /uploads/filename.ext
            fileUrl = `/uploads/${req.file.filename}`;
            fileName = req.file.originalname;
            fileType = req.file.mimetype;
        }

        const announcement = await Announcement.create({
            title,
            description,
            fileUrl,
            fileName,
            fileType,
            moduleId: moduleId || null,
            createdBy: req.user.id, // From auth middleware
        });

        res.status(201).json({ success: true, data: announcement });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getAnnouncementsByModule = async (req, res) => {
    try {
        const { moduleId } = req.params;

        // Check if module exists
        const moduleExists = await Module.findById(moduleId);
        if (!moduleExists) {
            return res.status(404).json({ success: false, message: "Module not found." });
        }

        const announcements = await Announcement.find({ moduleId })
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: announcements });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.updateAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        let announcement = await Announcement.findById(id);

        if (!announcement) {
            return res.status(404).json({ success: false, message: "Announcement not found." });
        }

        // Check if requester is the creator
        if (announcement.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized to update this announcement." });
        }


        // Update fields
        if (title) announcement.title = title;
        if (description) announcement.description = description;

        // Handle new file if uploaded
        if (req.file) {
            announcement.fileUrl = `/uploads/${req.file.filename}`;
            announcement.fileName = req.file.originalname;
            announcement.fileType = req.file.mimetype;
        }

        await announcement.save();
        res.status(200).json({ success: true, data: announcement });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.deleteAnnouncement = async (req, res) => {
    try {
        const { id } = req.params;

        const announcement = await Announcement.findById(id);

        if (!announcement) {
            return res.status(404).json({ success: false, message: "Announcement not found." });
        }

        // Check if requester is the creator
        if (announcement.createdBy.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Not authorized to delete this announcement." });
        }


        await Announcement.findByIdAndDelete(id);
        res.status(200).json({ success: true, message: "Announcement deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getLecturerAnnouncements = async (req, res) => {
    try {
        const announcements = await Announcement.find({ createdBy: req.user.id })
            .populate("moduleId", "moduleName moduleCode")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: announcements });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getStudentAnnouncements = async (req, res) => {
    try {
        // Fetch student's modules to get announcements from those modules OR global ones
        // But for simplicity, we can just return all announcements from lecturers of modules the student is in
        // or just return ALL for now if the user wants "Global" removal.
        // Let's implement global + module-specific
        const studentModules = await Module.find({ /* some logic to find student modules if we had a mapping */ });
        // Since we don't have a direct Student-Module mapping in the current snippet, 
        // we'll just fetch ALL announcements created by lecturers.
        const announcements = await Announcement.find()
            .populate("moduleId", "moduleName moduleCode")
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });
        res.status(200).json({ success: true, data: announcements });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
