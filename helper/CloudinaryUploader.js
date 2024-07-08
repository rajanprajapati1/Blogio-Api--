import { v2 as cloudinary } from "cloudinary";
import CloudinaryConfig from "./../config/CloudinaryConfig.js";
import fs from "fs";

CloudinaryConfig();

const uploadToCloudinary = async (filePath, folderName, imageName) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folderName,
      public_id: imageName,
    });
    return result;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    throw new Error("Cloudinary upload failed: " + error.message);
  }
};

export default uploadToCloudinary;
