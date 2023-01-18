const express = require("express");

const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "public")))

const rootDir = path.dirname(require.main.filename)

app.get("/users", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "users.html"));
});

app.get("/", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "main.html"));
});

app.listen(3000);
