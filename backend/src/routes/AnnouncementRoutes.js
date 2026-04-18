const express = require("express");
const { 
    createAnnouncement, 
    getAnnouncementsByModule, 
    updateAnnouncement, 
    deleteAnnouncement,
    getLecturerAnnouncements,
    getStudentAnnouncements
} = require("../controllers/announcementController");
const { verifyToken, authorizeRoles } = require("../middleware/auth");
const upload = require("../middleware/upload");

const router = express.Router();

// Route to get announcements by module (accessible by students, lecturers, admins)
router.get("/module/:moduleId", verifyToken, getAnnouncementsByModule);

// Route to get all announcements for the current lecturer
router.get("/lecturer", verifyToken, authorizeRoles("lecturer", "admin"), getLecturerAnnouncements);

// Route to get all relevant announcements for a student
router.get("/student", verifyToken, authorizeRoles("student"), getStudentAnnouncements);

// Route to create an announcement (lecturers only)
router.post(
    "/",
    verifyToken,
    authorizeRoles("lecturer", "admin"), // assuming admin can also create if needed, or just lecturer
    upload.single("file"), // the field name for the file is 'file'
    createAnnouncement
);

// Route to update an announcement (lecturers only)
router.put(
    "/:id",
    verifyToken,
    authorizeRoles("lecturer", "admin"),
    upload.single("file"),
    updateAnnouncement
);

// Route to delete an announcement (lecturers only)
router.delete(
    "/:id",
    verifyToken,
    authorizeRoles("lecturer", "admin"),
    deleteAnnouncement
);

module.exports = router;
