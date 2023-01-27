const Product = require("../models/product");
const Order = require("../models/order");
const User = require("../models/user");

exports.getProducts = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/product-list", {
        prods: products,
        pageTitle: "All Products",
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        product: product,
        pageTitle: product.title,
        path: "/products",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.error(err));
};

exports.getIndex = (req, res, next) => {
  Product.find()
    .then((products) => {
      res.render("shop/index", {
        prods: products,
        pageTitle: "Shop",
        path: "/",
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.error(err);
    });
};

exports.getCart = (req, res, next) => {
  User.findById(req.session.user)
    .populate("cart.items.productId")
    .then((user) => {
      if (!user) {
        return res.render("shop/cart", {
          path: "/cart",
          pageTitle: "Your Cart",
          products: [],
          isAuthenticated: req.session.isLoggedIn,
        });
      }
      const products = user.cart.items;
      return res.render("shop/cart", {
        path: "/cart",
        pageTitle: "Your Cart",
        products: products,
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.error(err));
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  let mongoUser;
  User.findById(req.session.user)
    .then((user) => {
      mongoUser = user;
      return Product.findById(prodId);
    })
    .then((product) => {
      return mongoUser.addToCart(product);
    })
    .then((result) => {
      res.redirect("/cart");
    });
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  User.findById(req.session.user)
    .then((user) => {
      return user.removeFromCart(prodId);
    })
    .then((result) => {
      res.redirect("/cart");
    })
    .catch((err) => console.error(err));
};

exports.postOrder = (req, res, next) => {
  let mongoUser;
  User.findById(req.session.user)
    .populate("cart.items.productId")
    .then((user) => {
      mongoUser = user;
      const products = user.cart.items.map((i) => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          name: mongoUser.name,
          userId: mongoUser,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return mongoUser.clearCart();
    })
    .then(() => {
      res.redirect("/orders");
    })
    .catch((err) => console.error(err));
};

exports.getOrders = (req, res, next) => {
  if (!req.session.user) {
    res.render("shop/orders", {
      path: "/orders",
      pageTitle: "Your Orders",
      orders: [],
      isAuthenticated: req.session.isLoggedIn,
    });
  } else {
    Order.find({ "user.userId": req.session.user._id })
      .then((orders) => {
        res.render("shop/orders", {
          path: "/orders",
          pageTitle: "Your Orders",
          orders: orders,
          isAuthenticated: req.session.isLoggedIn,
        });
      })
      .catch((err) => console.log(err));
  }
};
