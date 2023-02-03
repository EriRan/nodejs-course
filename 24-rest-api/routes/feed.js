import express from "express";
import {
  deletePost,
  getPost,
  getPosts,
  createPost,
  updatePost,
} from "../controllers/feed.js";
import { body } from "express-validator";
import isAuth from "../middleware/is-auth.js"

const router = express.Router();

router.get("/posts", isAuth, getPosts);

// POST /feed/post
router.post(
  "/post",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  createPost
);

router.get("/post/:postId", isAuth, getPost);

router.put(
  "/post/:postId",
  isAuth,
  [
    body("title").trim().isLength({ min: 5 }),
    body("content").trim().isLength({ min: 5 }),
  ],
  updatePost
);

router.delete("/post/:postId", isAuth, deletePost);

export default router;
