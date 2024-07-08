import express from "express";
const router = express.Router();
import TokenVerfier from "../middlewares/TokenVerfier.js";
import CommentController from "../controllers/CommentController.js";

router.post(
  "/blogs/:blogId/comments",
  TokenVerfier,
  CommentController.CreateComment
);
router.get("/blogs/:blogId/comments", CommentController.GetComments);
router.delete(
  "/blogs/:blogId/comments/:commentId",
  TokenVerfier,
  CommentController.DeleteComment
);

export default router;
