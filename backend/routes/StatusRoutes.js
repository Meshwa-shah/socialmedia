import express from 'express';
import {
  createStatus, getStatuses, toggleLikeStatus, deleteStatus, viewStatus, getUserStories
  , getStoryLikes, getStoryViewers, getStoryById
} from '../controllers/StatusController.js';
import protect from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';

const storyrouter = express.Router();

storyrouter.post(
  "/create",
  protect,
  upload.single("media"),
  createStatus
);

storyrouter.get(
  "/feed",
  protect,
  getStatuses
);

storyrouter.put(
  "/like/:statusId",
  protect,
  toggleLikeStatus
);

storyrouter.put(
  "/view/:statusId",
  protect,
  viewStatus
);

storyrouter.delete(
  "/:statusId",
  protect,
  deleteStatus
);

storyrouter.get(
  "/user/:userId",
  protect,
  getUserStories
);

storyrouter.get(
  "/:storyId/likes",
  protect,
  getStoryLikes
);

storyrouter.get(
  "/:storyId/viewers",
  protect,
  getStoryViewers
);

storyrouter.get(
  "/single/:storyId",
  protect,
  getStoryById
);
export default storyrouter;