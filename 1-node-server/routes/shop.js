const express = require("express");
const path = require("path");

const router = express.Router();

router.get("/", (req, res, next) => {
  // No slashes to the path because path.join will automatically add them
  // Works in both Windows and Linux!!!!
  // This will be a pain to update if the package structure is changed
  res.sendFile(path.join(__dirname, "../", "views", "shop.html"));
});

module.exports = router;
