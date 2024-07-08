import BlogPost from "../models/BlogPost.js";
import Category from "../models/Category.js";
import RedisCache from "./../config/Redis.config.js";

class HomeController {
  static async getHomeData(req, res) {
    try {
      const cacheKey = "home_data";
      const cachedData = await RedisCache.get(cacheKey);

      if (cachedData) {
        return res.status(200).json({
          msg: "Home data fetched successfully from cache",
          status: 200,
          data: JSON.parse(cachedData),
        });
      }

      // Fetch data in parallel
      const [blogs, categories, featuredPosts, latestPosts] = await Promise.all(
        [
          BlogPost.find({}).populate({
            model: "user",
            path: "author",
            select: "-password -role -__v",
          }),
          Category.find({}),
          BlogPost.find({ featured: true }).populate({
            model: "user",
            path: "author",
            select: "-password -role -__v",
          }), 
          BlogPost.find({}).sort({ publishedAt: -1 }).limit(5).populate({
            model: "user",
            path: "author",
            select: "-password -role -__v",
          }),
        ]
      );

      const homeData = {
        blogs,
        categories,
        featuredPosts,
        latestPosts,
      };

      await RedisCache.set(cacheKey, JSON.stringify(homeData), {
        EX: 60 * 60,
      });

      return res.status(200).json({
        msg: "Home data fetched successfully",
        status: 200,
        data: homeData,
      });
    } catch (error) {
      return res.status(500).json({
        msg: "Failed to fetch home data",
        status: 500,
        error: error.message,
      });
    }
  }
}

export default HomeController;
