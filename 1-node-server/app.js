/**
 * Most Node functionalities are not available by default
 * Node ships with a few core modules
 * http, https, fs, path, os
 * http: launch a server, send requests
 * https: Launch ssl encoded server
 */

// Node.js uses require to import most often?
// I like import more
const http = require("http");

const express = require("express");

// app is a valid requestHandler so it can be passed to http.createServer
const app = express();

app.use("/", (req, res, next) => {
  console.log("This always runs");
  next();
});

app.use("/add-product", (req, res, next) => {
  res.send("<h1>Add product</h1<");
});

app.use("/", (req, res, next) => {
  res.send("<h1>Default page</h1<");
});

// Shortcut for http.createServer
app.listen(3000);
