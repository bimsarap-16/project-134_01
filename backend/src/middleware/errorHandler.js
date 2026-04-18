/**
 * Centralized error handling middleware
 */
const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        const formattedField = field.replace('_', ' ');
        message = `The ${formattedField} you entered already exists. Please use a different value or edit the existing record.`;
        statusCode = 400;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        message = Object.values(err.errors)
            .map((e) => e.message)
            .join(', ');
        statusCode = 400;
    }

    // Mongoose CastError (invalid ObjectId)
    if (err.name === 'CastError') {
        message = `Invalid ID format: ${err.value}`;
        statusCode = 400;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        message = 'Invalid token';
        statusCode = 401;
    }

    if (err.name === 'TokenExpiredError') {
        message = 'Token expired';
        statusCode = 401;
    }

    res.status(statusCode).json({
        success: false,
        message,
        data: null,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

module.exports = errorHandler;
