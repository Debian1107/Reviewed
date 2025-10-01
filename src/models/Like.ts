import mongoose, { Schema, Document, Types } from "mongoose";

export interface ILike extends Document {
  user: Types.ObjectId; // who liked
  review: Types.ObjectId; // which review was liked
  createdAt: Date;
}

const LikeSchema = new Schema<ILike>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    review: { type: Schema.Types.ObjectId, ref: "Review", required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// prevent duplicate like by same user on same review
LikeSchema.index({ user: 1, review: 1 }, { unique: true });

export default mongoose.models.Like ||
  mongoose.model<ILike>("Like", LikeSchema);
