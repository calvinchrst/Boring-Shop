const Product = require("../models/product");
const Cart = require("../models/cart");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editMode: false
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  Product.create({
    title: title,
    imageUrl: imageUrl,
    price: price,
    description: description
  })
    .then(() => {
      res.redirect("/admin/products");
      console.log("Product Added");
    })
    .catch(err => {
      console.log(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }

  const prodId = req.params.productId;
  Product.findById(prodId, product => {
    if (!product) {
      return res.redirect("/");
    }

    res.render("admin/edit-product", {
      pageTitle: "Edit Product",
      path: "/admin/edit-product",
      product: product,
      editMode: editMode
    });
  });
};

exports.postEditProduct = (req, res, next) => {
  productId = req.body.productId;
  updatedTitle = req.body.title;
  updatedImageUrl = req.body.imageUrl;
  updatedDesc = req.body.description;
  updatedPrice = req.body.price;
  newProduct = new Product(
    productId,
    updatedTitle,
    updatedImageUrl,
    updatedDesc,
    updatedPrice
  );
  newProduct.save();
  res.redirect("/admin/products");
};

exports.postDeleteProduct = (req, res, next) => {
  productId = req.body.productId;
  Product.findById(productId, product => {
    if (product) {
      Product.deletedById(productId);
      Cart.deleteProduct(productId, product.price);
      res.redirect("/admin/products");
    } // else do nothing if product is not found
  });
};

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(([rows, fieldData]) => {
      res.render("admin/products", {
        prods: rows,
        pageTitle: "Admin Products",
        path: "/admin/products"
      });
    })
    .catch(err => {
      console.log(err);
    });
};
