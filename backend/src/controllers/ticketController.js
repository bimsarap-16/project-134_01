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