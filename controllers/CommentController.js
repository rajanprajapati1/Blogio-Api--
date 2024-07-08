import { Comment } from "./../models/Comment.js";
import BlogPost from "./../models/BlogPost.js";
import RedisCache from "../config/Redis.config.js";

class CommentController {
  static async CreateComment(req, res) {
    try {
      const { blogId } = req.params;
      const { content } = req.body;
      const author = req.user.id;

      const newComment = await Comment.create({ content, author });

      const updatedBlog = await BlogPost.findByIdAndUpdate(
        blogId,
        { $push: { comments: newComment._id } },
        { new: true }
      ).populate({
        path: "comments",
        populate: { path: "author", model :  "user" , select: "name profilePicture" },
      });

      await RedisCache.set(
        `single_blog_${updatedBlog?.title}`,
        JSON.stringify(updatedBlog),
        {
          EX: 60 * 60,
        }
      );

      const allBlogs = await BlogPost.find({}).populate({
        model: "user",
        path: "author",
        select: "-password -role -__v",
      });

      await RedisCache.set("all_blogs", JSON.stringify(allBlogs), {
        EX: 60 * 60,
      });
      return res.status(201).json({
        msg: "Comment added successfully",
        status: 201,
        comment: newComment,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Failed to add comment",
        status: 500,
        error: error.message,
      });
    }
  }
  static async GetComments(req, res) {
    try {
      const { blogId } = req.params;

      const cacheKey = `single_blog_${blogId}`;
      const cachedBlog = await RedisCache.get(cacheKey);

      if (cachedBlog) {
        const blog = JSON.parse(cachedBlog);
        return res.status(200).json({
          msg: "Comments fetched successfully from cache",
          status: 200,
          comments: blog.comments,
        });
      }

      const blog = await BlogPost.findById(blogId).populate({
        path: "comments",
        populate: { path: "author", select: "name" },
      });

      if (!blog) {
        return res.status(404).json({
          msg: "Blog not found",
          status: 404,
        });
      }
      await RedisCache.set(cacheKey, JSON.stringify(blog), {
        EX: 60 * 60,
      });
      return res.status(200).json({
        msg: "Comments fetched successfully",
        status: 200,
        comments: blog.comments,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Failed to fetch comments",
        status: 500,
        error: error.message,
      });
    }
  }
  static async DeleteComment(req, res) {
    try {
      const { commentId, blogId } = req.params;
      const comment = await Comment.findById(commentId);
      if (!comment) {
        return res.status(404).json({
          msg: "Comment not found",
          status: 404,
        });
      }

      if (comment.author.toString() !== req.user.id) {
        return res.status(403).json({
          msg: "You are not authorized to delete this comment",
          status: 403,
        });
      }

      await Comment.findByIdAndDelete(commentId);
      const updatedBlog = await BlogPost.findByIdAndUpdate(
        blogId,
        { $pull: { comments: commentId } },
        { new: true }
      ).populate({
        path: "comments",
        populate: { path: "author", select: "name" },
      });

      await RedisCache.set(
        `single_blog_${blogId}`,
        JSON.stringify(updatedBlog),
        {
          EX: 60 * 60,
        }
      );

      const allBlogs = await BlogPost.find({}).populate({
        model: "user",
        path: "author",
        select: "-password -role -__v",
      });

      await RedisCache.set("all_blogs", JSON.stringify(allBlogs), {
        EX: 60 * 60,
      });
      return res.status(200).json({
        msg: "Comment deleted successfully",
        status: 200,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Failed to delete comment",
        status: 500,
        error: error.message,
      });
    }
  }
}

export default CommentController;
