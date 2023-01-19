const express = require("express");

const router = express.Router();

const nameData = require("./name");

router.get("/users", (req, res, next) => {
  const names = nameData.names;
  res.render("name-list", {
    names: names,
    title: "Name list"
  });
});

module.exports = router;
