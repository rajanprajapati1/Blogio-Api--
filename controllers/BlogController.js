import BlogPost from "./../models/BlogPost.js";
import { blogSchema } from "../Validations/reqValidator.js";
import Category from "../models/Category.js";
import vine, { errors } from "@vinejs/vine";
import RedisCache from "../config/Redis.config.js";

class BlogController {
  static async CreateBlog(req, res) {
    try {
      const AuthUser = req.user;
      const body = req.body;
      if (!AuthUser) {
        return res.status(402).json({
          msg: "You are Not Authorized User",
          status: 402,
        });
      }
      const validator = vine.compile(blogSchema);
      const payload = await validator.validate(body);
      const categoryExists = await Category.findOne({ name: body?.category });
      if (!categoryExists) {
        return res.status(400).json({ msg: "Invalid category", status: 400 });
      }
      const UniqueTitle = await BlogPost.findOne({ title: body?.title });
      if (UniqueTitle?.title === payload?.title) {
        return res.status(400).json({ msg: "Use Another Title", status: 400 });
      }

      const blog = await BlogPost.create({
        title: payload.title,
        subtitle: payload.subtitle,
        content: payload.content,
        author: AuthUser?.id,
        tags: payload.tags,
        category: payload.category,
        imageUrl: payload.imageUrl,
      });

      const allBlogs = await BlogPost.find({}).populate({
        model: "user",
        path: "author",
        select: "-password -role -__v",
      });

      await RedisCache.set("all_blogs", JSON.stringify(allBlogs), {
        EX: 60 * 60, // Cache expiration time in seconds (1 hour)
      });

      return res.status(200).json({
        msg: "Blog is  created successfully",
        status: 200,
        blog: blog,
      });
    } catch (error) {
      console.log(error);
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ error: error.messages, status: 400 });
      }
      return res
        .status(400)
        .json({ msg: "Failed to Create Blog !!", status: 400 });
    }
  }
  static async ReadBlog(req, res) {
    try {
      console.log(req.query);
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 5;
      const skip = (page - 1) * limit;

      const cacheKey = `all_blogs_page_${page}_limit_${limit}`;
      const cachedBlogs = await RedisCache.get(cacheKey);

      if (cachedBlogs) {
        return res.status(200).json({
          msg: "Blogs fetched successfully from cache",
          status: 200,
          blogs: JSON.parse(cachedBlogs),
        });
      }
      const totalBlogs = await BlogPost.countDocuments({});
      const blogs = await BlogPost.find({})
        .populate({
          model: "user",
          path: "author",
          select: "-password -role -__v",
        })
        .skip(skip)
        .limit(limit);

      const nextPage = page * limit < totalBlogs;
      const response = { blogs, nextPage };
      await RedisCache.set(cacheKey, JSON.stringify(response), {
        EX: 60 * 60,
      });

      return res.status(200).json({
        msg: "Blogs fetched successfully",
        status: 200,
        ...response,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Failed to fetch blogs",
        status: 500,
        error: error.message,
      });
    }
  }
  static async SingleBlog(req, res) {
    const blogId = req.params.id;
    const decode = decodeURIComponent(blogId);
    console.log(decode);
    const cacheKey = `single_blog_${blogId}`;
    try {
      const cachedBlog = await RedisCache.get(cacheKey);
      const data = JSON.parse(cachedBlog);
      if (cachedBlog) {
        return res.status(200).json({
          msg: "Blog fetched successfully from cache",
          status: 200,
          blog: data?.blog,
          relatedBlogs: data?.relatedBlogs,
        });
      }
      const blog = await BlogPost.findOne({ title: blogId })
        .populate({
          model: "user",
          path: "author",
          select: "-password -role -__v",
        })
        .populate({
          model: "comment",
          path: "comments",
          populate: {
            model: "user",
            path: "author",
            select: "-password -role -__v",
          },
        });
      if (!blog) {
        return res.status(404).json({
          msg: "Blog not found",
          status: 404,
        });
      }

      const relatedBlogs = await BlogPost.find({
        category: blog.category,
        _id: { $ne: blog._id },
      })
        .populate({
          model: "user",
          path: "author",
          select: "-password -role -__v",
        })
        .populate({
          model: "comment",
          path: "comments",
          populate: {
            model: "user",
            path: "author",
            select: "-password -role -__v",
          },
        })
        .limit(5);

      const response = {
        blog,
        relatedBlogs,
      };

      await RedisCache.set(cacheKey, JSON.stringify(response), {
        EX: 60 * 60,
      });

      return res.status(200).json({
        msg: "Blog fetched successfully",
        status: 200,
        ...response,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Failed to fetch blog",
        status: 500,
        error: error.message,
      });
    }
  }
  static async UpdateBlog(req, res) {
    try {
      const AuthUser = req.user.id;
      const blogId = req.params.id;
      const { title, subtitle, content, tags, category, imageUrl } = req.body;

      const blog = await BlogPost.findById(blogId);
      if (!blog) {
        return res.status(404).json({
          msg: "Blog not found",
          status: 404,
        });
      }

      if (blog.author.toString() !== AuthUser) {
        return res.status(403).json({
          msg: "You are not authorized to update this blog",
          status: 403,
        });
      }

      const updatePayload = {};
      if (title) updatePayload.title = title;
      if (subtitle) updatePayload.subtitle = subtitle;
      if (content) updatePayload.content = content;
      if (tags) updatePayload.tags = tags;
      if (category) updatePayload.category = category;
      if (imageUrl) updatePayload.imageUrl = imageUrl;

      const updatedBlog = await BlogPost.findByIdAndUpdate(
        blogId,
        updatePayload,
        { new: true }
      );
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
        msg: "Blog updated successfully",
        status: 200,
        blog: updatedBlog,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Failed to fetch blogs",
        status: 500,
        error: error.message,
      });
    }
  }
  static async DeleteBlog(req, res) {
    try {
      const AuthUser = req.user.id;
      const blogId = req.params.id;
      const blog = await BlogPost.findById(blogId);
      if (!blog) {
        return res.status(404).json({
          msg: "Blog not found",
          status: 404,
        });
      }
      if (blog?.author?.toString() !== AuthUser) {
        return res.status(403).json({
          msg: "You are not authorized to delete this blog",
          status: 403,
        });
      }
      const DeletedBlog = await BlogPost.findByIdAndDelete(blogId);

      const allBlogs = await BlogPost.find({}).populate({
        model: "user",
        path: "author",
        select: "-password -role -__v",
      });

      await RedisCache.set("all_blogs", JSON.stringify(allBlogs), {
        EX: 60 * 60,
      });

      await RedisCache.del(`single_blog_${blogId}`);
      return res.status(200).json({
        msg: "Blog deleted successfully",
        status: 200,
        DeletedBlog,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Failed to delete blog",
        status: 500,
        error: error.message,
      });
    }
  }
}

export default BlogController;
