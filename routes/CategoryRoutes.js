import express from "express";
import CategoryController from "../controllers/CategoryController.js";
import TokenVerfier from "../middlewares/TokenVerfier.js";
const router = express.Router();

router.get("/category", TokenVerfier, CategoryController.getCategory);
router.post(
  "/create/category",
  TokenVerfier,
  CategoryController.CreateCategory
);

export default router;
