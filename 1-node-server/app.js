const express = require("express");
const bodyParser = require("body-parser");

// app is a valid requestHandler so it can be passed to http.createServer
const app = express();

// parser
app.use(bodyParser.urlencoded({ extended: false }));

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(adminRoutes);
app.use(shopRoutes);

// 404 error page
app.use((req, res, next) => {
  res.status(404).send("<h1>Page not found</h1>");
})

// Shortcut for http.createServer
app.listen(3000);
