import vine from "@vinejs/vine";
import { CustomErrorRepoter } from "./CustomErrorReporter.js";

vine.errorReporter = () => new CustomErrorRepoter();

export const registerSchema = vine.object({
  name: vine.string().minLength(3).maxLength(16),
  username: vine.string().minLength(3).maxLength(16),
  email: vine.string().minLength().email(),
  password: vine.string().minLength(7).maxLength(20).confirmed(),
});

export const LoginSchema = vine.object({
  email: vine.string().email(),
  password: vine.string().minLength(8),
});

export const CategorySchema = vine.object({
  name: vine.string().minLength(3).maxLength(25),
  img: vine.string(),
});

export const blogSchema = vine.object({
  title: vine.string().minLength(10).maxLength(150).trim(),
  subtitle: vine.string().minLength(10).maxLength(150).trim(),
  content: vine.string().minLength(20).trim(),
  tags: vine.array(vine.string().trim()),
  category: vine.string().trim(),
  imageUrl: vine.string().trim(),
});
