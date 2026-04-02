const express = require('express');
const router = express.Router();
const { 
  getAllUsers, deleteUser, createUser, getLecturers, updateProfile, loginUser} = require('../controllers/userController');



router.post('/register', createUser);
router.post('/login', loginUser);
router.get('/lecturers', getLecturers);
router.put('/profile', updateProfile);
router.get('/', getAllUsers);
router.delete('/:id', deleteUser);

module.exports = router;