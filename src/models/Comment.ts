import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to User schema
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // reference to Product schema
      required: false, // set true if you want product comments only
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order", // optional: comment on an order
      required: false,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store", // optional: comment on a store
      required: false,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: null, // optional rating along with comment
    },
    parentComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment", // for nested replies
      default: null,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // users who liked the comment
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);
