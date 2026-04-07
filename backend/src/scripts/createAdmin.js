require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const connectDB = require('../config/db');

// ✅ ADMIN CREDENTIALS — Change these if needed
const ADMIN_NAME     = 'Admin';
const ADMIN_EMAIL    = 'admin@agroportal.com';
const ADMIN_PASSWORD = 'Admin@1234';

const createAdmin = async () => {
  try {
    await connectDB();

    // Check if admin already exists
    const existing = await User.findOne({ email: ADMIN_EMAIL });

    if (existing) {
      console.log('⚠️  Admin already exists with email:', ADMIN_EMAIL);
      console.log('   Use these credentials to login:');
      console.log('   Email   :', ADMIN_EMAIL);
      console.log('   Password:', ADMIN_PASSWORD);
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt);

    // Create admin user
    await User.create({
      name: ADMIN_NAME,
      email: ADMIN_EMAIL,
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
    });

    console.log('✅  Admin user created successfully!');
    console.log('------------------------------------');
    console.log('   Email   :', ADMIN_EMAIL);
    console.log('   Password:', ADMIN_PASSWORD);
    console.log('------------------------------------');
    console.log('   Login at: http://localhost:5173/login');
    process.exit(0);

  } catch (error) {
    console.error('❌  Error creating admin:', error.message);
    process.exit(1);
  }
};

createAdmin();
