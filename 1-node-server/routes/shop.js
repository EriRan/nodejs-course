const express = require("express");
const path = require("path");

const router = express.Router();

const shopController = require("../controllers/shop");

router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);
// Dynamic id example
// Order of the router.gets is important. eg. /products/delete would clash with /products/:productId
router.get("/products/:productId", shopController.getProduct);
router.get("/cart", shopController.getCart);
router.get("/orders", shopController.getOrders);
router.get("/checkout", shopController.getCheckout);

module.exports = router;
