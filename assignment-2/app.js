const express = require("express");

const app = express();

// Step 2
app.use((req, res, next) => {
  console.log("First funnel");
  next();
});

app.use((req, res, next) => {
  console.log("Second funnel");
  res.send("<h1>Second funnel response</h1<");
});

app.listen(3000);