import { ImageConfig } from "../config/imageConfig.js";
import { v4 as uuidv4 } from "uuid";

export const ImageValidator = (size, mime) => {
  if (bytesToMb(size) > 2) {
    return "Image size must be less then 2Mb";
  } else if (!ImageSupportExt.includes(mime)) {
    return `Image must be type of jpeg png gif webp svg bmp tiff x-icon heic heif`;
  }
  return null;
};

export const bytesToMb = (bytes) => {
  return bytes / (1024 * 1024);
};

export const GenerateRandomId = () => {
  return uuidv4();
};
