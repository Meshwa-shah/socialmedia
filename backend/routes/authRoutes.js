import express from "express";

import {
  registerUser,
  loginUser,
  logoutUser,
  uploadProfilePic,
  saveFcmToken
} from "../controllers/authController.js";

import protect from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js'

const authRoutes = express.Router();

authRoutes.post("/register", registerUser);
authRoutes.post("/login", loginUser);
authRoutes.post("/logout", logoutUser);
authRoutes.put("/profile-picture",
  protect,
  upload.single("profilePic"),
  uploadProfilePic);
authRoutes.post(
  "/save-fcm",
  protect,
  saveFcmToken
);

export default authRoutes;