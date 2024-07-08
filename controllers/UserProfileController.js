import uploadToCloudinary from "../helper/CloudinaryUploader.js";
import {
  GenerateRandomId,
  ImageValidator,
} from "./../helper/ImageValidator.js";
import path from "path";
import fs from "fs";
import User from "../models/User.js";
import deleteFromCloudinary from "./../helper/deleteFromCloudinary.js";

class UserProfileController {
  static async UpdateProfile(req, res) {
    try {
      const { id, email, profile: oldProfilePicture } = req.user;
      console.log(oldProfilePicture);
      console.log(req.user);
      if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
          msg: "Profile image is required",
          status: 400,
        });
      }

      const profilePicture = req?.files?.profilePicture;
      const fileSize = profilePicture?.size;
      const mimeType = profilePicture?.mimetype;
      const message = ImageValidator(fileSize, mimeType);
      if (message !== null) {
        return res.status(400).json({
          error: message,
        });
      }

      const imgExt = profilePicture?.name.split(".");
      const imageName = GenerateRandomId() + "." + imgExt[1];
      const uploadPath = path.join(process.cwd(), "/public/image/", imageName);

      fs.writeFileSync(uploadPath, profilePicture.data);

      try {
        const result = await uploadToCloudinary(
          uploadPath,
          "user_profiles",
          imageName
        );
        const NewimageUrl = result?.secure_url;
        if (oldProfilePicture) {
          await deleteFromCloudinary(oldProfilePicture);
        }
        const updateUserProfile = await User.findByIdAndUpdate(
          id,
          {
            profilePicture: NewimageUrl,
          },
          { new: true }
        );
        req.user.profile = NewimageUrl;
        fs.unlinkSync(uploadPath);
        return res.status(200).json({
          msg: "Profile Updated Successfully",
          status: 200,
          user: updateUserProfile,
        });
      } catch (uploadError) {
        console.error("Cloudinary upload error:", uploadError.message);
        return res.status(500).json({
          msg: "Cloudinary upload failed",
          status: 500,
          error: uploadError.message,
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        msg: "updating profile failed ",
        status: 404,
        error: error,
      });
    }
  }
  static async UserDetail(req, res) {
    try {
      const id = req.params.id;
      const authUserId = req.user.id;
      const payload = req.body;
      if (id !== authUserId) {
        return res.status(403).json({
          msg: "Access denied. You are not authorized to edit this user detail.",
          status: 403,
        });
      }
      const user = await User.findById(id);

      if (!user) {
        return res.status(404).json({
          msg: "User not found",
          status: 404,
        });
      }
      const updateduser = await User.findByIdAndUpdate(id, payload, {
        new: true,
      });
      return res.status(200).json({
        msg: "User detail Updated successfully",
        status: 200,
        user: updateduser,
      });
    } catch (error) {
      console.error("User detail retrieval failed:", error);
      return res.status(500).json({
        msg: "Failed to retrieve user detail",
        status: 500,
        error: error.message,
      });
    }
  }
}

export default UserProfileController;
