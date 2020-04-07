const express = require("express");
const { body } = require("express-validator/check");

const adminController = require("../controllers/admin");
const isAuth = require("../middleware/is-auth");

const router = express.Router();

// /admin/add-product => GET
router.get("/add-product", isAuth, adminController.getAddProduct);

// /admin/products => GET
router.get("/products", isAuth, adminController.getProducts);

// /admin/add-product => POST
router.post(
  "/add-product",
  isAuth,
  [
    body("title", "Please input Title with at least 3 characters")
      .trim()
      .isLength({ min: 3 }),
    body("price", "Please input a valid Price").isFloat(),
    body("description", "Please input Description with at least 5 characters")
      .trim()
      .isLength({ min: 5, max: 400 })
  ],
  adminController.postAddProduct
);

router.get("/edit-product/:productId", isAuth, adminController.getEditProduct);

router.post(
  "/edit-product",
  isAuth,
  [
    body("title", "Please input Title with at least 3 characters")
      .trim()
      .isLength({ min: 3 }),
    body("price", "Please input a valid Price").isFloat(),
    body("description", "Please input Description between 5 - 400 characters")
      .trim()
      .isLength({ min: 5, max: 400 })
  ],
  adminController.postEditProduct
);

router.delete("/product/:productId", isAuth, adminController.deleteProduct);

module.exports = router;
