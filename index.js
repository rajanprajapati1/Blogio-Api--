import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import FileUpload from "express-fileupload";

// Configs
import connectToDatabase from "./config/connectToDatabase.js";

// files
import UserRoutes from "./routes/UserRoutes.js";
import BlogRoutes from "./routes/BlogRoutes.js";
import CategoryRoutes from "./routes/CategoryRoutes.js";
import PromptRoute from "./routes/PromptRoute.js";
import CommentRoutes from "./routes/CommentRoutes.js";
import HomeRoutes from "./routes/HomeRoutes.js";
import { limiter } from "./helper/RateLimiting.js";

// Initailazing Server
const app = express();

// configurations
dotenv.config();
connectToDatabase();

// middlewares
app.use(limiter);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(FileUpload());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(helmet());

// Routes
app.use("/api/v1", UserRoutes);
app.use("/api/v1", BlogRoutes);
app.use("/api/v1", CategoryRoutes);
app.use("/api/v1", CommentRoutes);
app.use("/api/v1", PromptRoute);
app.use("/api/v1", HomeRoutes);

app.listen(process.env.PORT || 4000, () => {
  console.log(`listening on Port No ${process.env.PORT || 4000} `);
});
