import mongoose from "mongoose";

const Categoryschema = new mongoose.Schema({
  name: { type: String, required: true },
  img: { type: String, required: true },
  totalBlogs: { type: Number, default: 0 },
});

 const Category =
  mongoose.models.category || mongoose.model("category", Categoryschema);

  export default Category