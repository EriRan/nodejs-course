const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

// app is a valid requestHandler so it can be passed to http.createServer
const app = express();

// parser
app.use(bodyParser.urlencoded({ extended: false }));

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// admin prefix route
// Inside the router using /admin in all URLs not required if calling express's router!!!
app.use("/admin", adminRoutes);
app.use(shopRoutes);

// 404 error page
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "page-not-found.html"));
})

// Shortcut for http.createServer
app.listen(3000);
