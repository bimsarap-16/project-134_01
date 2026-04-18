const express = require("express");
const { createTicket, getTicketsForLecturer, getTicketsForStudent, updateTicket, respondToTicket } = require("../controllers/ticketController");
const { verifyToken, authorizeRoles } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();
// Route to create a ticket (students only)
router.post(
    "/",
    verifyToken,
    authorizeRoles("student", "admin"),
    upload.single("file"),
    createTicket
);

// Route to get tickets assigned to the logged-in lecturer
router.get(
    "/lecturer",
    verifyToken,
    authorizeRoles("lecturer", "admin"),
    getTicketsForLecturer
);

// Route to get tickets raised by the logged-in student
router.get(
    "/student",
    verifyToken,
    authorizeRoles("student", "admin"),
    getTicketsForStudent
);

// Route to update a ticket (students only, within 1 hour)
router.put(
    "/:id",
    verifyToken,
    authorizeRoles("student", "admin"),
    updateTicket
);

// Route to respond to a ticket (lecturers only)
router.post(
    "/:id/respond",
    verifyToken,
    authorizeRoles("lecturer", "admin"),
    respondToTicket
);