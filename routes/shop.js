const path = require('path');

const express = require('express');

const productControllers = require('../controllers/products');

const adminData = require('./admin');

const router = express.Router();

router.get('/', productControllers.getProducts);

router.get('/shop/product-list/:productId', productControllers.getProductDetail);

module.exports = router;
