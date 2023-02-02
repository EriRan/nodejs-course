import { validationResult } from "express-validator";
import { Post } from "../models/post.js";

export function getPosts(req, res, next) {
  // No more rendering at REST API
  // Status is more important now when the client does the rendering and it needs to react to the data received
  res.status(200).json({
    posts: [
      {
        _id: 234234,
        title: "First post",
        content: "This is a first post",
        imageUrl: "images/7.jpg",
        creator: {
          name: "Mold-Max",
        },
        date: new Date(),
      },
    ],
  });
}

export function createPost(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect");
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: "images/7.jpg",
    creator: {
      name: "Mold-Max",
    },
  });
  post
    .save()
    .then((result) => {
      res.status(201).json({
        message: "Post created!",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statuscode) {
        err.statusCode = 500;
      }
      next(err);
    });
}
