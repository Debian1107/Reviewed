import mongoose, { Schema, Document, Types } from "mongoose";

// --- TypeScript Interface for the Document ---

/**
 * Interface for a Reviewable Item Document.
 * This represents a product, service, or place that can be reviewed.
 */
export interface IItem extends Document {
  _id: Types.ObjectId; // MongoDB ObjectId
  id: string; // The unique slug or ID used in URLs (e.g., 'iphone-17-pro')
  name: string; // The display name of the item
  description: string; // The display name of the item
  image: string; // The display name of the item
  category: string; // Main category (e.g., 'tech', 'auto', 'media')
  tags: string[]; // Keywords for search/filtering (e.g., 'smartphone', 'apple')

  // Review Metrics (These would be dynamically calculated or updated)
  reviewCount: number;
  averageRating: number;

  createdAt: Date;
  updatedAt: Date;
}

// --- Mongoose Schema Definition ---

const ItemSchema = new Schema<IItem>(
  {
    // Corresponds to the 'id' field in your MOCK_ITEMS and is used as the unique identifier
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      index: true, // Index for fast category filtering
    },

    tags: {
      type: [String],
      default: [],
    },

    // Fields to store aggregated review data
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    averageRating: {
      type: Number,
      default: 0.0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// --- Model Export ---

export default mongoose.models.Item ||
  mongoose.model<IItem>("Item", ItemSchema);
