import vine, { errors } from "@vinejs/vine";
import User from "./../models/User.js";
import { LoginSchema, registerSchema } from "../Validations/reqValidator.js";
import bcrypt from "bcrypt";
import { isStrongPassword } from "./../helper/PasswordChecker.js";
import jwt from "jsonwebtoken";

class UserController {
  static async CreateUser(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(registerSchema);
      const payload = await validator.validate(body);

      const usernameExists = await User.findOne({ username: payload.username });
      if (usernameExists) {
        return res.status(409).json({
          msg: "Username already exists, please use a different username",
          status: 409,
        });
      }
      const emailExists = await User.findOne({ email: payload.email });
      if (emailExists) {
        return res.status(409).json({
          msg: "Email already exists, please use a different email",
          status: 409,
        });
      }

      if (!isStrongPassword(payload.password)) {
        return res.status(400).json({
          msg: "Password is not strong enough",
          status: 400,
        });
      }

      const hashpassword = bcrypt.hashSync(payload.password, 12);

      const newUser = await User.create({
        name: payload.name,
        username: payload.username,
        email: payload.email,
        password: hashpassword,
      });

      return res
        .status(200)
        .json({ msg: "user created successfully", status: 200, user: newUser });
    } catch (error) {
      if (error instanceof errors.E_VALIDATION_ERROR) {
        return res.status(400).json({ error: error.messages, status: 400 });
      }
      return res
        .status(400)
        .json({ msg: "Failed to Create User !!", status: 400 });
    }
  }
  static async LoginUser(req, res) {
    try {
      const body = req.body;
      const validator = vine.compile(LoginSchema);
      const payload = await validator.validate(body);
      const user = await User.findOne({ email: payload.email });

      if (!user) {
        return res.status(404).json({
          msg: "Wrong Credentials",
          status: 404,
        });
      }

      const PasswordMatch = bcrypt.compareSync(payload.password, user.password);
      if (!PasswordMatch) {
        return res.status(401).json({
          msg: "Wrong Credentials ",
          status: 401,
        });
      }

      const tokenpayload = {
        id: user._id,
        email: user.email,
        profile: user.profilePicture,
      };

      const token = await jwt.sign(tokenpayload, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION,
      });
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      return res.status(200).json({
        msg: "user Logged In successfully",
        status: 200,
        user: { ...tokenpayload, name: user.name },
      });
    } catch (error) {
      return res
        .status(400)
        .json({ msg: "Failed to Logged User !!", status: 400 });
    }
  }
  static async GetUser(req, res) {
    try {
      const user = req.user;
      if (!user) {
        return res.status(401).json({
          msg: "User not authenticated",
          status: 401,
        });
      }
      const VerifiedUser = await User.findOne({ _id: user.id }).select(
        "-password -role -createdAt -updatedAt -__v "
      );
      if (!VerifiedUser) {
        return res.status(404).json({
          msg: "User not Found",
          status: 401,
        });
      }
      return res.status(200).json({
        msg: "User verified successfully",
        status: 200,
        user: VerifiedUser,
      });
    } catch (error) {
      return res.status(400).json({
        msg: "User Failed to Verify",
        status: 404,
      });
    }
  }
  static async LogoutUser(req, res) {
    try {
      res.cookie("token", "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      });
      return res.status(200).json({
        msg: "User Logout  successfully",
        status: 200,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        msg: "User Failed to Logout",
        status: 404,
        error,
      });
    }
  }
}

export default UserController;
