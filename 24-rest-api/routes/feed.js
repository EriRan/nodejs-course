import express from "express";
import { getPost, getPosts, createPost } from "../controllers/feed.js";
import { body } from "express-validator";

const router = express.Router();

router.get("/posts", getPosts);

// POST /feed/post
router.post(
  "/post",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  createPost
);

router.get("/post/:postId", getPost);

export default router;
