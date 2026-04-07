const User = require('../models/User');
const Product = require('../models/Product');
const Contact = require('../models/Contact');

// @desc    Get admin stats
// @route   GET /api/admin/stats
const getAdminStats = async (req, res) => {
  try {
    const farmerCount = await User.countDocuments({ role: 'farmer' });
    const customerCount = await User.countDocuments({ role: 'customer' });
    const productCount = await Product.countDocuments();
    const queryCount = await Contact.countDocuments();
    res.json({ farmerCount, customerCount, productCount, queryCount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all farmers
// @route   GET /api/admin/farmers
const getAllFarmers = async (req, res) => {
  try {
    const farmers = await User.find({ role: 'farmer' }).select('-password');
    res.json(farmers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a farmer
// @route   DELETE /api/admin/farmers/:id
const deleteFarmer = async (req, res) => {
  try {
    const farmer = await User.findById(req.params.id);
    if (!farmer || farmer.role !== 'farmer')
      return res.status(404).json({ message: 'Farmer not found' });
    await farmer.deleteOne();
    res.json({ message: 'Farmer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all customers
// @route   GET /api/admin/customers
const getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' }).select('-password');
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a customer
// @route   DELETE /api/admin/customers/:id
const deleteCustomer = async (req, res) => {
  try {
    const customer = await User.findById(req.params.id);
    if (!customer || customer.role !== 'customer')
      return res.status(404).json({ message: 'Customer not found' });
    await customer.deleteOne();
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all crop stocks (products)
// @route   GET /api/admin/stock
const getAllCropStock = async (req, res) => {
  try {
    const products = await Product.find().populate('farmer', 'name email state district');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/admin/stock/:id
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    await product.deleteOne();
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all contact queries
// @route   GET /api/admin/queries
const getAllQueries = async (req, res) => {
  try {
    const queries = await Contact.find().sort({ createdAt: -1 });
    res.json(queries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a contact query
// @route   DELETE /api/admin/queries/:id
const deleteQuery = async (req, res) => {
  try {
    const query = await Contact.findById(req.params.id);
    if (!query) return res.status(404).json({ message: 'Query not found' });
    await query.deleteOne();
    res.json({ message: 'Query deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminStats,
  getAllFarmers,
  deleteFarmer,
  getAllCustomers,
  deleteCustomer,
  getAllCropStock,
  deleteProduct,
  getAllQueries,
  deleteQuery,
};
