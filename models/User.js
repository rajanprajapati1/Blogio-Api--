import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name : {type: String, required: true, unique: true} ,
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  profilePicture: {
    type: String,
    default:
      "https://static.vecteezy.com/system/resources/thumbnails/020/765/399/small/default-profile-account-unknown-icon-black-silhouette-free-vector.jpg",
  },
  password: { type: String, required: true },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "blog" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.models.user || mongoose.model("user", userSchema);

export default User;
