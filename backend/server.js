require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./src/config/db');
const { httpLogger } = require('./src/utils/logger');
const errorHandler = require('./src/middleware/errorHandler');

// ─── Route imports ────────────────────────────────────────────────────────────
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const moduleRoutes = require('./src/routes/moduleRoutes');
const quizRoutes = require('./src/routes/quizRoutes');
const questionRoutes = require('./src/routes/questionRoutes');
const attemptRoutes = require('./src/routes/attemptRoutes');
const resultRoutes = require('./src/routes/resultRoutes');
const chatbotRoutes = require('./src/routes/chatbotRoutes');
const announcementRoutes = require('./src/routes/announcementRoutes');
const ticketRoutes = require('./src/routes/ticketRoutes');

// ─── Connect to Database ──────────────────────────────────────────────────────
connectDB();
const mongoose = require('mongoose');
mongoose.set('debug', true);

const app = express();

// ─── Body Parser ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Static Files ─────────────────────────────────────────────────────────────
app.use('/uploads', express.static('uploads'));

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
    cors({
        origin: process.env.FRONTEND_URL || '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

// ─── HTTP Logging (Disabled) ──────────────────────────────────────────────────
// app.use(httpLogger);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/api/health', (req, res, next) => {
    res.status(200).json({
        success: true,
        message: 'QuizBank API is running 🚀',
        data: { timestamp: new Date().toISOString(), env: process.env.NODE_ENV },
    });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/attempt', attemptRoutes);
app.use('/api/results', resultRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/tickets', ticketRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found.`,
        data: null,
    });
});

// ─── Centralized Error Handler ────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    console.log(`📡 API Base: http://localhost:${PORT}/api`);
    console.log(`❤️  Health: http://localhost:${PORT}/api/health\n`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error(`❌ Unhandled Rejection: ${err.message}`);
    server.close(() => process.exit(1));
});
