const morgan = require('morgan');

/**
 * HTTP Request Logger using morgan
 */
const httpLogger = morgan(
    process.env.NODE_ENV === 'development' ? 'dev' : 'combined'
);

/**
 * Simple console logger utility
 */
const logger = {
    info: (msg) => console.log(`[INFO] ${new Date().toISOString()} - ${msg}`),
    warn: (msg) => console.warn(`[WARN] ${new Date().toISOString()} - ${msg}`),
    error: (msg) => console.error(`[ERROR] ${new Date().toISOString()} - ${msg}`),
};

module.exports = { httpLogger, logger };
