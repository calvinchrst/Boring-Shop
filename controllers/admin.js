const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/add-product', {
        docTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true, productCSS: true,
        activeAddProduct: true
    });
};

exports.postAddProduct = (req, res, next) => {
    product = new Product(req.body.title);
    product.save();
    res.redirect('/');
};

exports.getProducts = (req, res, next) => {
    products = Product.fetchAll((products) => {
        res.render('admin/product-list', {
            prods: products,
            docTitle: 'Admin All Products',
            path: "/admin/product-list"
        }); 
    });
}
