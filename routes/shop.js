const path = require('path');

const express = require('express');

const shopControllers = require('../controllers/shop');

const adminData = require('./admin');

const router = express.Router();

router.get('/', shopControllers.getIndex);

router.get('/product-list', shopControllers.getProducts);

router.get('/cart', shopControllers.getCart);

router.get('/checkout', shopControllers.getCheckout);

router.get('/shop/product-detail/:productId', shopControllers.getProductDetail);

module.exports = router;
