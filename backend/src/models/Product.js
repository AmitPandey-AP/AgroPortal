const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  stockQuantity: { type: Number, required: true },
  category: { type: String, enum: ['Vegetables', 'Fruits', 'Grains', 'Equipment'], required: true },
  images: [{ type: String }],
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
