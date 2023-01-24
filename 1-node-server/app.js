const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const sequelize = require("./util/database");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");

// app is a valid requestHandler so it can be passed to http.createServer
const app = express();

// Templating engines
// app set sets values globally. Can be keys or configuration items
app.set("view engine", "ejs");
// No need to set views location like this because views is the default location in express.js. Just here as an example
app.set("views", "views");

// parser
app.use(bodyParser.urlencoded({ extended: false }));
// Serve public folder statically so that this folder is available in eg. html files
app.use(express.static(path.join(__dirname, "public")));

// Register middleware
// Only runs if npm server is started succesfully
// User guaranteed to be found
app.use((req, res, next) => {
  User.findByPk(1)
    .then((user) => {
      req.user = user;
      next(); // Need this so that user can be passed to next middlewares
    })
    .catch((err) => console.error(err));
});

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errors = require("./controllers/error");

// admin prefix route
// Inside the router using /admin in all URLs not required if calling express's router!!!
app.use("/admin", adminRoutes);
app.use(shopRoutes);

// 404 error page
app.use(errors.get404);

// SQL relations, "associations" in Sequelize
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem }); // CartItem is the link table. In addition to the link it holds the quantity
Product.belongsToMany(Cart, { through: CartItem });

sequelize
  .sync() // This overwrites the tables. Do not use this in production
  .then((result) => {
    return User.findByPk(1);
    // Shortcut for http.createServer
  })
  .then((user) => {
    if (!user) {
      return User.create({ name: "Max", email: "test@test.com" });
    }
    return Promise.resolve(user);
  })
  .then((user) => {
    // It keeps creating more carts despite relationships
    return user.createCart();
  })
  .then((cart) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.error(err);
  });
