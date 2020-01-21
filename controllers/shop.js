const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    products = Product.fetchAll((products) => {
        res.render('shop/product-list', {
            prods: products,
            docTitle: 'All Products',
            path: "/product-list"
        }); 
    });
}

exports.getIndex = (req, res, next) => {
    products = Product.fetchAll((products) => {
        res.render('shop/index', {
            prods: products,
            docTitle: 'Shop',
            path: "/"
        }); 
    });
}

exports.getCheckout = (req, res, next) => {
    products = Product.fetchAll((products) => {
        res.render('shop/checkout', {
            prods: products,
            docTitle: 'Checkout',
            path: "/checkout"
        }); 
    });
}

exports.getCart = (req, res, next) => {
    products = Product.fetchAll((products) => {
        res.render('shop/cart', {
            prods: products,
            docTitle: 'Cart',
            path: "/cart"
        }); 
    });
}

exports.getProductDetail = (req, res, next) => {
    productId = req.params.productId
    console.log("Getting product detail of", productId)
    products = Product.getProduct(productId, (product) => {
        res.render('shop/product-detail', {
            prod: product,
            docTitle: product.title,
            path: "/shop/product-detail"
        }); 
    });

}