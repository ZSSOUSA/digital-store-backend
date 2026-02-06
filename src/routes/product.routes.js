const express = require('express');
const ProductController = require('../controllers/ProductController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/product/search', ProductController.search);
router.get('/product/:id', ProductController.findById);

router.post('/product', authMiddleware, ProductController.create);

module.exports = router;
