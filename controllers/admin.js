const Product = require("../models/product");

// exports.getProducts = (req, res, next) => {
//   Product.fetchAll()
//     .then(products => {
//       res.render("admin/products", {
//         prods: products,
//         pageTitle: "Admin Products",
//         path: "/admin/products"
//       });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };

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
  console.log("postAddProduct req.user._id", req.user);
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl
  });
  product
    .save()
    .then(result => {
      res.redirect("/admin/products");
      // console.log("Product Added");
    })
    .catch(err => {
      console.log(error);
    });
};

// exports.getEditProduct = (req, res, next) => {
//   const editMode = req.query.edit;
//   if (!editMode) {
//     return res.redirect("/");
//   }

//   const prodId = req.params.productId;
//   Product.fetchProductById(prodId)
//     .then(product => {
//       res.render("admin/edit-product", {
//         pageTitle: "Edit Product",
//         path: "/admin/edit-product",
//         product: product,
//         editMode: editMode
//       });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };

// exports.postEditProduct = (req, res, next) => {
//   productId = req.body.productId;
//   updatedTitle = req.body.title;
//   updatedImageUrl = req.body.imageUrl;
//   updatedDesc = req.body.description;
//   updatedPrice = req.body.price;
//   product = new Product(
//     updatedTitle,
//     updatedPrice,
//     updatedDesc,
//     updatedImageUrl,
//     productId
//   );

//   product
//     .save()
//     .then(result => {
//       console.log(result);
//       res.redirect("/admin/products");
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };

// exports.postDeleteProduct = (req, res, next) => {
//   productId = req.body.productId;
//   Product.deleteById(productId)
//     .then(() => {
//       res.redirect("/admin/products");
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };
