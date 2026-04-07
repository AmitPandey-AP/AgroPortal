const Product = require('../models/Product');
const Order = require('../models/Order');
const path = require('path');

// @desc    Create a product (supports multipart/form-data with image)
// @route   POST /api/farmer/products
// @access  Private/Farmer
const createProduct = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const price         = Number(req.body.price);
    const stockQuantity = Number(req.body.stockQuantity);

    if (!title) return res.status(400).json({ message: 'Title is required' });
    if (isNaN(price) || price < 0)         return res.status(400).json({ message: 'A valid price is required' });
    if (isNaN(stockQuantity) || stockQuantity < 0) return res.status(400).json({ message: 'A valid stock quantity is required' });

    // Build images array — if a file was uploaded by multer, use its path
    const images = [];
    if (req.file) {
      // Store as a relative URL accessible from the frontend
      images.push(`/uploads/${req.file.filename}`);
    }

    const product = new Product({
      farmer: req.user._id,
      title,
      description,
      price,
      stockQuantity,
      category,
      images,
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all products by logged in farmer
// @route   GET /api/farmer/products
// @access  Private/Farmer
const getFarmerProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user._id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/farmer/products/:id
// @access  Private/Farmer
const updateProduct = async (req, res) => {
  try {
    const { title, description, price, stockQuantity, category, images, isAvailable } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if product belongs to farmer
      if (product.farmer.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized to update this product' });
      }

      product.title = title || product.title;
      product.description = description || product.description;
      product.price = price || product.price;
      product.stockQuantity = stockQuantity || product.stockQuantity;
      product.category = category || product.category;
      product.images = images || product.images;
      if (isAvailable !== undefined) {
        product.isAvailable = isAvailable;
      }

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get Farmer Dashboard Stats
// @route   GET /api/farmer/dashboard-stats
// @access  Private/Farmer
const getDashboardStats = async (req, res) => {
  try {
    // Basic stats: total products, total products sold (from orders), total revenue
    const products = await Product.find({ farmer: req.user._id });
    const productIds = products.map(p => p._id);
    
    // Find all orders that contain products from this farmer
    const orders = await Order.find({ 'orderItems.product': { $in: productIds } });

    let totalRevenue = 0;
    let totalSales = 0;

    orders.forEach(order => {
      order.orderItems.forEach(item => {
        if (productIds.includes(item.product.toString())) {
            totalRevenue += item.priceAtPurchase * item.quantity;
            totalSales += item.quantity;
        }
      });
    });

    res.json({
      totalProducts: products.length,
      totalSales,
      totalRevenue
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get farmer's selling history (orders containing their products)
// @route   GET /api/farmer/selling-history
// @access  Private/Farmer
const getSellingHistory = async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user._id });
    const productIds = products.map(p => p._id);
    const productMap = {};
    products.forEach(p => { productMap[p._id.toString()] = p.title; });

    const orders = await Order.find({ 'orderItems.product': { $in: productIds } })
      .populate('customer', 'name email')
      .sort({ createdAt: -1 });

    const history = [];
    orders.forEach(order => {
      order.orderItems.forEach(item => {
        if (productIds.map(id => id.toString()).includes(item.product.toString())) {
          history.push({
            orderId: order._id,
            date: order.createdAt,
            customer: order.customer?.name || 'Unknown',
            customerEmail: order.customer?.email || '',
            cropName: item.title || productMap[item.product.toString()] || 'Unknown',
            quantity: item.quantity,
            price: item.priceAtPurchase,
            total: item.quantity * item.priceAtPurchase,
            paymentStatus: order.paymentDetails?.status || 'pending',
          });
        }
      });
    });

    res.json(history);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/farmer/products/:id
// @access  Private/Farmer
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    if (product.farmer.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProduct,
  getFarmerProducts,
  updateProduct,
  deleteProduct,
  getDashboardStats,
  getSellingHistory,
};
