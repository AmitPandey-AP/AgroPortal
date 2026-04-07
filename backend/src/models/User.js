const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['farmer', 'customer', 'admin'], required: true },
  isVerified: { type: Boolean, default: true },
  phone: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  dob: { type: String },
  state: { type: String },
  district: { type: String },
  city: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
