import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const User = mongoose.model(
  "User",
  new Schema({
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      default: "I am new"
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  })
);
