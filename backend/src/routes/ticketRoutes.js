const express = require("express");
const { createTicket, getTicketsForLecturer, getTicketsForStudent, updateTicket, respondToTicket } = require("../controllers/ticketController");
const { verifyToken, authorizeRoles } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();