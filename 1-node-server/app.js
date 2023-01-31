const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");

const errorController = require("./controllers/error");
const User = require("./models/user");

require("dotenv").config();

const app = express();
const mongodbUrl = `mongodb+srv://${process.env.mongodb_user}:${process.env.mongodb_password}@${process.env.mongodb_cluster_address}/shop`;
const store = new MongoDBStore({
  uri: mongodbUrl,
  collection: "sessions",
});
const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  }
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

if (
  !process.env.express_session_secret ||
  !process.env.express_session_secret.length
) {
  throw Error("express_session_secret not set");
}

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(multer({dest: "images"}).single("image"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.express_session_secret,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(csrfProtection);
app.use(flash());

// Include some variables on every request
// This includes CSRF token from csurf that is required for every request to avoid Cross Request Forgery attacks
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Middleware to find the same user from mongoDb that is in the current session
// Session data also comes from MongoDb
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      // Always wrap errors inside next. Otherwise they will not pass to the error handling middlewares
      next(new Error(err));
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);

app.use(errorController.get404);

// Special error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.redirect("/500");
});

mongoose
  .connect(mongodbUrl)
  .then((result) => {
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
