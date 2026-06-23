import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import protect from "./middleware/authMiddleware.js";
import notirouter from "./routes/NotificationRoutes.js";
import profileRoutes from "./routes/userRoutes.js";
import storyrouter from "./routes/StatusRoutes.js"; 
import chatrouter from "./routes/chatRoutes.js";
import moodRouter from "./routes/MoodsRoutes.js";

const app = express();

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.front_url,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/noti", notirouter);
app.use("/api/users", profileRoutes);
app.use("/api/status", storyrouter);
app.use("/api/chat", chatrouter);
app.use("/api/mood", moodRouter);

console.log("app running");

app.get("/", (req, res) => {
  res.send("API Running");
});

export default app;