import mongoose from "mongoose";

const Schema = mongoose.Schema;

export const Post = mongoose.model(
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
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    },
    // Configuration
    // Mongoose will automatically add createdAt and updatedAt timestamps
    { timestamps: true }
  )
);
