/**
 * Most Node functionalities are not available by default
 * Node ships with a few core modules
 * http, https, fs, path, os
 * http: launch a server, send requests
 * https: Launch ssl encoded server
 */

// Node.js uses require to import most often?
// I like import more

const express = require("express");
const bodyParser = require("body-parser");

// app is a valid requestHandler so it can be passed to http.createServer
const app = express();

// parser
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/", (req, res, next) => {
  next();
});

app.use("/add-product", (req, res, next) => {
  res.send(
    "<form action='/product' method='POST'><input type='text' name='title'><button type='submit'>Add</button></form>"
  );
});

app.use("/product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/");
});

app.use("/", (req, res, next) => {
  res.send("<h1>Default page</h1>");
});

// Shortcut for http.createServer
app.listen(3000);
