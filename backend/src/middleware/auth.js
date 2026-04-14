const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendError } = require('../utils/response');

/**
 * Verify JWT Token middleware
 */
const verifyToken = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return sendError(res, 'Access denied. No token provided.', 401);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        if (!req.user) {
            return sendError(res, 'User not found. Token invalid.', 401);
        }
        next();
    } catch (err) {
        return sendError(res, 'Invalid or expired token.', 401);
    }
};

/**
 * Role-based authorization middleware
 * Usage: authorizeRoles('admin', 'lecturer')
 */
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return sendError(
                res,
                `Role '${req.user.role}' is not authorized to access this route.`,
                403
            );
        }
        next();
    };
};

module.exports = { verifyToken, authorizeRoles };
