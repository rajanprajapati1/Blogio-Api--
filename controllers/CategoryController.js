import { CategorySchema } from "../Validations/reqValidator.js";
import Category from "./../models/Category.js";
import vine, { errors } from "@vinejs/vine";

class CategoryController {
  static async CreateCategory(req, res) {
    try {
      const AuthUser = req.user;
      const body = req.body;
      if (!AuthUser) {
        return res.status(402).json({
          msg: "You are Not Authorized User",
          status: 402,
          list,
        });
      }
      const validator = vine.compile(CategorySchema);
      const payload = await validator.validate(body);
      const NewCategory = await Category.create({
        name: payload.name,
        img: payload.img,
      });
      return res.status(200).json({
        msg: "Category created successfully",
        status: 200,
        category: NewCategory,
      });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ error: error.messages, status: 400 });
      }
      return res
        .status(400)
        .json({ msg: "Failed to Create User !!", status: 400 });
    }
  }
  static async getCategory(req, res) {
    try {
      const list = await Category.find({});
      return res.status(200).json({
        msg: "Category Added Successfully",
        status: 200,
        list,
      });
    } catch (error) {
      console.log(error);
      return res.status(404).json({
        msg: "Wrong Credentials",
        status: 404,
      });
    }
  }
}

export default CategoryController;
