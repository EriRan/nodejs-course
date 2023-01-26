const mongoose = require("mongoose");

const Schema = mongoose.Schema;
// Cool definitions
// _id added automatically. No need to have it in the schema
const productSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User", // Which other Mongoose entity is this related to?
    required: true,
  },
});

module.exports = mongoose.model("Product", productSchema);
