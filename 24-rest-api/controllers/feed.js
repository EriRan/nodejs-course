import fs from "fs";
import path from "path";
import { validationResult } from "express-validator";
import { Post } from "../models/post.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { User } from "../models/user.js";
import Socket from "../socket.js";

// ES6 style of getting __dirname
const __dirname = dirname(fileURLToPath(import.meta.url));

export async function getPosts(req, res, next) {
  // NICE
  const currentPage = req.query.page || 1;
  const perPage = 2;
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate("creator")
      .sort({ createdAt: -1 }) // Descending sort by createdAt
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    res.status(200).json({
      message: "Posts fetched",
      posts: posts,
      totalItems: totalItems,
    });
  } catch (err) {
    if (!err.statuscode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

export async function createPost(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error("No image provded");
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path.replace("\\", "/");
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId,
  });
  try {
    const newPost = await post.save();
    const user = await User.findById(req.userId);
    user.posts.push(post);
    const savedUser = await user.save();
    Socket.getIO().emit("posts", {
      action: "create",
      post: { ...post._doc, creator: { _id: req.userId, name: user.name } },
    });
    res.status(201).json({
      message: "Post created!",
      post: newPost,
      creator: {
        _id: savedUser._id,
        name: savedUser.name,
      },
    });
  } catch (err) {
    if (!err.statuscode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

export async function getPost(req, res, next) {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      // This error will be caught in the next catch and then passed to the error middleware with next()
      throw error;
    }
    res.status(200).json({ message: "Post fetched", post: post });
  } catch (err) {
    if (!err.statuscode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

export async function updatePost(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }
  const postId = req.params.postId;
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;

  if (req.file) {
    imageUrl = req.file.path.replace("\\", "/");
  }
  if (!imageUrl) {
    const error = new Error("No file picked");
    error.statusCode = 422;
    throw error;
  }

  // Finally do the actual update
  try {
    const post = await Post.findById(postId).populate("creator");
    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      // This error will be caught in the next catch and then passed to the error middleware with next()
      throw error;
    }
    // Confirm user has the rights to modify a post
    if (post.creator._id.toString() !== req.userId) {
      const error = new Error("Not authorized");
      error.statusCode = 403;
      // This error will be caught in the next catch and then passed to the error middleware with next()
      throw error;
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.content = content;
    post.imageUrl = imageUrl;
    const savedPost = await post.save();
    Socket.getIO().emit("posts", { action: "update", post: savedPost });
    res.status(200).json({ message: "Post updated!", post: savedPost });
  } catch (err) {
    if (!err.statuscode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

export async function deletePost(req, res, next) {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Post not found");
      error.statusCode = 404;
      throw error;
    }
    if (post.creator._id.toString() !== req.userId) {
      const error = new Error("Not authorized");
      error.statusCode = 403;
      // This error will be caught in the next catch and then passed to the error middleware with next()
      throw error;
    }
    clearImage(post.imageUrl);
    await Post.findByIdAndRemove(post._id);
    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    const savedUser = await user.save();
    Socket.getIO().emit("posts", {action: "delete", post: postId})
    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    if (!err.statuscode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
    }
  });
};
