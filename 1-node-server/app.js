const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const expressHandlebars = require("express-handlebars");

// app is a valid requestHandler so it can be passed to http.createServer
const app = express();
app.engine(
  "hbs",
  expressHandlebars.engine({
    layoutsDir: "views/layouts/",
    defaultLayout: "main-layout",
    extname: "hbs",
  })
);
// Templating engines
// app set sets values globally. Can be keys or configuration items
app.set("view engine", "hbs");
// No need to set views location like this because views is the default location in express.js. Just here as an example
app.set("views", "views");

// parser
app.use(bodyParser.urlencoded({ extended: false }));
// Serve public folder statically so that this folder is available in eg. html files
app.use(express.static(path.join(__dirname, "public")));

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// admin prefix route
// Inside the router using /admin in all URLs not required if calling express's router!!!
app.use("/admin", adminData.routes);
app.use(shopRoutes);

// 404 error page
app.use((req, res, next) => {
  res.status(404).render("404", { pageTitle: "Product not found" });
});

// Shortcut for http.createServer
app.listen(3000);
