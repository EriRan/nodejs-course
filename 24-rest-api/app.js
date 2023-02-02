import express from "express";
import feedRoutes from "./routes/feed.js";
import bodyParser from "body-parser";

const app = express();

// Configuration must be added before routes!!!
app.use(bodyParser.json()); // application/json

app.use((req, res, next) => {
  // Instructor used wildcard instead of codepen.io here. That is very SUS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-HEADERS", "Content-Type, Authorization");
  next();
})

app.use("/feed", feedRoutes);

// Different port this time
app.listen(8080);
