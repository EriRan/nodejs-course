const express = require("express");
const path = require("path");

const router = express.Router();

const shopController = require("../controllers/shop");

// Order of the router.gets is important. eg. /products/delete would clash with /products/:productId
router.get("/", shopController.getIndex);

router.get("/products", shopController.getProducts);
router.get("/products/:productId", shopController.getProduct);
router.post("/cart", shopController.postCart);


/*
* TODO: Convert to MongoDb
router.get("/cart", shopController.getCart);

router.post("/cart-delete-item", shopController.postCartDeleteProduct);
router.post("/create-order", shopController.postOrder);
router.get("/orders", shopController.getOrders);
*/

module.exports = router;
