const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true },
      priceAtPurchase: { type: Number, required: true },
      title: { type: String }
    }
  ],
  shippingAddress: {
    street: String,
    city: String,
    state: String,
    zip: String
  },
  paymentDetails: {
    stripeSessionId: { type: String },
    status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  },
  totalAmount: { type: Number, required: true },
  invoiceUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
