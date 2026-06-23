import express from "express";

import { getNotifications, markNotificationsAsRead, getUnreadCount } from "../controllers/NotificationController.js";

import protect from "../middleware/authMiddleware.js";

const notirouter = express.Router();

notirouter.get(
  "/",
  protect,
  getNotifications
);

notirouter.put(
  "/read",
  protect,
  markNotificationsAsRead
);

notirouter.get(
  "/unread-count",
  protect,
  getUnreadCount
);

export default notirouter;