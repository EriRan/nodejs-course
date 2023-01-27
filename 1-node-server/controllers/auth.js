const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        console.error("User not found");
      }
      req.session.user = user;
      req.session.isLoggedIn = true;
      // Call session.save() in order to guarantee that we have a session in MongoDb before redirecting
      return req.session.save(err => {
        if (err) {
          console.error(err)
        }
        return res.redirect("/");
      });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    // Cookie not deleted because the browser will clear it on its own
    return res.redirect("/");
  });
};

exports.postSignup = (req, res, next) => {};