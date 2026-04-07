const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createCheckoutSession,
  verifyAndFulfillSession,
  getMyOrders,
  stripeWebhook
} = require('../controllers/marketplaceController');
const { protect } = require('../middleware/authMiddleware');

router.route('/products')
  .get(getProducts);

router.route('/products/:id')
  .get(getProductById);

router.route('/checkout/create-session')
  .post(protect, createCheckoutSession);

router.route('/checkout/verify-session')
  .post(protect, verifyAndFulfillSession);

router.route('/orders/my-orders')
  .get(protect, getMyOrders);

// Ensure Express does not parse this to JSON if using actual stripe webhooks (requires raw body). For now, it's just a placeholder.
router.route('/webhook')
  .post(stripeWebhook);

module.exports = router;
