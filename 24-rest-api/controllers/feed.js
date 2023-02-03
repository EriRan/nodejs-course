import fs from "fs";
import path from "path";
import { validationResult } from "express-validator";
import { Post } from "../models/post.js";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { User } from "../models/user.js";

// ES6 style of getting __dirname
const __dirname = dirname(fileURLToPath(import.meta.url));

export function getPosts(req, res, next) {
  // || === OR syntax
  const currentPage = req.query.page || 1;
  const perPage = 2;
  let totalItems;
  Post.find()
    .countDocuments()
    .then((count) => {
      totalItems = count;
      return Post.find()
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    })
    .then((posts) => {
      res.status(200).json({
        message: "Posts fetched",
        posts: posts,
        totalItems: totalItems,
      });
    })
    .catch((err) => {
      if (!err.statuscode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

export function createPost(req, res, next) {
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
  let creator;
  let newPost;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId,
  });
  post
    .save()
    .then((result) => {
      newPost = result;
      return User.findById(req.userId);
    })
    .then((user) => {
      creator = user;
      user.posts.push(post);
      return user.save();
    })
    .then((result) => {
      res.status(201).json({
        message: "Post created!",
        post: newPost,
        creator: {
          _id: creator._id,
          name: creator.name,
        },
      });
    })
    .catch((err) => {
      if (!err.statuscode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

export function getPost(req, res, next) {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        // This error will be caught in the next catch and then passed to the error middleware with next()
        throw error;
      }
      res.status(200).json({ message: "Post fetched", post: post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

export function updatePost(req, res, next) {
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
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        // This error will be caught in the next catch and then passed to the error middleware with next()
        throw error;
      }
      // Confirm user has the rights to modify a post
      if (post.creator.toString() !== req.userId) {
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
      return post.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Post updated!", post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

export function deletePost(req, res, next) {
  const postId = req.params.postId;

  Post.findById(postId)
    .then((post) => {
      // TODO: check logged in user
      if (!post) {
        const error = new Error("Post not found");
        error.statusCode = 404;
        throw error;
      }
      if (post.creator.toString() !== req.userId) {
        const error = new Error("Not authorized");
        error.statusCode = 403;
        // This error will be caught in the next catch and then passed to the error middleware with next()
        throw error;
      }
      clearImage(post.imageUrl);
      return Post.findByIdAndRemove(post._id);
    })
    .then((result) => {
      return User.findById(req.userId)
    })
    .then((user) => {
      user.posts.pull(postId);
      return user.save();
    })
    .then((result) => {
      res.status(200).json({ message: "Post deleted", post: result });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
}

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(err);
    }
  });
};
