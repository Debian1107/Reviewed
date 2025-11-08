import mongoose from "mongoose";
// import { Item } from "../src/models/item"; // adjust import path
// import Item from "../models/Item";
import Item from "../models/Item";

export async function addMigration() {
  console.log("🚀 Starting migration...");
  await mongoose.connect(process.env.MONGODB_URI || "");

  const result = await Item.updateMany(
    { description: { $exists: false } },
    { $set: { description: "No description provided." } }
  );

  console.log(`✅ Updated ${result.modifiedCount} documents.`);
  mongoose.disconnect();
}

// addMigration().catch(console.error);

// import mongoose from "mongoose";

export async function RemoveIndex() {
  await mongoose.connect(process.env.MONGODB_URI!);
  await mongoose.connection.db
    .collection("likes")
    .dropIndex("user_1_review_1")
    .catch(() => {});
  await mongoose.connection.db
    .collection("likes")
    .dropIndex("user_1_comment_1")
    .catch(() => {});
  console.log("Indexes dropped successfully");
  process.exit(0);
}
