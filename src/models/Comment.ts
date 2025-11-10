import mongoose, { Document, Types, model, models } from "mongoose";

export interface CommentType extends Document {
  user: Types.ObjectId | null;
  product: Types.ObjectId | null;
  content: string;
  rating: number | null;
  parentComment: Types.ObjectId | null;
  likes: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  replies?: CommentType[];
}

const commentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference to User schema
      required: false,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // reference to Product schema
      required: false, // set true if you want product comments only
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

commentSchema.virtual("replies", {
  ref: "Comment",
  localField: "_id",
  foreignField: "parentComment",
});
commentSchema.set("toObject", { virtuals: true });
commentSchema.set("toJSON", { virtuals: true });

const Comment = models.Comment || model("Comment", commentSchema);

export default Comment;
