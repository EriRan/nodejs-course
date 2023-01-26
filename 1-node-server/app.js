const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const User = require("./models/user");

// Load local configuration file
require("dotenv").config();

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

app.use((req, res, next) => {
  // Hardcoded user id here
  User.findById("63d214cd8bdfe666acdb13c6")
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.error(err));
});

// Route logic commented out to verify that MongoDb works
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const errors = require("./controllers/error");

// admin prefix route
// Inside the router using /admin in all URLs not required if calling express's router!!!
app.use("/admin", adminRoutes);
app.use(shopRoutes);

// 404 error page
app.use(errors.get404);

const mongodbUrl = `mongodb+srv://${process.env.mongodb_user}:${process.env.mongodb_password}@${process.env.mongodb_cluster_address}/shop?retryWrites=true&w=majority`;
mongoose
  .connect(mongodbUrl)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => console.error(err));
