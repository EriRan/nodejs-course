import express from "express";
import feedRoutes from "./routes/feed.js";

const app = express();

app.use("/feed", feedRoutes);

// Different port this time
app.listen(8080);
