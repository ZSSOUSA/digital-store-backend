const express = require('express');
const CategoryController = require('../controllers/CategoryController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/category/search', CategoryController.search);
router.get('/category/:id', CategoryController.findById);
router.post('/category', authMiddleware, CategoryController.create);



module.exports = router;
