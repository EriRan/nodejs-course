import express from "express";
import feedRoutes from "./routes/feed.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// ES6 style of getting __dirname
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

dotenv.config();

// Configuration must be added before routes!!!
app.use(bodyParser.json()); // application/json

app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  // Instructor used wildcard instead of codepen.io here. That is very SUS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-HEADERS", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({
    message: message,
  });
});

const mongodbUrl = `mongodb+srv://${process.env.mongodb_user}:${process.env.mongodb_password}@${process.env.mongodb_cluster_address}/messages`;

mongoose
  .connect(mongodbUrl)
  .then((result) => {
    // Different port this time because frontend application uses port 3000
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
