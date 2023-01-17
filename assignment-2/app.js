const express = require("express");

const app = express();

// Step 2
/*
app.use((req, res, next) => {
  console.log("First funnel");
  next();
});

app.use((req, res, next) => {
  console.log("Second funnel");
  res.send("<h1>Second funnel response</h1>");
});
*/

// Step 3
app.get("/users", (req, res, next) => {
  console.log("/users middleware called")
  res.write("<h1>/users middleware</h1>");
  return res.end();
});

app.get("/", (req, res, next) => {
  console.log("/ middleware called")
  res.write("<h1>/ middleware</h1>");
  return res.end();
});

app.listen(3000);
