import express from "express";
import feedRoutes from "./routes/feed.js";
import bodyParser from "body-parser";

const app = express();

// Configuration must be added before routes!!!
app.use(bodyParser.json()); // application/json

app.use("/feed", feedRoutes);

// Different port this time
app.listen(8080);
