import express from "express";
import feedRoutes from "./routes/feed.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { Server } from "socket.io";

// ES6 style of getting __dirname
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Math.round(Math.random() * 1000000000) + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

dotenv.config();

// Configuration must be added before routes!!!
app.use(bodyParser.json()); // application/json

// Multer
app.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
  }).single("image")
);

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
app.use("/auth", authRoutes);
app.use("/user", userRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    data: data,
  });
});

const mongodbUrl = `mongodb+srv://${process.env.mongodb_user}:${process.env.mongodb_password}@${process.env.mongodb_cluster_address}/messages`;

mongoose
  .connect(mongodbUrl)
  .then((result) => {
    // Different port this time because frontend application uses port 3000
    const server = app.listen(8080);
    // Setup Socket.io
    const io = new Server(server, {
      cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
      },
    });
    io.on("connection", (socket) => {
      console.log("a user connected");
    });
  })
  .catch((err) => {
    console.log(err);
  });
