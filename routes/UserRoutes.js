import express from "express";
import UserController from "../controllers/UserController.js";
import TokenVerfier from "../middlewares/TokenVerfier.js";
import UserProfileController from "../controllers/UserProfileController.js";
import { cloudinaryLimiter } from "../helper/RateLimiting.js";
const router = express.Router();

// User Auth Controller
router.post("/auth/register", UserController.CreateUser);
router.post("/auth/login", UserController.LoginUser);
router.get("/auth/user", TokenVerfier, UserController.GetUser);
router.get("/logout", UserController.LogoutUser);

// User Profile Controller
router.put(
  "/auth/user/profile/update",
  cloudinaryLimiter,
  TokenVerfier,
  UserProfileController.UpdateProfile
);
router.put(
  "/auth/user/:id/details/update",
  TokenVerfier,
  UserProfileController.UserDetail
);
export default router;
