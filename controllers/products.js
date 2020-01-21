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
        res.render('shop/product-list', {
            prods: products,
            docTitle: 'Shop',
            path: "/",
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
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