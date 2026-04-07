require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Product = require('../models/Product');
const CropData = require('../models/CropData');
const Order = require('../models/Order');

const connectDB = require('../config/db');

const importData = async () => {
  try {
    await connectDB();

    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    await CropData.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = await User.insertMany([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin',
        isVerified: true
      },
      {
        name: 'Farmer John',
        email: 'farmer@example.com',
        password: hashedPassword,
        role: 'farmer',
        isVerified: true,
        phone: '123-456-7890',
        address: { street: '123 Farm Lane', city: 'Agriville', state: 'CA', zip: '90000' }
      },
      {
        name: 'Customer Jane',
        email: 'customer@example.com',
        password: hashedPassword,
        role: 'customer',
        isVerified: true
      }
    ]);

    const farmerId = users[1]._id;

    await Product.insertMany([
      {
        farmer: farmerId,
        title: 'Organic Tomatoes',
        description: 'Fresh, juicy, pesticide-free tomatoes grown in open soil.',
        price: 3.50,
        stockQuantity: 100,
        category: 'Vegetables',
        images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      },
      {
        farmer: farmerId,
        title: 'Sweet Corn',
        description: 'Hand-picked yellow sweet corn.',
        price: 1.20,
        stockQuantity: 250,
        category: 'Grains',
        images: ['https://images.unsplash.com/photo-1550989460-0adf9ea622e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      },
      {
        farmer: farmerId,
        title: 'Premium Apple variety pack',
        description: 'Box of freshly harvested red and green apples.',
        price: 12.00,
        stockQuantity: 50,
        category: 'Fruits',
        images: ['https://images.unsplash.com/photo-1560806887-1e4cd0b6fac6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      },
      {
        farmer: farmerId,
        title: 'Vintage Tractor Parts',
        description: 'Quality refurbished parts for various farming equipment.',
        price: 150.00,
        stockQuantity: 5,
        category: 'Equipment',
        images: ['https://images.unsplash.com/photo-1616853609805-4f4007bbf8ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
      }
    ]);

    await CropData.insertMany([
      {
        nitrogen: 90, phosphorus: 42, potassium: 43, temperature: 20.8, humidity: 82, ph: 6.5, rainfall: 202.9,
        recommendedCrop: 'Rice',
        recommendedFertilizer: 'Urea'
      },
      {
        nitrogen: 85, phosphorus: 58, potassium: 41, temperature: 21.7, humidity: 80, ph: 5.9, rainfall: 226.6,
        recommendedCrop: 'Maize',
        recommendedFertilizer: 'DAP (Diammonium Phosphate)'
      },
      {
        nitrogen: 104, phosphorus: 18, potassium: 30, temperature: 23.6, humidity: 60, ph: 6.7, rainfall: 140.9,
        recommendedCrop: 'Coffee',
        recommendedFertilizer: 'MOP (Muriate of Potash)'
      }
    ]);

    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error('Error with data import', error);
    process.exit(1);
  }
};

importData();
