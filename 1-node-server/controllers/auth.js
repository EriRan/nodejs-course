exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.get("Cookie").split("=")[1];
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: isLoggedIn === "true",
  });
};

exports.postLogin = (req, res, next) => {
  // Set cookie
  res.setHeader("Set-Cookie", "loggedIn=true");
  res.redirect("/");
};
