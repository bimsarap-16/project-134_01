const express = require('express');
const router = express.Router();
const {
    createModule,
    getModules,
    getModuleById,
    updateModule,
    deleteModule,
} = require('../controllers/moduleController');
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const { validate, moduleSchema } = require('../middleware/validate');

// All authenticated users can read modules
router.get('/', verifyToken, getModules);
router.get('/:id', verifyToken, getModuleById);

// Only Admin can create, update, delete modules
router.post('/', verifyToken, authorizeRoles('admin'), validate(moduleSchema), createModule);
router.put('/:id', verifyToken, authorizeRoles('admin'), validate(moduleSchema), updateModule);
router.delete('/:id', verifyToken, authorizeRoles('admin'), deleteModule);

module.exports = router;
