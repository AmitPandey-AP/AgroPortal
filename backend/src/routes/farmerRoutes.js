const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const {
  createProduct,
  getFarmerProducts,
  updateProduct,
  deleteProduct,
  getDashboardStats,
  getSellingHistory,
} = require('../controllers/farmerController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `product-${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB limit
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = allowed.test(path.extname(file.originalname).toLowerCase());
    const mime = allowed.test(file.mimetype);
    if (ext && mime) return cb(null, true);
    cb(new Error('Only JPEG, PNG, WEBP images are allowed'));
  },
});

router.use(protect);
router.use(restrictTo('farmer'));

router.route('/products')
  .post(upload.single('image'), createProduct)
  .get(getFarmerProducts);

router.route('/products/:id')
  .put(upload.single('image'), updateProduct)
  .delete(deleteProduct);

router.route('/dashboard-stats')
  .get(getDashboardStats);

router.route('/selling-history')
  .get(getSellingHistory);

module.exports = router;
