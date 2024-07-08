import { v2 as cloudinary } from "cloudinary";
import CloudinaryConfig from "../config/CloudinaryConfig.js";

CloudinaryConfig();

const deleteFromCloudinary = (publicUrl) => {
  const publicId = extractPublicId(publicUrl);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) {
        console.error("Cloudinary deletion error:", error);
        reject(error);
      } else {
        console.log("Cloudinary image deleted successfully:", result);
        resolve(result);
      }
    });
  });
};

const extractPublicId = (url) => {
  return url?.split("/").slice(7, 9).join("/").split(".").slice(0, 2).join(".");
};

export default deleteFromCloudinary;
