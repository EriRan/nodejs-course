const express = require("express");

const router = express.Router();

const names = [];

router.get("/", (req, res, next) => {
  res.render("add-name", {
    pageTitle: "Add Name",
    path: "add-name",
  });
});

router.post("/name", (req, res, next) => {
  names.push(req.body.name);
  console.log(names);
  res.redirect("/");
});

exports.routes = router;
exports.names = names;
