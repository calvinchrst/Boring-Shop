const path = require('path');

const express = require('express');

const adminControllers = require('../controllers/admin');

const router = express.Router();

// /admin/add-product => GET
router.get('/add-product', adminControllers.getAddProduct);

// /admin/add-product => POST
router.post('/add-product', adminControllers.postAddProduct);

// /admin/product-list => GET
router.get('/product-list', adminControllers.getProducts);


module.exports = router;