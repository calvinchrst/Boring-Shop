const path = require("path");

const { validationResult } = require("express-validator/check");

const Product = require("../models/product");
const fileHelper = require("../util/file");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    errorMessage: "",
    oldInput: {
      title: "",
      imageUrl: "",
      price: "",
      description: ""
    },
    validationErrors: []
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const validationErrors = validationResult(req);
  const validationErrorsArray = validationResult(req).array();

  // Check if image file exist
  if (!image) {
    validationErrorsArray.push({
      param: "image"
    });

    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      errorMessage:
        "File selected is not an image. Please select image file only",
      oldInput: {
        title: title,
        price: price,
        description: description
      },
      validationErrors: validationErrorsArray
    });
  }

  // Check for any validation errors
  if (!validationErrors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      errorMessage: validationErrorsArray[0].msg,
      oldInput: {
        title: title,
        price: price,
        description: description
      },
      validationErrors: validationErrorsArray
    });
  }

  const imageUrl = "/" + image.path;

  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user
  });
  product
    .save()
    .then(result => {
      // console.log(result);
      console.log("Created Product");
      res.redirect("/admin/products");
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        errorMessage: "",
        oldInput: {
          title: product.title,
          price: product.price,
          description: product.description,
          _id: prodId
        },
        validationErrors: []
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImage = req.file;
  const updatedDesc = req.body.description;
  const validationErrors = validationResult(req);
  const validationErrorsArray = validationResult(req).array();

  // Check for any validation errors
  if (!validationErrors.isEmpty()) {
    return res.status(422).render("admin/edit-product", {
      pageTitle: "Add Product",
      path: "/admin/add-product",
      editing: false,
      errorMessage: validationErrorsArray[0].msg,
      oldInput: {
        title: updatedTitle,
        imageUrl: updatedImageUrl,
        price: updatedPrice,
        description: updatedDesc,
        _id: prodId
      },
      validationErrors: validationErrorsArray
    });
  }

  Product.findById(prodId)
    .then(product => {
      // Authorization: Only allow editing from user that creates the product
      if (product.userId.toString() !== req.user._id.toString()) {
        return res.redirect("/admin/products");
      }

      // Else user is authorized to edit the product
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      if (updatedImage) {
        originalImageFilePath = path.join(__dirname, "..", product.imageUrl);
        fileHelper.deleteFile(originalImageFilePath);
        // Only update image path in database if we receive new file image
        product.imageUrl = "/" + updatedImage.path;
      }
      return product.save().then(result => {
        console.log("UPDATED PRODUCT!");
        res.redirect("/admin/products");
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.getProducts = (req, res, next) => {
  Product.find({}) // Only show products created by logged in user
    // .select('title price -_id')
    // .populate('userId', 'name')
    .then(products => {
      console.log(products);
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products"
      });
    })
    .catch(err => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error);
    });
};

exports.deleteProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findOne({
    _id: prodId,
    userId: req.user._id
  }) // Authorization: Only allow deletion from user that creates the product
    .then(product => {
      if (!product) {
        return res.status(500).json({
          message:
            "Failed to delete Product: Product not found / User not authorized"
        });
      }

      // Delete the image of the product from file system
      originalImageFilePath = path.join(__dirname, "..", product.imageUrl);
      fileHelper.deleteFile(originalImageFilePath);

      // Delete the product from database
      return Product.deleteOne({
        _id: prodId,
        userId: req.user._id
      }).then(() => {
        return res.status(200).json({ message: "Success" });
      });
    })
    .catch(err => {
      return res
        .status(500)
        .json({ message: "Failed to delete product: System Error" });
    });
};
