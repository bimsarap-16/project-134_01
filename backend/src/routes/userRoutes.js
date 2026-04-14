const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser, createUser, getLecturers, updateProfile } = require('../controllers/userController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const { validate, adminUserSchema } = require('../middleware/validate');

router.get('/lecturers', verifyToken, getLecturers);
router.put('/profile', verifyToken, updateProfile);

router.use(verifyToken, authorizeRoles('admin'));

router.get('/', getAllUsers);
router.post('/', validate(adminUserSchema), createUser);
router.delete('/:id', deleteUser);

module.exports = router;
