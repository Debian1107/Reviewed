import mongoose, { Schema, Document, Types } from "mongoose";

export interface IReview extends Document {
  user: Types.ObjectId; // author of the review
  category: string; // e.g. "movie", "song", "product"
  itemId: string; // id or slug of the item being reviewed
  title?: string; // optional short headline
  content: string; // the main review text
  rating?: number; // optional rating 1-5
  likes: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    itemId: { type: String, required: true },
    title: { type: String },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5 },
    likes: [{ type: Schema.Types.ObjectId, ref: "Like" }],
  },
  { timestamps: true }
);

export default mongoose.models.Review ||
  mongoose.model<IReview>("Review", ReviewSchema);
