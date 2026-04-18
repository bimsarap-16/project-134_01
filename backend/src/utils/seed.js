require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../config/db');

const seedAdmin = async () => {
    await connectDB();

    try {
        const existingAdmin = await User.findOne({ email: process.env.ADMIN_EMAIL });

        if (existingAdmin) {
            console.log(`✅ Admin already exists: ${existingAdmin.email}`);
            process.exit(0);
        }

        const admin = await User.create({
            name: process.env.ADMIN_NAME || 'Super Admin',
            email: process.env.ADMIN_EMAIL || 'admin@quizbank.com',
            password: process.env.ADMIN_PASSWORD || 'Admin@123456',
            role: 'admin',
        });

        console.log('🎉 Admin account created successfully!');
        console.log('─────────────────────────────────────────');
        console.log(`   Name:     ${admin.name}`);
        console.log(`   Email:    ${admin.email}`);
        console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin@123456'}`);
        console.log(`   Role:     ${admin.role}`);
        console.log('─────────────────────────────────────────');
        console.log('⚠️  Change the admin password after first login!');

        process.exit(0);
    } catch (error) {
        console.error(`❌ Seeding failed: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
