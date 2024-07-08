import mongoose from "mongoose";

const commentschema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Comment =
  mongoose.models.comment || mongoose.model("comment", commentschema);
