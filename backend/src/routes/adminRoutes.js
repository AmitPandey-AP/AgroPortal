const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getAllFarmers,
  deleteFarmer,
  getAllCustomers,
  deleteCustomer,
  getAllCropStock,
  deleteProduct,
  getAllQueries,
  deleteQuery,
} = require('../controllers/adminController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.use(protect);
router.use(restrictTo('admin'));

router.get('/stats', getAdminStats);
router.get('/farmers', getAllFarmers);
router.delete('/farmers/:id', deleteFarmer);
router.get('/customers', getAllCustomers);
router.delete('/customers/:id', deleteCustomer);
router.get('/stock', getAllCropStock);
router.delete('/stock/:id', deleteProduct);
router.get('/queries', getAllQueries);
router.delete('/queries/:id', deleteQuery);

module.exports = router;
