const path = require('path');

const express = require('express');

const productControllers = require('../controllers/products');

const adminData = require('./admin');

const router = express.Router();

router.get('/', productControllers.getProducts);

module.exports = router;
