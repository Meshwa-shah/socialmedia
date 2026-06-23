import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  createMood,
  getMoodFeed,
  reactToMood,
  getMoodHistory,
  getSingleMood,
  getMoodReactions
} from "../controllers/MoodController.js"

const moodRouter =
  express.Router();


// CREATE MOOD

moodRouter.post(
  "/create",
  protect,
  createMood
);


// GET MOOD FEED

moodRouter.get(
  "/feed",
  protect,
  getMoodFeed
);


// REACT TO MOOD

moodRouter.post(
  "/react/:moodId",
  protect,
  reactToMood
);


// MOOD HISTORY

moodRouter.get(
  "/history/:userId",
  protect,
  getMoodHistory
);

moodRouter.get(
  "/reactions/:moodId",
  protect,
  getMoodReactions
);

moodRouter.get(
  "/:moodId",
  protect,
  getSingleMood
);

export default moodRouter;