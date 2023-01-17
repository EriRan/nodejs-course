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
// use to add a middleware function
// Functions executed for every request
// Call next to move on to another middleware
app.use((req, res, next) => {
  console.log("In the middleware");
  next();
});

app.use((req, res, next) => {
  console.log("In another middleware");
  res.send("<h1>Hello from Express!</h1<");
});

// Shortcut for http.createServer
app.listen(3000);
