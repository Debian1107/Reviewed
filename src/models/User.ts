import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  passwordHash?: string; // optional if you use OAuth
  profilePicture?: string;
  bio?: string;
  dob: Date;
  location: string;
  user_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String }, // store bcrypt hash if using email/password
    profilePicture: { type: String }, // URL
    bio: { type: String, maxlength: 500 },
    dob: { type: Date, default: null },
    location: { type: String, default: "" },
    user_verified: { type: Boolean, default: false },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
