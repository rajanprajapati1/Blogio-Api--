import express from "express";
import HomeController from "../controllers/HomeController.js";
import TokenVerfier from "../middlewares/TokenVerfier.js";
const router = express.Router();

router.get("/auth/home",  HomeController.getHomeData);

export default router;
