import express from "express";
import { getPosts, createPost } from "../controllers/feed.js";

const router = express.Router();

router.get("/posts", getPosts);

// POST /feed/post
router.post("/posts", createPost);

export default router;