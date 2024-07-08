import express from "express";
import BlogController from "./../controllers/BlogController.js";
import TokenVerfier from "../middlewares/TokenVerfier.js";

const router = express.Router();

router.get("/blogs", BlogController.ReadBlog);
router.get("/blogs/:id", TokenVerfier, BlogController.SingleBlog);
router.post("/create/blog", TokenVerfier, BlogController.CreateBlog);
router.put("/update/:id/blog", TokenVerfier, BlogController.UpdateBlog);
router.delete("/delete/:id/blog", TokenVerfier, BlogController.DeleteBlog);

export default router;
