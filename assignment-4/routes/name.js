const express = require("express");

const router = express.Router();

const names = [];

router.get("/", (req, res, next) => {
  res.render("add-name", {
    title: "Add Name",
    path: "add-name",
  });
});

router.post("/name", (req, res, next) => {
  names.push(req.body.name);
  res.redirect("/");
});

exports.routes = router;
exports.names = names;
