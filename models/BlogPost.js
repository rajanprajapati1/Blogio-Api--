import mongoose from "mongoose";
import Category from "./Category.js";

const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    min: [10, "atleast 10 words title is required"],
    max: [150, "150 Words limit Exceeded"],
  },
  subtitle: {
    type: String,
    required: true,
    min: [10, "atleast 10 words title is required"],
    max: [150, "150 Words limit Exceeded"],
  },
  content: {
    type: String,
    required: true,
    min: [20, "atleast 20 words description is required"],
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  publishedAt: { type: Date, default: Date.now },
  tags: [{ type: String }],
  category: { type: String, ref: "category", required: true },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "comment" }],
  imageUrl: { type: String, default: "" },
  featured: { type: Boolean, default: false },
});

blogPostSchema.post("save", async function (doc, next) {
  try {
    await Category.findOneAndUpdate(
      { name: doc.category },
      { $inc: { totalBlogs: 1 } }
    );
    next();
  } catch (err) {
    next(err);
  }
});

// Middleware to decrement category count on blog post removal
blogPostSchema.pre("remove", async function (next) {
  try {
    await Category.findOneAndUpdate(
      { name: this.category },
      { $inc: { totalBlogs: -1 } }
    );
    next();
  } catch (err) {
    next(err);
  }
});

const BlogPost =
  mongoose.models.blogpost || mongoose.model("blogpost", blogPostSchema);

export default BlogPost;
