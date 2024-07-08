import express from "express";
import TokenVerfier from "../middlewares/TokenVerfier.js";
import PromptController from "../controllers/PromptController.js";
const router = express.Router();

router.post("/prompt/ai/gemini", TokenVerfier, PromptController.GenerateText);
router.get("/prompt/ai/lexica/:id",  PromptController.GenerateImage);

export default router;
