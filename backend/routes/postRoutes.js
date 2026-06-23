import express from "express";

import protect from "../middleware/authMiddleware.js";

import upload from "../middleware/uploadMiddleware.js";

import {
  createPost,
  getFeedPosts,
  toggleLikePost, 
  deletePost, addComment, getComments, deleteComment , getSinglePost, getPostLikes, getLikedPosts
} from "../controllers/postController.js";

const postRoutes  = express.Router();

postRoutes.post(
  "/create",
  protect,
  upload.array("media", 5),
  createPost
);

postRoutes.get(
  "/feed",
  protect,
  getFeedPosts
);

postRoutes.put(
  "/like/:postId",
  protect,
  toggleLikePost
);

postRoutes.delete(
  "/:postId",
  protect,
  deletePost
);

postRoutes.post(
  "/comment/:postId",
  protect,
  addComment
);

postRoutes.get(
  "/comments/:postId",
  protect,
  getComments
);

postRoutes.delete(
  "/comment/:postId/:commentId",
  protect,
  deleteComment
);

postRoutes.get(
  "/get/:postId", protect, getSinglePost
)

postRoutes.get("/:postId/likes", protect, getPostLikes);

postRoutes.get("/liked", protect, getLikedPosts);


export default postRoutes;