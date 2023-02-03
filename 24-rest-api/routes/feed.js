import express from "express";
import {
  deletePost,
  getPost,
  getPosts,
  createPost,
  updatePost,
} from "../controllers/feed.js";
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

router.put(
  "/post/:postId",
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  updatePost
);

router.delete("/post/:postId", deletePost);

export default router;
