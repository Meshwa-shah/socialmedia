import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import protect from "../middleware/authMiddleware.js";
import { getMyProfile, editProfile, searchUsers, toggleFollowUser, getFollowers, getFollowing } from "../controllers/userController.js";

const profileRoutes = express.Router();

profileRoutes.get( "/me/:userId",
  protect,
  getMyProfile);

profileRoutes.put("/edit-profile", protect, upload.single("profilePic"), editProfile);
profileRoutes.get("/search", protect, searchUsers);
profileRoutes.put(
  "/follow/:userId",
  protect,
  toggleFollowUser
);
profileRoutes.get(
  "/followers/:userId",
  protect,
  getFollowers
);

profileRoutes.get(
  "/following/:userId",
  protect,
  getFollowing
);

export default profileRoutes