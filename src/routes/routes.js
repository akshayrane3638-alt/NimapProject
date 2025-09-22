const express = require('express');
const router = express.Router();
const productController = require('../controller/Product');

// -------- PRODUCT ROUTES (all POST) --------
router.post('/api/products/list', productController.listProducts);
router.post('/api/products/get', productController.getProduct);
router.post('/api/products/create', productController.createProduct);
router.post('/api/products/update', productController.updateProduct);
router.post('/api/products/delete', productController.deleteProduct);

// -------- CATEGORY ROUTES (all POST) --------
const categoryController = require('../controller/Categories');
router.post('/api/categories/list', categoryController.listCategories);
router.post('/api/categories/get', categoryController.getCategory);
router.post('/api/categories/create', categoryController.createCategory);
router.post('/api/categories/update', categoryController.updateCategory);
router.post('/api/categories/delete', categoryController.deleteCategory);

module.exports = router;

