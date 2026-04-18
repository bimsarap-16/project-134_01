const Ticket = require("../models/Ticket");

exports.createTicket = async (req, res) => {
    try {
        const { title, description, lecturerId } = req.body;

        if (!title || !description || !lecturerId) {
            return res.status(400).json({ success: false, message: "Title, description, and lecturer ID are required." });
        }

        const newTicketParts = {
            title,
            description,
            lecturerId,
            studentId: req.user.id,
            status: "open",
        };

        if (req.file) {
            newTicketParts.fileUrl = `/uploads/${req.file.filename}`;
            newTicketParts.fileName = req.file.originalname;
            newTicketParts.fileType = req.file.mimetype;
        }

        const ticket = await Ticket.create(newTicketParts);
        res.status(201).json({ success: true, data: ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getTicketsForLecturer = async (req, res) => {
    try {
        const tickets = await Ticket.find({ lecturerId: req.user.id })
            .populate("studentId", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: tickets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getTicketsForStudent = async (req, res) => {
    try {
        const tickets = await Ticket.find({ studentId: req.user.id })
            .populate("lecturerId", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({ success: true, data: tickets });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.updateTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, lecturerId } = req.body;
        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found." });
        }

        if (ticket.studentId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "You are not authorized to edit this ticket." });
        }

        const hour = 60 * 60 * 1000;
        if (new Date() - new Date(ticket.createdAt) > hour) {
            return res.status(400).json({ success: false, message: "Tickets can only be edited within 1 hour of creation." });
        }

        if (title) ticket.title = title;
        if (description) ticket.description = description;
        if (lecturerId) ticket.lecturerId = lecturerId;

        await ticket.save();
        res.status(200).json({ success: true, data: ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.respondToTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { response } = req.body;
        const ticket = await Ticket.findById(id);

        if (!ticket) {
            return res.status(404).json({ success: false, message: "Ticket not found." });
        }

        if (ticket.lecturerId.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Only the assigned lecturer can respond to this ticket." });
        }

        if (!response) {
            return res.status(400).json({ success: false, message: "Response content is required." });
        }

        ticket.response = response;
        ticket.status = "resolved";
        ticket.respondedAt = new Date();

        await ticket.save();
        res.status(200).json({ success: true, data: ticket });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};