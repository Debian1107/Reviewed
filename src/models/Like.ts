import mongoose, { Schema, Document, Types } from "mongoose";

export interface ILike extends Document {
  user: Types.ObjectId;
  review?: Types.ObjectId;
  comment?: Types.ObjectId;
  type: "review" | "comment";
  createdAt: Date;
}

const LikeSchema = new Schema<ILike>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["review", "comment"], required: true },
    review: { type: Schema.Types.ObjectId, ref: "Review" },
    comment: { type: Schema.Types.ObjectId, ref: "Comment" },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// prevent duplicate like by same user on same review or comment
// LikeSchema.index({ user: 1, review: 1 }, { unique: true, sparse: true });
// LikeSchema.index({ user: 1, comment: 1 }, { unique: true, sparse: true });

// conditional validation
LikeSchema.pre("save", function (next) {
  if (this.type === "review" && !this.review) {
    return next(new Error("Review ID required for review like"));
  }
  if (this.type === "comment" && !this.comment) {
    return next(new Error("Comment ID required for comment like"));
  }
  next();
});

export default mongoose.models.Like ||
  mongoose.model<ILike>("Like", LikeSchema);
