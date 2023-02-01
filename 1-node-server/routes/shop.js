const path = require('path');

const express = require('express');

const shopController = require('../controllers/shop');
const isAuth = require("../middleware/is-auth");

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart', isAuth, shopController.getCart);

router.post('/cart', isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.get('/checkout', isAuth, shopController.getCheckout);

// Success page should be handled by Stripe because with this approach anyone can call this URL to create a new order
// Webhooks seemed to be the recommended approact
// https://stripe.com/docs/payments/after-the-payment
// https://stripe.com/docs/payments/checkout/fulfill-orders
router.get('/checkout/success', isAuth, shopController.getChecoutSuccess);

router.get('/checkout/cancel', isAuth, shopController.getCheckout);

router.get('/orders', isAuth, shopController.getOrders);

router.get('/orders/:orderId', isAuth, shopController.getInvoice);

module.exports = router;
