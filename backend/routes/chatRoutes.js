import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
  createConversation,
  getUserConversations,
  sendMessage,
  getMessages,
  markMessagesSeen,
  getUnreadMessageCount,
  getChatHeader
} from "../controllers/chatController.js";

const chatrouter =
  express.Router();

chatrouter.post(
  "/conversation/:receiverId",
  protect,
  createConversation
);

chatrouter.get(
  "/conversation",
  protect,
  getUserConversations
);

chatrouter.post(
  "/message/:conversationId",
  protect,
  sendMessage
);

chatrouter.get(
  "/message/:conversationId",
  protect,
  getMessages
);

chatrouter.put(
  "/seen/:conversationId",
  protect,
  markMessagesSeen
);

chatrouter.get(
  "/unread-count",
  protect,
  getUnreadMessageCount
);

chatrouter.put(
  "/seen/:conversationId",
  protect,
  markMessagesSeen
);

chatrouter.get(
  "/header/:conversationId",
  protect,
  getChatHeader
);

export default chatrouter;