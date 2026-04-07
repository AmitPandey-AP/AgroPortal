const Product = require('../models/Product');
const Order = require('../models/Order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Fetch all available products
// @route   GET /api/marketplace/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    // Optionally add text search, category filtering, etc.
    const keyword = req.query.keyword ? {
      title: {
        $regex: req.query.keyword,
        $options: 'i',
      },
    } : {};

    const category = req.query.category ? { category: req.query.category } : {};

    const products = await Product.find({ ...keyword, ...category, isAvailable: true }).populate('farmer', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product detail
// @route   GET /api/marketplace/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('farmer', 'name email phone address');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create Stripe Checkout Session
// @route   POST /api/marketplace/checkout/create-session
// @access  Private/Customer
const createCheckoutSession = async (req, res) => {
  try {
    const { cartItems } = req.body;

    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'No items in cart' });
    }

    const lineItems = cartItems.map((item) => {
      return {
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.title,
            // images: [item.image], // Un-comment if you use valid URLs
          },
          unit_amount: Math.round(item.price * 100), // convert to cents
        },
        quantity: item.quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:5173/cart`,
      metadata: {
        userId: req.user._id.toString(),
        cartItems: JSON.stringify(cartItems.map(item => ({
             product: item._id, 
             quantity: item.quantity, 
             priceAtPurchase: item.price,
             title: item.title
        }))),
      }
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Verify Stripe session after redirect → create order + decrement stock
// @route   POST /api/marketplace/checkout/verify-session
// @access  Private/Customer
const verifyAndFulfillSession = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return res.status(400).json({ message: 'sessionId is required' });

    // Retrieve the session from Stripe to confirm payment
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return res.status(400).json({ message: 'Payment not completed' });
    }

    // Idempotency check — don't fulfil the same session twice
    const existing = await Order.findOne({ 'paymentDetails.stripeSessionId': sessionId });
    if (existing) {
      return res.json({ message: 'Already fulfilled', order: existing });
    }

    // Parse cart items stored in session metadata
    const cartItems = JSON.parse(session.metadata.cartItems || '[]');

    // 1. Decrement stock for each product
    for (const item of cartItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stockQuantity = Math.max(0, product.stockQuantity - item.quantity);
        if (product.stockQuantity === 0) product.isAvailable = false;
        await product.save();
      }
    }

    // 2. Create the order record
    const order = new Order({
      customer: session.metadata.userId,
      orderItems: cartItems,
      paymentDetails: {
        stripeSessionId: sessionId,
        status: 'completed',
      },
      totalAmount: session.amount_total / 100,  // Stripe sends amount in cents
    });
    await order.save();

    res.json({ message: 'Order fulfilled', order });
  } catch (error) {
    console.error('Fulfillment error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's orders
// @route   GET /api/marketplace/orders/my-orders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ customer: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Stripe Webhook for Order Fulfillment
// @route   POST /api/marketplace/webhook
// @access  Public (Called by Stripe)
const stripeWebhook = async (req, res) => {
  const payload = req.body;
  const sig = req.headers['stripe-signature'];
  // NOTE: For local testing, webhooks might be bypassed. A real implementation needs raw body auth.
  // We'll simulate order creation directly if required, or you can test by sending a mock webhook.

  // In a robust implementation:
  // let event;
  // try {
  //   event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  // } catch (err) {
  //   return res.status(400).send(`Webhook Error: ${err.message}`);
  // }
  
  // if (event.type === 'checkout.session.completed') {
  //   const session = event.data.object;
  //   const items = JSON.parse(session.metadata.cartItems);
  //   
  //   const order = new Order({
  //       customer: session.metadata.userId,
  //       orderItems: items,
  //       shippingAddress: session.shipping_details.address,
  //       paymentDetails: { stripeSessionId: session.id, status: 'completed' },
  //       totalAmount: session.amount_total / 100,
  //   });
  //   await order.save();
  //   // Add logic to decrement stockQuantity in Product model here
  // }

  res.status(200).end();
};

module.exports = {
  getProducts,
  getProductById,
  createCheckoutSession,
  verifyAndFulfillSession,
  getMyOrders,
  stripeWebhook
};
