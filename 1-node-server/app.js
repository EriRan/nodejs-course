const path = require("path");
const fs = require("fs");

const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const errorController = require("./controllers/error");
const User = require("./models/user");

require("dotenv").config();

const app = express();
const mongodbUrl = `mongodb+srv://${process.env.mongodb_user}:${process.env.mongodb_password}@${process.env.mongodb_cluster_address}/${process.env.mongodb_database}`;
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
    cb(null, Math.round(Math.random() * 1000000000) + "-" + file.originalname);
  },
});
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

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
// File processing middleware configuration
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
// Serve images from images folder at URL /images
app.use("/images", express.static(path.join(__dirname, "images")));
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

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.get("/500", errorController.get500);

app.use(helmet());
app.use(compression()); // I'm not sure if this does anything. Didn't seem to change served file size
app.use(morgan("combined", { stream: accessLogStream }));

app.use(errorController.get404);

// Special error handling middleware
app.use((error, req, res, next) => {
  console.error(error);
  res.redirect("/500");
});

mongoose
  .connect(mongodbUrl)
  .then((result) => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });
