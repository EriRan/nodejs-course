import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const postSchema = mongoose.model(
  "Post",
  new Schema(
    {
      title: {
        type: String,
        required: true,
      },
      imageUrl: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
      creator: {
        type: Object,
        required: true,
      },
    },
    // Configuration
    // Mongoose will automatically add createdAt and updatedAt timestamps
    { timestamps: true }
  )
);
