require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Serve uploaded product images statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Database Connection
connectDB();

// Basic route
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Import Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/farmer', require('./routes/farmerRoutes'));
app.use('/api/marketplace', require('./routes/marketplaceRoutes'));
app.use('/api/intelligence', require('./routes/intelligenceRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
