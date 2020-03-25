const Product = require("../models/product");
// const Cart = require("../models/cart");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products"
      });
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.fetchProductById(prodId)
    .then(product => {
      if (product) {
        console.log(product);
        res.render("shop/product-detail", {
          product: product,
          pageTitle: product.title,
          path: "/products"
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/"
      });
    })
    .catch(err => {
      console.log(err);
    });
};

// exports.getCart = (req, res, next) => {
//   req.user
//     .getCart()
//     .then(cart => {
//       return cart.getProducts();
//     })
//     .then(products => {
//       res.render("shop/cart", {
//         path: "/cart",
//         pageTitle: "Your Cart",
//         products: products
//       });
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };

// exports.postCart = (req, res, next) => {
//   const productId = req.body.productId;
//   let fetchedCart;
//   let newQuantity;
//   req.user
//     .getCart()
//     .then(cart => {
//       fetchedCart = cart;
//       return cart.getProducts({ where: { id: productId } });
//     })
//     .then(products => {
//       let product;
//       newQuantity = 1;
//       if (products.length > 0) {
//         // Product is already in cart. Just increase the quantity
//         product = products[0];
//         newQuantity = product.cartItem.quantity + 1;
//         console.log("product Found!");
//       }
//       return Product.findByPk(productId);
//     })
//     .then(product => {
//       return fetchedCart.addProduct(product, {
//         through: { quantity: newQuantity }
//       });
//     })
//     .then(() => {
//       res.redirect("/cart");
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };

// exports.postCartDeleteItem = (req, res, next) => {
//   const productId = req.body.productId;
//   req.user
//     .getCart()
//     .then(cart => {
//       return cart.getProducts({ where: { id: productId } });
//     })
//     .then(products => {
//       const product = products[0];
//       if (product) {
//         return product.cartItem.destroy();
//       }
//     })
//     .then(result => {
//       res.redirect("/cart");
//     })
//     .catch(err => console.log(err));
// };

// exports.getOrders = (req, res, next) => {
//   req.user
//     .getOrders({ include: ["products"] })
//     .then(orders =>
//       res.render("shop/orders", {
//         path: "/orders",
//         pageTitle: "Your Orders",
//         orders: orders
//       })
//     )
//     .catch(err => console.log(err));
// };

// exports.postCreateOrder = (req, res, next) => {
//   let fetchedCartProducts, fetchedCart;
//   req.user
//     .getCart()
//     .then(cart => {
//       fetchedCart = cart;
//       return cart.getProducts();
//     })
//     .then(products => {
//       // Only create a new order if there is a product in cart
//       if (products.length == 0) {
//         console.log("No Item in cart to checkout!");
//         res.redirect("/cart");
//       }

//       fetchedCartProducts = products;

//       // Create an order
//       return req.user.createOrder();
//     })
//     .then(order => {
//       return order.addProducts(
//         fetchedCartProducts.map(product => {
//           product.orderItem = { quantity: product.cartItem.quantity };
//           return product;
//         })
//       );
//     })
//     .then(result => {
//       fetchedCart.setProducts(null);
//     })
//     .then(result => {
//       res.redirect("/orders");
//     })
//     .catch(err => {
//       console.log(err);
//     });
// };
